/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import CONSTANTS from './constants'
import OnboardingDiv from './onboarding-div'
import OnboardingTag from './OnboardingTag'
import ScrollLock from './scroll-lock'

// Z-index layers:
//   onboarding-div  (dark spotlight)   99998
//   overlay         (interaction lock) 99999
//   tooltip                           100000

class Onboarding extends Component {
  static current = null;

  constructor(props) {
    super(props);
    Onboarding.current = this;
    // Start closed — componentDidMount reads localStorage (client-only) and opens if needed.
    // This is SSR-safe: `open: false` means nothing renders on the server, preventing
    // hydration mismatches in Next.js / React Server Components environments.
    this.state = {
      activeStep: 0,
      open: false,
      // Gates the full-screen overlay's click-to-advance behavior. Must stay
      // false until the active child reports itself visible via _onReady —
      // otherwise a tooltip stuck invisible (e.g. mid scroll-settle) leaves
      // a fully interactive, invisible overlay that silently completes the
      // tour on tap (see onboarding-div.js / OnboardingItem.js).
      ready: false,
    };
    this._mountedHref = '';
    this._retryRaf = null;
    this._retryStart = null;
  }

  componentDidMount() {
    // All browser APIs (localStorage, document, window) are safe here — this hook
    // never runs on the server, so no SSR crash in Next.js or similar frameworks.
    OnboardingDiv.create();
    this._mountedHref = window.location.href;
    document.addEventListener('keydown', this._onKey);

    const flag = localStorage.getItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + this.props.name);
    if (flag === null || flag === '') {
      this.setState({ open: true });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKey);
    if (window.location.href !== this._mountedHref) {
      OnboardingDiv.clear();
    }
    if (this.state.open) ScrollLock.unlock();
    if (this._retryRaf) cancelAnimationFrame(this._retryRaf);
  }

  // Prevents the user from scrolling the page behind the tour so the
  // highlighted element can't drift out of the spotlight while a step is
  // showing. Locks via overflow:hidden (see scroll-lock.js) which still
  // permits OnboardingItem's own programmatic scrollIntoView between steps.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      if (this.state.open) ScrollLock.lock();
      else ScrollLock.unlock();
    }
  }

  _onKey = (e) => {
    if (!this.state.open) return;
    if (e.key === 'Escape') this.handleClose();
    else if (e.key === 'ArrowRight' || e.key === 'Enter') this.handleNext();
    else if (e.key === 'ArrowLeft') this.handleBack();
  }

  static reset() {
    if (typeof localStorage === 'undefined') return;
    // Object.keys() is safe — for...in iterates the prototype chain too
    Object.keys(localStorage)
      .filter(k => k.startsWith(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX))
      .forEach(k => localStorage.setItem(k, ''));
    Onboarding.current && Onboarding.current.setState({ open: true, activeStep: 0 });
  }

  handleClose = () => {
    OnboardingDiv.clear();
    this.setState({ open: false, activeStep: 0 });
    localStorage.setItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + this.props.name, 'true');
  }

  _getChildArray = () => {
    const all = React.Children.toArray(this.props.children);
    const filtered = all.filter(child => {
      const id = child.props && child.props.elementID;
      if (typeof id === 'string') return document.getElementById(id) !== null;
      return true;
    });
    // A step's target can mount asynchronously (lazy content, slow hydration)
    // after this render already ran. Filtering it out here is a one-shot
    // check — without a retry it's silently and permanently dropped from
    // the tour rather than picked up once it exists.
    if (filtered.length < all.length) this._scheduleChildRetry();
    return filtered.concat(OnboardingTag.TagItems);
  }

  _scheduleChildRetry = () => {
    if (this._retryRaf) return;
    this._retryStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const MAX_WAIT_MS = 1500;

    const poll = () => {
      if (!this.state.open) { this._retryRaf = null; return; }

      const all = React.Children.toArray(this.props.children);
      const resolvedCount = all.filter(child => {
        const id = child.props && child.props.elementID;
        return typeof id !== 'string' || document.getElementById(id) !== null;
      }).length;

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (resolvedCount === all.length || now - this._retryStart > MAX_WAIT_MS) {
        this._retryRaf = null;
        this.forceUpdate();
        return;
      }
      this._retryRaf = requestAnimationFrame(poll);
    };

    this._retryRaf = requestAnimationFrame(poll);
  }

  handleNext = () => {
    const total = this._getChildArray().length;
    if (this.state.activeStep >= total - 1) this.handleClose();
    else this.setState(s => ({ activeStep: s.activeStep + 1, ready: false }));
  }

  handleBack = () => {
    if (this.state.activeStep > 0)
      this.setState(s => ({ activeStep: s.activeStep - 1, ready: false }));
  }

  _setReady = (ready) => {
    this.setState({ ready });
  }

  render() {
    const { open, activeStep, ready } = this.state;
    if (!open) return null;

    const children = this._getChildArray();
    const total = children.length;
    if (total === 0) return null;

    const step = Math.min(activeStep, total - 1);
    const isFirst = step === 0;
    const isLast = step >= total - 1;

    // Inject navigation props into the active child — OnboardingItem reads them
    // to render its embedded Back/Next/Done controls and progress dots.
    const activeChild = React.cloneElement(children[step], {
      _onNext: this.handleNext,
      _onBack: this.handleBack,
      _onClose: this.handleClose,
      _step: step,
      _total: total,
      _isFirst: isFirst,
      _isLast: isLast,
      _onReady: this._setReady,
    });

    return (
      <Fragment>
        {/* Full-screen overlay — blocks interaction with underlying page.
            Clicking the dark area advances the tour (like a slide presentation).
            Click-to-advance only fires once the active step has confirmed it's
            actually visible (ready) — otherwise this element still blocks the
            page but silently eats clicks instead of skipping steps blind. */}
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            cursor: ready ? 'pointer' : 'default',
            touchAction: 'pan-x pan-y',
            // Android shows a translucent tap-highlight flash on any element
            // with an onClick unless this is suppressed — visible as a "blue
            // flicker" across the full screen on every tap here.
            WebkitTapHighlightColor: 'transparent',
          }}
          onClick={ready ? this.handleNext : undefined}
          role="dialog"
          aria-modal="true"
          aria-label="Onboarding tour"
        />

        {activeChild}
      </Fragment>
    );
  }
}

export default Onboarding;
