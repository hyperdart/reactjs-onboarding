/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import ArrowCurved from './cb-arrow.js'
import OnboardingDiv from './onboarding-div'

if (typeof document !== 'undefined' && !document.getElementById('__ob_styles')) {
  const style = document.createElement('style');
  style.id = '__ob_styles';
  style.textContent = '@keyframes obIn{from{opacity:0;transform:translate(-50%,-48%)}to{opacity:1;transform:translate(-50%,-50%)}} @keyframes obInTop{from{opacity:0}to{opacity:1}}';
  document.head.appendChild(style);
}

const getMsgBoxStyle = (top) => ({
  position: 'fixed',
  top: top !== undefined ? top : '50%',
  left: '50%',
  transform: top !== undefined ? 'translateX(-50%)' : 'translate(-50%, -50%)',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px 32px',
  maxWidth: '320px',
  width: 'calc(100vw - 64px)',
  boxSizing: 'border-box',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 20px 48px rgba(0,0,0,0.38)',
  pointerEvents: 'none',
  zIndex: 100000,
  animation: top !== undefined ? 'obInTop 0.2s ease-out' : 'obIn 0.2s ease-out',
});

const msgTextStyle = {
  color: '#111827',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.65,
  margin: 0,
  textAlign: 'center',
};

class OnboardingItem extends Component {
  constructor(props) {
    super(props);
    this.msgBox = React.createRef();
    this._raf = null;
    this.state = {
      msgBoxRect: null,
      targetRect: null,
      disableArrow: props.disableArrow !== undefined ? props.disableArrow : false,
    };
  }

  componentDidMount() {
    this.computeStartEndPosition();
    window.addEventListener('resize', this._onResize);
    // Bubble phase only — avoids firing for every scroll inside nested elements
    window.addEventListener('scroll', this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('scroll', this._onResize);
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.elementID !== this.props.elementID ||
      prevProps.elementCoOrdinate !== this.props.elementCoOrdinate
    ) {
      this.computeStartEndPosition();
      return;
    }
    // Update spotlight when targetRect changes — kept out of render() to avoid side-effect in render
    if (prevState.targetRect !== this.state.targetRect) {
      OnboardingDiv.setTarget(this.state.targetRect, this.props.disableArrow);
    }
  }

  _onResize = () => {
    // Throttle via rAF so rapid scroll/resize bursts don't cause continuous re-renders
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(this.computeStartEndPosition);
  }

  computeStartEndPosition = () => {
    const { elementID, elementCoOrdinate } = this.props;

    // Read both rects before calling setState so both go into a single update —
    // two separate setState calls would cause two renders; the first would briefly
    // render the arrow with one stale rect, causing visible flicker.
    const msgBoxRect = (this.msgBox.current && this.msgBox.current.getBoundingClientRect)
      ? this.msgBox.current.getBoundingClientRect()
      : this.state.msgBoxRect;

    const el = typeof elementID === 'string'
      ? document.getElementById(elementID)
      : (typeof elementID === 'object' ? elementID : null);

    let targetRect = null;
    if (typeof elementCoOrdinate === 'object' && elementCoOrdinate !== null) {
      targetRect = {
        left: elementCoOrdinate.l || 0,
        top: elementCoOrdinate.t || 0,
        width: elementCoOrdinate.w || 0,
        height: elementCoOrdinate.h || 0,
        right: (elementCoOrdinate.l || 0) + (elementCoOrdinate.w || 0),
        bottom: (elementCoOrdinate.t || 0) + (elementCoOrdinate.h || 0),
      };
    } else if (typeof elementID === 'string' || typeof elementID === 'object') {
      targetRect = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    }

    // Direct DOM update first — spotlight repositions immediately without waiting for setState
    OnboardingDiv.setTarget(targetRect, this.props.disableArrow);

    // Single batched setState — one render, no intermediate flicker state
    this.setState({ msgBoxRect, targetRect });
  }

  render() {
    // NOTE: no OnboardingDiv.setTarget here — side effects in render() cause flicker
    // because React may call render() multiple times before committing.
    const { msgBoxRect, targetRect, disableArrow } = this.state;
    const { message, top } = this.props;

    return (
      <Fragment>
        {!disableArrow && (
          <ArrowCurved color="white" width={2} startBox={msgBoxRect} endBox={targetRect} />
        )}
        <div ref={this.msgBox} style={getMsgBoxStyle(top)}>
          <p style={msgTextStyle}>{message}</p>
        </div>
      </Fragment>
    );
  }
}

export default OnboardingItem;
