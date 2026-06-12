/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import CONSTANTS from './constants'
import OnboardingDiv from './onboarding-div'
import OnboardingTag from './OnboardingTag'

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
    };
    this._mountedHref = '';
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
    const filtered = React.Children.toArray(this.props.children).filter(child => {
      const id = child.props && child.props.elementID;
      if (typeof id === 'string') return document.getElementById(id) !== null;
      return true;
    });
    return filtered.concat(OnboardingTag.TagItems);
  }

  handleNext = () => {
    const total = this._getChildArray().length;
    if (this.state.activeStep >= total - 1) this.handleClose();
    else this.setState(s => ({ activeStep: s.activeStep + 1 }));
  }

  handleBack = () => {
    if (this.state.activeStep > 0)
      this.setState(s => ({ activeStep: s.activeStep - 1 }));
  }

  render() {
    const { open, activeStep } = this.state;
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
    });

    return (
      <Fragment>
        {/* Full-screen overlay — blocks interaction with underlying page.
            Clicking the dark area advances the tour (like a slide presentation). */}
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            cursor: 'pointer',
          }}
          onClick={this.handleNext}
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
