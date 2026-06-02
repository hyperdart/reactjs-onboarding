/*eslint-disable*/
import React, { Component } from 'react';
import OnboardingDiv from './onboarding-div'

const TW = 308;    // tooltip width px
const GAP = 14;    // gap between target and tooltip
const EDGE = 14;   // min distance from viewport edge

// Returns { p, top, left } for the best non-clipping placement.
// Guard for SSR — this function is only called from lifecycle methods (client-only)
// but the guard prevents any accidental server-side call from crashing.
function bestPlacement(targetRect, tooltipH) {
  if (typeof window === 'undefined') return { p: 'bottom', top: 0, left: 0 };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = targetRect.left + targetRect.width / 2;
  const cy = targetRect.top + targetRect.height / 2;

  const tries = [
    { p: 'bottom', top: targetRect.bottom + GAP,         left: cx - TW / 2 },
    { p: 'top',    top: targetRect.top - GAP - tooltipH, left: cx - TW / 2 },
    { p: 'right',  top: cy - tooltipH / 2,               left: targetRect.right + GAP },
    { p: 'left',   top: cy - tooltipH / 2,               left: targetRect.left - GAP - TW },
  ];

  for (const { p, top, left } of tries) {
    const l = Math.max(EDGE, Math.min(vw - TW - EDGE, left));
    const t = Math.max(EDGE, Math.min(vh - tooltipH - EDGE, top));
    // Fits without needing to clamp → perfect placement
    if (t === top && l === left) return { p, top: t, left: l };
  }

  // Nothing fits perfectly — fall back to below, clamped to screen
  const { top, left } = tries[0];
  return {
    p: 'bottom',
    top: Math.max(EDGE, Math.min(vh - tooltipH - EDGE, top)),
    left: Math.max(EDGE, Math.min(vw - TW - EDGE, left)),
  };
}

// Rotated-square CSS caret pointing toward the target element.
function Caret({ placement, targetRect, tooltipLeft, tooltipTop, tooltipH }) {
  if (!targetRect || !placement) return null;

  const SZ = 11;
  const HALF = SZ / 2;
  const cx = targetRect.left + targetRect.width / 2;
  const cy = targetRect.top + targetRect.height / 2;
  let style = null;

  if (placement === 'bottom') {
    const x = Math.max(SZ + 6, Math.min(TW - SZ - 6, cx - tooltipLeft));
    style = {
      position: 'absolute', top: -(HALF + 1), left: x - HALF,
      width: SZ, height: SZ, background: '#fff', transform: 'rotate(45deg)',
      boxShadow: '-1px -1px 3px rgba(0,0,0,0.07)',
    };
  } else if (placement === 'top') {
    const x = Math.max(SZ + 6, Math.min(TW - SZ - 6, cx - tooltipLeft));
    style = {
      position: 'absolute', bottom: -(HALF + 1), left: x - HALF,
      width: SZ, height: SZ, background: '#fafafa', transform: 'rotate(45deg)',
      boxShadow: '1px 1px 3px rgba(0,0,0,0.07)',
    };
  } else if (placement === 'right') {
    const y = Math.max(SZ + 6, Math.min(tooltipH - SZ - 6, cy - tooltipTop));
    style = {
      position: 'absolute', left: -(HALF + 1), top: y - HALF,
      width: SZ, height: SZ, background: '#fff', transform: 'rotate(45deg)',
      boxShadow: '-1px 1px 3px rgba(0,0,0,0.07)',
    };
  } else if (placement === 'left') {
    const y = Math.max(SZ + 6, Math.min(tooltipH - SZ - 6, cy - tooltipTop));
    style = {
      position: 'absolute', right: -(HALF + 1), top: y - HALF,
      width: SZ, height: SZ, background: '#fafafa', transform: 'rotate(45deg)',
      boxShadow: '1px -1px 3px rgba(0,0,0,0.07)',
    };
  }

  return style ? <div style={style} /> : null;
}

class OnboardingItem extends Component {
  constructor(props) {
    super(props);
    this.tooltipRef = React.createRef();
    this._raf = null;
    this.state = { targetRect: null, pos: null, ready: false };
  }

