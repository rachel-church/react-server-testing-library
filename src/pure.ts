import React from 'react'
import {JSDOM} from 'jsdom';
import ReactDOMServer from "react-dom/server";
import {
  getQueriesForElement,
  prettyFormat,
  prettyDOM,
  Queries,
} from '@testing-library/dom'

const DEFAULT_HTML = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';

export interface RenderOptions<Q extends Queries = Queries> {
  queries?: Q
  wrapper?: React.ComponentType
}

function render<Q extends Queries = Queries>(
    ui: React.ReactElement,
    options: RenderOptions<Q> = {},
) {
  const {
    queries,
    wrapper: WrapperComponent,
  } = options;
  if (typeof document !== 'undefined' || typeof window !== 'undefined') {
    throw new Error(
        'render should only be called from a "node" test environment and not "jsdom".',
    );
  }

  const jsdomInstance = new JSDOM(DEFAULT_HTML);
  const win = jsdomInstance.window;
  const doc = win.document;
  const baseElement = doc.body;
  win.console = global.console;

  const container = baseElement.appendChild(doc.createElement('div'))

  const wrapUiIfNeeded = (innerElement: React.ReactElement) =>
      WrapperComponent
          ? React.createElement(WrapperComponent, null, innerElement)
          : innerElement

  const htmlStr = ReactDOMServer.renderToStaticMarkup(wrapUiIfNeeded(ui));
  const jsdomFragment = JSDOM.fragment(htmlStr);
  container.appendChild(jsdomFragment);

  const debug = (el: Array<Element | HTMLDocument> | Element | HTMLDocument = baseElement, maxLength?: number, prettyOptions?: prettyFormat.OptionsReceived) =>
      Array.isArray(el)
          ? // eslint-disable-next-line no-console
          el.forEach((e?: Element | HTMLDocument) => console.log(prettyDOM(e, maxLength, prettyOptions)))
          : // eslint-disable-next-line no-console,
          console.log(prettyDOM(el, maxLength, prettyOptions))

  return {
    window: win,
    container,
    baseElement,
    debug,
    asFragment: () => {
      /* istanbul ignore else (old jsdom limitation) */
      if (typeof doc.createRange === 'function') {
        return doc
            .createRange()
            .createContextualFragment(container.innerHTML)
      } else {
        const template = doc.createElement('template')
        template.innerHTML = container.innerHTML
        return template.content
      }
    },
    ...getQueriesForElement(baseElement, queries),
  }
}

export {render}
