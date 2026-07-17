// Blocks user-initiated scrolling while the tour is open.
//
// wheel/touchmove/keydown are intercepted directly since they're the source
// events for scrolling anywhere on the page, including nested scrollable
// containers. Programmatic scrolling (Element.scrollIntoView, window.scrollTo,
// etc.) doesn't fire these events, so it stays unaffected.
//
// The page's own scrollbar can't be blocked that way — dragging the thumb
// (or middle-click autoscroll) fires 'scroll' directly with no preventable
// source event. Instead we remove the document's ability to scroll at all via
// `overflow: hidden` on <html>/<body>. Per the CSS Overflow spec, `hidden`
// disables scrollbars and user-generated scrolling but the box remains a
// scroll container for *programmatic* scrolling — so OnboardingItem's
// scrollIntoView still works while locked. Removing the scrollbar shrinks the
// content area by its width, which reads as a page "shake"; a matching
// `padding-right` on <body> reserves that space back so nothing shifts.
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

// Elements that use these keys themselves (button activation, text editing,
// native form controls) — don't steal the keystroke from them.
const INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A']);

function isInteractive(target) {
  return !!target && (INTERACTIVE_TAGS.has(target.tagName) || target.isContentEditable);
}

function preventDefault(e) {
  if (e.cancelable) {
    e.preventDefault();
  }
}

function preventScrollKey(e) {
  if (SCROLL_KEYS.has(e.key) && !isInteractive(e.target) && e.cancelable) {
    e.preventDefault();
  }
}

// Ref-counted so that multiple <Onboarding> instances open at once (e.g.
// separate tours in different areas of the same page) don't have one
// instance's unlock() clear the lock while another is still relying on it.
let _refCount = 0;

let _htmlOverflow = '';
let _bodyOverflow = '';
let _bodyPaddingRight = '';
let _scrollX = 0;
let _scrollY = 0;
let _usedOverflowLock = false;

function lockOverflow() {
  const html = document.documentElement;
  const body = document.body;
  const scrollbarWidth = window.innerWidth - html.clientWidth;

  // Elegantly skip the CSS overflow lock if the scrollbar doesn't take up physical space 
  // (e.g. mobile devices and macOS overlay scrollbars). This natively prevents the iOS Safari 
  // scrollIntoView bugs from occuring without requiring any brittle device detection.
  if (scrollbarWidth === 0) {
    _usedOverflowLock = false;
    return;
  }

  _usedOverflowLock = true;

  _htmlOverflow = html.style.overflow;
  _bodyOverflow = body.style.overflow;
  _bodyPaddingRight = body.style.paddingRight;
  // OnboardingItem scrolls the page to bring each step's target into view, so by
  // the time the tour closes the page usually isn't where the user started —
  // most noticeably on narrow/mobile layouts where more steps need scrolling.
  // Save the pre-tour position so unlockOverflow() can put the user back.
  _scrollX = window.scrollX;
  _scrollY = window.scrollY;

  const currentPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
  body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;

  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
}

function unlockOverflow() {
  if (!_usedOverflowLock) return;

  document.documentElement.style.overflow = _htmlOverflow;
  document.body.style.overflow = _bodyOverflow;
  document.body.style.paddingRight = _bodyPaddingRight;
  window.scrollTo(_scrollX, _scrollY);

  // Clean up
  _htmlOverflow = '';
  _bodyOverflow = '';
  _bodyPaddingRight = '';
}

export default class ScrollLock {
  static lock = () => {
    if (typeof document === 'undefined') return;
    _refCount++;
    if (_refCount > 1) return;
    lockOverflow();
    document.addEventListener('wheel', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('keydown', preventScrollKey, { passive: false });
  }

  static unlock = () => {
    if (typeof document === 'undefined' || _refCount === 0) return;
    _refCount--;
    if (_refCount > 0) return;
    unlockOverflow();
    document.removeEventListener('wheel', preventDefault);
    document.removeEventListener('touchmove', preventDefault);
    document.removeEventListener('keydown', preventScrollKey);
  }
}