  componentDidMount() {
    this._compute();
    window.addEventListener('resize', this._schedule);
    window.addEventListener('scroll', this._schedule);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._schedule);
    window.removeEventListener('scroll', this._schedule);
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.elementID !== this.props.elementID ||
      prevProps.elementCoOrdinate !== this.props.elementCoOrdinate
    ) {
      this._compute();
      return;
    }
    if (prevState.targetRect !== this.state.targetRect) {
      OnboardingDiv.setTarget(this.state.targetRect, this.props.disableArrow);
    }
  }

  _schedule = () => {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(this._compute);
  }

  _compute = () => {
    const { elementID, elementCoOrdinate } = this.props;

    const el = typeof elementID === 'string'
      ? document.getElementById(elementID)
      : (typeof elementID === 'object' ? elementID : null);

    let targetRect = null;
    if (typeof elementCoOrdinate === 'object' && elementCoOrdinate !== null) {
      const { l = 0, t = 0, w = 0, h = 0 } = elementCoOrdinate;
      targetRect = { left: l, top: t, width: w, height: h, right: l + w, bottom: t + h };
    } else if (el && el.getBoundingClientRect) {
      targetRect = el.getBoundingClientRect();
    }

    // Update spotlight immediately (direct DOM — no setState lag)
    OnboardingDiv.setTarget(targetRect, this.props.disableArrow);

    if (!targetRect) {
      this.setState({ targetRect: null, pos: null, ready: true });
      return;
    }

    // Measure actual tooltip height from previous render (first render uses estimate 140)
    const tooltipH = this.tooltipRef.current
      ? this.tooltipRef.current.offsetHeight
      : 140;

    const pos = bestPlacement(targetRect, tooltipH);
    this.setState({ targetRect, pos, ready: true });
  }

  render() {
    const { message, _onNext, _onBack, _step, _total, _isFirst, _isLast } = this.props;
    const { pos, targetRect, ready } = this.state;

    const hasNav = _onNext !== undefined;
    const showDots = _total !== undefined && _total <= 10;

    // Outer wrapper: positioned (caret hangs outside, so overflow: visible)
    const outerStyle = pos
      ? {
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: TW,
          zIndex: 100000,
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.18s ease',
          // Smooth relocation when target changes between steps
          willChange: 'top, left',
        }
      : {
          // No target: center on screen
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: TW,
          zIndex: 100000,
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.18s ease',
        };

    // Body: rounded, clipped, shadow
    const bodyStyle = {
      borderRadius: 12,
      overflow: 'hidden',
      background: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 16px 36px rgba(0,0,0,0.22)',
    };

    const FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

    return (
      <div
        ref={this.tooltipRef}
        style={outerStyle}
        onClick={e => e.stopPropagation()}
      >
        {/* Caret — rendered outside the clipped body so it's visible */}
        {pos && <Caret
          placement={pos.p}
          targetRect={targetRect}
          tooltipLeft={pos.left}
          tooltipTop={pos.top}
          tooltipH={this.tooltipRef.current ? this.tooltipRef.current.offsetHeight : 140}
        />}

        <div style={bodyStyle}>
          {/* Message */}
          <div style={{ background: '#fff', padding: '22px 24px 14px' }}>
            <p style={{
              margin: 0,
              color: '#1f2937',
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.65,
              textAlign: 'center',
            }}>
              {message}
            </p>
          </div>

          {/* Controls footer */}
          {hasNav && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 14px',
              background: '#fafafa',
              borderTop: '1px solid #f3f4f6',
            }}>

              {/* Back */}
              <button
                disabled={_isFirst}
                onClick={_onBack}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '3px 0',
                  color: _isFirst ? '#e5e7eb' : '#6b7280',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: _isFirst ? 'default' : 'pointer',
                  fontFamily: FONT,
                  minWidth: 48,
                  textAlign: 'left',
                  lineHeight: 1,
                }}
              >
                ← Back
              </button>

              {/* Progress */}
              {showDots ? (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {Array.from({ length: _total }, (_, i) => (
                    <span key={i} style={{
                      display: 'block',
                      width: i === _step ? 7 : 5,
                      height: i === _step ? 7 : 5,
                      borderRadius: '50%',
                      background: i === _step ? '#111827' : '#d1d5db',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }} />
                  ))}
                </div>
              ) : (
                <span style={{
                  color: '#9ca3af',
                  fontSize: 12,
                  fontFamily: FONT,
                }}>
                  {_step + 1} / {_total}
                </span>
              )}

              {/* Next / Done */}
              {_isLast ? (
                <button
                  onClick={_onNext}
                  style={{
                    background: '#111827',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 7,
                    padding: '5px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: FONT,
                    minWidth: 48,
                    lineHeight: 1,
                  }}
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={_onNext}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '3px 0',
                    color: '#374151',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: FONT,
                    minWidth: 48,
                    textAlign: 'right',
                    lineHeight: 1,
                  }}
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OnboardingItem;
