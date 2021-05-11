import * as React from 'react'
import {render} from '../'

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  (console.log as jest.Mock).mockRestore()
})

test('debug pretty prints the container', () => {
  const HelloWorld = () => <h1>Hello World</h1>
  const {debug} = render(<HelloWorld />)
  debug()
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log).toHaveBeenCalledWith(
    expect.stringContaining('Hello World'),
  )
})

test('debug pretty prints multiple containers', () => {
  const HelloWorld = () => (
    <>
      <h1 data-testid="testId">Hello World</h1>
      <h1 data-testid="testId">Hello World</h1>
    </>
  )
  const {debug, getAllByTestId} = render(<HelloWorld />)
  const multipleElements = getAllByTestId('testId') as Element[]
  debug(multipleElements)

  expect(console.log).toHaveBeenCalledTimes(2)
  expect(console.log).toHaveBeenCalledWith(
    expect.stringContaining('Hello World'),
  )
})

test('allows same arguments as prettyDOM', () => {
  const HelloWorld = () => <h1>Hello World</h1>
  const {debug, container} = render(<HelloWorld />)
  debug(container, 6, {highlight: false})
  expect(console.log).toHaveBeenCalledTimes(1)
  expect((console.log as jest.Mock).mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "<div>
    ...",
    ]
  `)
})

/*
eslint
  no-console: "off",
  testing-library/no-debug: "off",
*/
