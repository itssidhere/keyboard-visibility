# keyboard-visibility

A React hook to detect keyboard visibility and offset using the VisualViewport API.

## Installation

Install the package using npm:

```bash
npm install keyboard-visibility
```

## Usage

```jsx
import React from 'react';
import useKeyboardVisibility from 'keyboard-visibility';

const App = () => {
  const { isKeyboardVisible, keyboardOffset } = useKeyboardVisibility();

  return (
    <div style={{ marginBottom: isKeyboardVisible ? keyboardOffset : 0 }}>
      <h1>Keyboard Visibility Hook</h1>
    </div>
  );
};

export default App;
```


## Example
```jsx
import React from 'react';
import useKeyboardVisibility from 'keyboard-visibility';

const ExampleComponent = () => {
  const { isKeyboardVisible, keyboardOffset } = useKeyboardVisibility();

  return (
    <div>
      <p>Keyboard is {isKeyboardVisible ? 'visible' : 'hidden'}</p>
      <div style={{ marginBottom: isKeyboardVisible ? keyboardOffset : 0 }}>
        <input type="text" placeholder="Focus me to see the keyboard" />
      </div>
    </div>
  );
};

export default ExampleComponent;
```