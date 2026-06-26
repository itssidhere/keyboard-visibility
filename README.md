# keyboard-visibility

[![npm version](https://img.shields.io/npm/v/keyboard-visibility.svg)](https://www.npmjs.com/package/keyboard-visibility)
[![npm downloads](https://img.shields.io/npm/dm/keyboard-visibility.svg)](https://www.npmjs.com/package/keyboard-visibility)
[![license](https://img.shields.io/npm/l/keyboard-visibility.svg)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/keyboard-visibility)](https://bundlephobia.com/package/keyboard-visibility)

A lightweight React hook to detect on-screen keyboard visibility and height offset using the [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API). Designed for mobile web apps where the soft keyboard pushes content up and breaks layouts.

## Why

On mobile browsers, when the soft keyboard opens, `window.innerHeight` doesn't update reliably across all browsers. The VisualViewport API gives you the true visible area. This hook abstracts that into a simple `isKeyboardVisible` flag and a `keyboardOffset` value you can use to adjust your layout.

## Installation

```bash
npm install keyboard-visibility
# or
yarn add keyboard-visibility
# or
pnpm add keyboard-visibility
```

## Usage

```tsx
import useKeyboardVisibility from 'keyboard-visibility';

const ChatInput = () => {
  const { isKeyboardVisible, keyboardOffset } = useKeyboardVisibility();

  return (
    <div style={{ paddingBottom: isKeyboardVisible ? keyboardOffset : 0 }}>
      <input type="text" placeholder="Type a message..." />
    </div>
  );
};
```

## API

### `useKeyboardVisibility()`

Returns an object with:

| Property | Type | Description |
|---|---|---|
| `isKeyboardVisible` | `boolean` | `true` when the soft keyboard is open |
| `keyboardOffset` | `number` | Height in pixels the keyboard is pushing the viewport up. `0` when keyboard is hidden. |

## Common Patterns

**Slide content above the keyboard:**
```tsx
const { isKeyboardVisible, keyboardOffset } = useKeyboardVisibility();

<div style={{ transform: `translateY(-${isKeyboardVisible ? keyboardOffset : 0}px)` }}>
  {/* your content */}
</div>
```

**Show/hide a bottom bar when keyboard opens:**
```tsx
const { isKeyboardVisible } = useKeyboardVisibility();

{!isKeyboardVisible && <BottomNavBar />}
```

**Scroll to bottom of a chat after keyboard opens:**
```tsx
const { isKeyboardVisible } = useKeyboardVisibility();
const bottomRef = useRef(null);

useEffect(() => {
  if (isKeyboardVisible) {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [isKeyboardVisible]);
```

## Browser Support

This hook relies on the [VisualViewport API](https://caniuse.com/visual-viewport). It is supported in all modern mobile browsers (Chrome, Safari, Firefox for Android). If the API is unavailable, the hook safely returns `isKeyboardVisible: false` and `keyboardOffset: 0` without throwing.

| Browser | Support |
|---|---|
| Chrome for Android | ✅ |
| Safari on iOS | ✅ |
| Firefox for Android | ✅ |
| Desktop browsers | `isKeyboardVisible` will always be `false` |
| SSR (Next.js, etc.) | Safe — no `window` access during server render |

## TypeScript

This package ships with TypeScript types. The return type is:

```ts
interface KeyboardVisibility {
  isKeyboardVisible: boolean;
  keyboardOffset: number;
}
```

## License

MIT
