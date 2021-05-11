<div align="center">
<h1>React Server Testing Library</h1>

<p>A lightweight solution for testing isomorphic React components rendered on the server based on @testing-library/dom.</p>
</div>

<hr />

Inspired by issue [#561](https://github.com/testing-library/react-testing-library/issues/561) filed
in `@testing-library/react` requesting support for testing react components rendered on the server.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should be installed as one of your
project's `devDependencies`:

```
npm install --save-dev react-server-testing-library
```

or

for installation via [yarn][yarn]

```
yarn add --dev react-server-testing-library
```

This library has `peerDependencies` listings for `react` and `react-dom`.

You may also be interested in installing `@testing-library/jest-dom` so you can
use [the custom jest matchers](https://github.com/testing-library/jest-dom).

Note that you won't be able to use matchers such as `toBeInTheDocument` that expect a global document to exist. We are
rendering on the server after all.

> [**Docs**](https://testing-library.com/react)

## Configuring Jest

The default `testEnvironment` config option for jest is `jsdom` which emulates a browser environment. Since we are
trying to render components on the server we need a `node` test environment.

If the majority of your tests will be server-side (`node`) then you can set the `testEnvironment` in
your `jest.config.js` or `jest.config.ts` file to `node`.

Alternatively, if you have a mix of client and server side unit tests you can set the `testEnvironment` per test file by
adding a `@jest-environment` docblock at the top of the file:

```js
/**
 * @jest-environment node
 */
```

> [**Docs**](https://jestjs.io/docs/configuration#testenvironment-string)

## Basic Example

We have a `HiddenMessage` component that is dependent upon `window.localStorage`, which won't be available on the server
during SSR, and we want to write a test to ensure this component is isomorphic.

```jsx
// hidden-message.js
import * as React from 'react';

function HiddenMessage({ children }) {
  const [showMessage, setShowMessage] = React.useState(false);

  React.useEffect(() => {
    // Load the saved input value from localStorage
    const { showMessage } = localStorage;

    if (showMessage !== undefined) {
      setShowMessage(JSON.parse(localStorage.showMessage));
    }
  }, []);

  const handleToggleChange = (e) => {
    // Save the toggle value to localStorage when it changes
    localStorage.showMessage = JSON.stringify(e.target.checked);
    setShowMessage(e.target.checked);
  };

  return (
    <div>
      <label htmlFor="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        onChange={handleToggleChange}
        checked={showMessage}
      />
      {showMessage ? children : null}
    </div>
  );
}

export default HiddenMessage;
```

```jsx
// __tests__/hidden-message.js
/**
 * @jest-environment node
 */
import * as React from 'react';
import { render } from 'react-server-testing-library';
import HiddenMessage from '../hidden-message';

test('defaults to hiding the message', () => {
  const testMessage = 'Test Message';
  render(<HiddenMessage>{testMessage}</HiddenMessage>);

  // query* functions will return the element or null if it cannot be found
  // get* functions will return the element or throw an error if it cannot be found
  expect(screen.queryByText(testMessage)).toBeNull();
});
```
