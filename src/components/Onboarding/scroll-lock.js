// Blocks user-initiated scrolling (wheel, touch drag, keyboard) while the
// tour is open, without touching overflow/scrollbar CSS — toggling that
// makes the scrollbar appear/disappear and the page reflow/shift, which
// looks like a shake. Programmatic scrolling (Element.scrollIntoView,
// window.scrollTo, etc.) doesn't fire these events, so it stays unaffected.
// Known gap: scrollbar-thumb dragging and middle-click autoscroll panning
// aren't intercepted by any of the events below, so they still scroll the
// page — covering them would mean snapping scroll position on every
// 'scroll' event, which would fight OnboardingItem's own scrollIntoView.
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

// Elements that use these keys themselves (button activation, text editing,
// native form controls) — don't steal the keystroke from them.
const INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A']);

function isInteractive(target) {
  return !!target && (INTERACTIVE_TAGS.has(target.tagName) || target.isContentEditable);
}

function preventDefault(e) {
  e.preventDefault();
}

function preventScrollKey(e) {
  if (SCROLL_KEYS.has(e.key) && !isInteractive(e.target)) e.preventDefault();
}

// Ref-counted so that multiple <Onboarding> instances open at once (e.g.
// separate tours in different areas of the same page) don't have one
// instance's unlock() clear the lock while another is still relying on it.
let _refCount = 0;

export default class ScrollLock {
  static lock = () => {
    if (typeof document === 'undefined') return;
    _refCount++;
    if (_refCount > 1) return;
    document.addEventListener('wheel', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('keydown', preventScrollKey, { passive: false });
  }

  static unlock = () => {
    if (typeof document === 'undefined' || _refCount === 0) return;
    _refCount--;
    if (_refCount > 0) return;
    document.removeEventListener('wheel', preventDefault);
    document.removeEventListener('touchmove', preventDefault);
    document.removeEventListener('keydown', preventScrollKey);
  }
}
