/**
 * @jest-environment jsdom
 */
import * as React from 'react'
import {render} from '../'

test("can't call render in jsdom env", () => {
  expect(() => render(<div />)).toThrowErrorMatchingInlineSnapshot(
    `"render should only be called from a \\"node\\" test environment and not \\"jsdom\\"."`,
  )
})
