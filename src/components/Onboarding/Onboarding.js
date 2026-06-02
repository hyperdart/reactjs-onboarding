/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import CONSTANTS from './constants'
import OnboardingDiv from './onboarding-div'
import OnboardingTag from './OnboardingTag'

// Z-index layers:
//   onboarding-div (dark spotlight)  99998
//   overlay + arrow SVG              99999
//   message box (white card)        100000
//   controls + skip                 100001

const S = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 99999,
    cursor: 'pointer',
    outline: 'none',
  },
  // Solid dark pill so controls are clearly above the overlay, not lost in it
  controls: {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 100001,
    background: 'rgba(17, 17, 17, 0.78)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '40px',
    padding: '8px 14px',
    whiteSpace: 'nowrap',
  },
  navBtn: (disabled) => ({
    background: 'none',
    border: 'none',
    color: disabled ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.9)',
    fontSize: '22px',
    lineHeight: '1',
    cursor: disabled ? 'default' : 'pointer',
    padding: '0',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    transition: 'color 0.15s',
    flexShrink: 0,
  }),
  // Solid white pill for the Done button — stands out clearly
  doneBtn: {
    background: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '5px 16px',
    color: '#111827',
    fontSize: '13px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: 600,
    letterSpacing: '0.2px',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    flexShrink: 0,
  },
  dot: (active) => ({
    width: active ? '8px' : '5px',
    height: active ? '8px' : '5px',
    borderRadius: '50%',
    background: active ? 'white' : 'rgba(255,255,255,0.3)',
    transition: 'all 0.25s ease',
    flexShrink: 0,
  }),
  stepLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    minWidth: '40px',
    textAlign: 'center',
  },
  skip: {
    position: 'fixed',
    bottom: '38px',
    right: '32px',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    cursor: 'pointer',
    zIndex: 100001,
    padding: '6px 8px',
    letterSpacing: '0.3px',
    transition: 'color 0.15s',
  },
};

class Onboarding extends Component {
  static current = null;

  constructor(props) {
    super(props);
    Onboarding.current = this;
    const demoFlag = localStorage.getItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + this.props.name);
    this.state = {
      activeStep: 0,
      open: demoFlag === null || demoFlag === '',
    };
    OnboardingDiv.create();
    this._mountedHref = window.location.href;
  }

  componentDidMount() {
    document.addEventListener('keydown', this._handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._handleKeyDown);
    if (window.location.href !== this._mountedHref) {
      OnboardingDiv.clear();
    }
  }

  _handleKeyDown = (e) => {
    if (!this.state.open) return;
    if (e.key === 'Escape') this.handleClose();
    else if (e.key === 'ArrowRight' || e.key === 'Enter') this.handleNext();
    else if (e.key === 'ArrowLeft') this.handleBack();
  }

  static reset() {
    for (let obj in localStorage) {
      if (obj.startsWith(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX)) {
        localStorage.setItem(obj, '');
      }
    }
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
    const childArray = this._getChildArray();
    if (this.state.activeStep >= childArray.length - 1) {
      this.handleClose();
    } else {
      this.setState(prev => ({ activeStep: prev.activeStep + 1 }));
    }
  }

  handleBack = () => {
    if (this.state.activeStep > 0) {
      this.setState(prev => ({ activeStep: prev.activeStep - 1 }));
    }
  }

  render() {
    const { activeStep, open } = this.state;
    if (!open) return null;

    const childArray = this._getChildArray();
    const childCount = childArray.length;
    if (childCount === 0) return null;

    const step = Math.min(activeStep, childCount - 1);
    const activeChild = childArray[step];
    const isFirst = step === 0;
    const isLast = step >= childCount - 1;
    const showDots = childCount <= 10;

    return (
      <Fragment>
        {/* Full-screen click catcher — sits above the dark spotlight, contains the arrow SVG */}
        <div
          style={S.overlay}
          onClick={this.handleNext}
          role="dialog"
          aria-modal="true"
          aria-label="Onboarding tour"
          tabIndex={-1}
        >
          {activeChild}
        </div>

        {/* Controls pill — stop propagation so clicks here don't fire handleNext */}
        <div style={S.controls} onClick={e => e.stopPropagation()}>
          <button
            style={S.navBtn(isFirst)}
            onClick={this.handleBack}
            disabled={isFirst}
            aria-label="Previous step"
          >
            ‹
          </button>

          {showDots
            ? childArray.map((_, i) => <span key={i} style={S.dot(i === step)} aria-hidden="true" />)
            : <span style={S.stepLabel}>{step + 1} / {childCount}</span>
          }

          <button
            style={isLast ? S.doneBtn : S.navBtn(false)}
            onClick={isLast ? this.handleClose : this.handleNext}
            aria-label={isLast ? 'Finish tour' : 'Next step'}
          >
            {isLast ? 'Done' : '›'}
          </button>
        </div>

        <button
          style={S.skip}
          onClick={this.handleClose}
          aria-label="Skip tour"
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          Skip tour
        </button>
      </Fragment>
    );
  }
}

export default Onboarding;
