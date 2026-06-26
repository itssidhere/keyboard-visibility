import { renderHook, act } from '@testing-library/react';
import useKeyboardVisibility from '../useKeyboardVisibility';

// VisualViewport.height/offsetTop are readonly in the DOM types, so we back
// the mock with a mutable state object accessed via getters.
function makeViewport(initialHeight: number, initialOffsetTop = 0) {
  const et = new EventTarget();
  const state = { height: initialHeight, offsetTop: initialOffsetTop };

  Object.defineProperties(et, {
    height:    { get: () => state.height,    configurable: true },
    offsetTop: { get: () => state.offsetTop, configurable: true },
    width:     { value: 375, configurable: true },
    scale:     { value: 1,   configurable: true },
    offsetLeft: { value: 0,  configurable: true },
    pageLeft:  { value: 0,   configurable: true },
    pageTop:   { value: 0,   configurable: true },
    onresize:  { value: null, writable: true, configurable: true },
    onscroll:  { value: null, writable: true, configurable: true },
    onscrollend: { value: null, writable: true, configurable: true },
  });

  return {
    viewport: et as unknown as VisualViewport,
    setHeight: (h: number) => { state.height = h; },
    setOffsetTop: (o: number) => { state.offsetTop = o; },
  };
}

const WINDOW_HEIGHT = 844;

beforeEach(() => {
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: WINDOW_HEIGHT,
  });
});

afterEach(() => {
  // @ts-ignore
  delete window.visualViewport;
});

describe('useKeyboardVisibility', () => {
  it('returns false and 0 offset when viewport fills the window', () => {
    const { viewport } = makeViewport(WINDOW_HEIGHT);
    window.visualViewport = viewport;

    const { result } = renderHook(() => useKeyboardVisibility());

    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardOffset).toBe(0);
  });

  it('detects keyboard open when viewport height shrinks', () => {
    const keyboardHeight = 336;
    const { viewport, setHeight } = makeViewport(WINDOW_HEIGHT);
    window.visualViewport = viewport;

    const { result } = renderHook(() => useKeyboardVisibility());

    act(() => {
      setHeight(WINDOW_HEIGHT - keyboardHeight);
      viewport.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isKeyboardVisible).toBe(true);
    expect(result.current.keyboardOffset).toBe(keyboardHeight);
  });

  it('detects keyboard close when viewport height is restored', () => {
    const keyboardHeight = 336;
    const { viewport, setHeight } = makeViewport(WINDOW_HEIGHT - keyboardHeight);
    window.visualViewport = viewport;

    const { result } = renderHook(() => useKeyboardVisibility());
    expect(result.current.isKeyboardVisible).toBe(true);

    act(() => {
      setHeight(WINDOW_HEIGHT);
      viewport.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardOffset).toBe(0);
  });

  it('accounts for offsetTop in the offset calculation', () => {
    // offset = windowHeight - height - offsetTop = 844 - 500 - 44 = 300
    const { viewport } = makeViewport(500, 44);
    window.visualViewport = viewport;

    const { result } = renderHook(() => useKeyboardVisibility());

    expect(result.current.isKeyboardVisible).toBe(true);
    expect(result.current.keyboardOffset).toBe(300);
  });

  it('reacts to scroll events as well as resize events', () => {
    const { viewport, setHeight } = makeViewport(WINDOW_HEIGHT);
    window.visualViewport = viewport;

    const { result } = renderHook(() => useKeyboardVisibility());

    act(() => {
      setHeight(WINDOW_HEIGHT - 300);
      viewport.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isKeyboardVisible).toBe(true);
  });

  it('cleans up both event listeners on unmount', () => {
    const { viewport } = makeViewport(WINDOW_HEIGHT);
    window.visualViewport = viewport;

    const removeSpy = jest.spyOn(viewport, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyboardVisibility());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('returns safe defaults when visualViewport is unavailable', () => {
    // visualViewport not defined — older browsers / JSDOM default
    expect(() => {
      const { result } = renderHook(() => useKeyboardVisibility());
      expect(result.current.isKeyboardVisible).toBe(false);
      expect(result.current.keyboardOffset).toBe(0);
    }).not.toThrow();
  });
});
