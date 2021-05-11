import * as React from 'react'
import {render} from '../'

describe('render', () => {
  test('renders div into document', () => {
    const {container} = render(<div id="helloWorld" />)
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        id="helloWorld"
      />
    `)
  })

  test('returns baseElement which defaults to document.body', () => {
    const {baseElement, window} = render(<div id="helloWorld" />)
    expect(baseElement).toBe(window.document.body)
  })

  test('supports fragments', () => {
    class Test extends React.Component {
      render() {
        return (
          <div>
            <code>DocumentFragment</code> is pretty cool!
          </div>
        )
      }
    }

    const {asFragment} = render(<Test />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders options.wrapper around node', () => {
    const WrapperComponent: React.FC = ({children}) => (
      <div data-testid="wrapper">{children}</div>
    )

    const {container} = render(<div data-testid="inner" />, {
      wrapper: WrapperComponent,
    })

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        data-testid="wrapper"
      >
        <div
          data-testid="inner"
        />
      </div>
    `)
  })

  test('does not trigger events', () => {
    const spy = jest.fn()
    function Component() {
      React.useEffect(spy, [])
      return null
    }
    render(<Component />)
    expect(spy).toHaveBeenCalledTimes(0)
  })

  test('multiple renders are isolates trees from one another', () => {
    const {getByText: getByTextInA} = render(<div>Jekyll</div>)
    const {getByText: getByTextInB} = render(<div>Hyde</div>)

    expect(() => getByTextInA('Jekyll')).not.toThrow(
        'Unable to find an element with the text: Jekyll.',
    )
    expect(() => getByTextInB('Jekyll')).toThrow(
        'Unable to find an element with the text: Jekyll.',
    )

    expect(() => getByTextInA('Hyde')).toThrow(
        'Unable to find an element with the text: Hyde.',
    )
    expect(() => getByTextInB('Hyde')).not.toThrow(
        'Unable to find an element with the text: Hyde.',
    )
  })
})
