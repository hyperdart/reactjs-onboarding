'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var CONSTANTS = {
	ONBOARDING_DIV_ID: "__reactjs_onboarding",
	LOCALSTORAGE_FLAG_PREFIX: "__reactjs_onboarding_"
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var POSITION_TRANSITION = 'left 0.35s cubic-bezier(0.4,0,0.2,1), top 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1)';
var PADDING = 8; // breathing room around the highlighted element

// Tracks the timer that re-enables position transitions after a fade-in completes.
// Module-level so rapid setTarget calls don't stack timers.
var _reEnableTimer = null;

var _class = function _class() {
  classCallCheck(this, _class);
};

_class.create = function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById(CONSTANTS.ONBOARDING_DIV_ID) !== null) return;

  var div = document.createElement('div');
  div.id = CONSTANTS.ONBOARDING_DIV_ID;
  div.style.position = 'fixed';
  div.style.pointerEvents = 'none';
  div.style.visibility = 'hidden';
  div.style.opacity = '0';
  div.style.zIndex = '99998';
  document.getElementsByTagName('body')[0].appendChild(div);
};

_class.hide = function () {
  if (typeof document === 'undefined') return;
  var div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
  if (!div) return;
  div.style.transition = 'opacity 0.15s ease';
  div.style.opacity = '0';
};

_class.setTarget = function (targetRect, disableArrow) {
  if (typeof document === 'undefined') return;
  var div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
  if (!div || !targetRect) return;

  // Detect whether we're appearing from a hidden/faded state so we can
  // snap to position first and fade in, rather than slide from 0,0.
  var appearing = div.style.visibility === 'hidden' || parseFloat(div.style.opacity || '1') < 0.5;

  div.style.visibility = 'visible';
  div.style.position = 'fixed';
  div.style.zIndex = '99998';
  div.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.68)';

  if (!disableArrow) {
    div.style.border = '2px solid rgba(255,255,255,0.8)';
    div.style.borderRadius = '6px';
  } else {
    div.style.border = 'none';
    div.style.borderRadius = '0';
  }

  if (appearing) {
    // Kill any pending re-enable timer from a previous appear cycle
    clearTimeout(_reEnableTimer);

    // Snap to the correct position instantly (no transition) while still invisible
    div.style.transition = 'none';
    div.style.opacity = '0';
    div.style.left = targetRect.left - PADDING + 'px';
    div.style.top = targetRect.top - PADDING + 'px';
    div.style.width = targetRect.width + PADDING * 2 + 'px';
    div.style.height = targetRect.height + PADDING * 2 + 'px';

    // Next frame: fade in at the already-correct position
    requestAnimationFrame(function () {
      div.style.transition = 'opacity 0.22s ease';
      div.style.opacity = '1';
      // After fade-in completes, restore position transitions for normal step movement
      _reEnableTimer = setTimeout(function () {
        div.style.transition = POSITION_TRANSITION;
      }, 220);
    });
  } else {
    clearTimeout(_reEnableTimer);
    div.style.transition = POSITION_TRANSITION;
    div.style.opacity = '1';
    div.style.left = targetRect.left - PADDING + 'px';
    div.style.top = targetRect.top - PADDING + 'px';
    div.style.width = targetRect.width + PADDING * 2 + 'px';
    div.style.height = targetRect.height + PADDING * 2 + 'px';
  }
};

_class.clear = function () {
  if (typeof document === 'undefined') return;
  var div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
  if (!div) return;
  clearTimeout(_reEnableTimer);
  div.style.transition = 'none';
  div.style.visibility = 'hidden';
  div.style.opacity = '0';
  div.style.left = '0';
  div.style.top = '0';
  div.style.width = '0';
  div.style.height = '0';
  div.style.boxShadow = 'none';
  div.style.border = 'none';
  div.style.borderRadius = '0';
  div.style.zIndex = '-1';
};

/*eslint-disable*/

var TW = 308; // tooltip width px
var GAP = 14; // gap between target and tooltip
var EDGE = 14; // min distance from viewport edge

// Returns { p, top, left } for the best non-clipping placement.
// Guard for SSR — this function is only called from lifecycle methods (client-only)
// but the guard prevents any accidental server-side call from crashing.
function bestPlacement(targetRect, tooltipH) {
  if (typeof window === 'undefined') return { p: 'bottom', top: 0, left: 0 };
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var cx = targetRect.left + targetRect.width / 2;
  var cy = targetRect.top + targetRect.height / 2;

  var tries = [{ p: 'bottom', top: targetRect.bottom + GAP, left: cx - TW / 2 }, { p: 'top', top: targetRect.top - GAP - tooltipH, left: cx - TW / 2 }, { p: 'right', top: cy - tooltipH / 2, left: targetRect.right + GAP }, { p: 'left', top: cy - tooltipH / 2, left: targetRect.left - GAP - TW }];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion = (_step2 = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step2.value;
      var p = _ref.p,
          _top = _ref.top,
          _left = _ref.left;

      var l = Math.max(EDGE, Math.min(vw - TW - EDGE, _left));
      var t = Math.max(EDGE, Math.min(vh - tooltipH - EDGE, _top));
      // Fits without needing to clamp → perfect placement
      if (t === _top && l === _left) return { p: p, top: t, left: l };
    }

    // Nothing fits perfectly — fall back to below, clamped to screen
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _tries$ = tries[0],
      top = _tries$.top,
      left = _tries$.left;

  return {
    p: 'bottom',
    top: Math.max(EDGE, Math.min(vh - tooltipH - EDGE, top)),
    left: Math.max(EDGE, Math.min(vw - TW - EDGE, left))
  };
}

// Rotated-square CSS caret pointing toward the target element.
function Caret(_ref2) {
  var placement = _ref2.placement,
      targetRect = _ref2.targetRect,
      tooltipLeft = _ref2.tooltipLeft,
      tooltipTop = _ref2.tooltipTop,
      tooltipH = _ref2.tooltipH;

  if (!targetRect || !placement) return null;

  var SZ = 11;
  var HALF = SZ / 2;
  var cx = targetRect.left + targetRect.width / 2;
  var cy = targetRect.top + targetRect.height / 2;
  var style = null;

  if (placement === 'bottom') {
    var x = Math.max(SZ + 6, Math.min(TW - SZ - 6, cx - tooltipLeft));
    style = {
      position: 'absolute', top: -(HALF + 1), left: x - HALF,
      width: SZ, height: SZ, background: '#fff', transform: 'rotate(45deg)',
      boxShadow: '-1px -1px 3px rgba(0,0,0,0.07)'
    };
  } else if (placement === 'top') {
    var _x = Math.max(SZ + 6, Math.min(TW - SZ - 6, cx - tooltipLeft));
    style = {
      position: 'absolute', bottom: -(HALF + 1), left: _x - HALF,
      width: SZ, height: SZ, background: '#fafafa', transform: 'rotate(45deg)',
      boxShadow: '1px 1px 3px rgba(0,0,0,0.07)'
    };
  } else if (placement === 'right') {
    var y = Math.max(SZ + 6, Math.min(tooltipH - SZ - 6, cy - tooltipTop));
    style = {
      position: 'absolute', left: -(HALF + 1), top: y - HALF,
      width: SZ, height: SZ, background: '#fff', transform: 'rotate(45deg)',
      boxShadow: '-1px 1px 3px rgba(0,0,0,0.07)'
    };
  } else if (placement === 'left') {
    var _y = Math.max(SZ + 6, Math.min(tooltipH - SZ - 6, cy - tooltipTop));
    style = {
      position: 'absolute', right: -(HALF + 1), top: _y - HALF,
      width: SZ, height: SZ, background: '#fafafa', transform: 'rotate(45deg)',
      boxShadow: '1px -1px 3px rgba(0,0,0,0.07)'
    };
  }

  return style ? React__default.createElement('div', { style: style }) : null;
}

var OnboardingItem = function (_Component) {
  inherits(OnboardingItem, _Component);

  function OnboardingItem(props) {
    classCallCheck(this, OnboardingItem);

    var _this = possibleConstructorReturn(this, (OnboardingItem.__proto__ || Object.getPrototypeOf(OnboardingItem)).call(this, props));

    _this._setReady = function (ready) {
      if (_this.props._onReady) _this.props._onReady(ready);
      _this.setState({ ready: ready });
    };

    _this._schedule = function () {
      if (_this._raf) cancelAnimationFrame(_this._raf);
      _this._raf = requestAnimationFrame(_this._compute);
    };

    _this._hasSize = function (rect) {
      return rect.width > 0 || rect.height > 0;
    };

    _this._notFullyContained = function (rect) {
      return rect.top < 0 || rect.left < 0 || rect.bottom > window.innerHeight || rect.right > window.innerWidth;
    };

    _this._compute = function () {
      if (_this._polling) return; // the in-flight poll will recompute once done

      var _this$props = _this.props,
          elementID = _this$props.elementID,
          elementCoOrdinate = _this$props.elementCoOrdinate;


      var el = typeof elementID === 'string' ? document.getElementById(elementID) : (typeof elementID === 'undefined' ? 'undefined' : _typeof(elementID)) === 'object' ? elementID : null;

      if (el && el.getBoundingClientRect && !elementCoOrdinate && el !== _this._resolvedFor) {
        var rect = el.getBoundingClientRect();
        if (!_this._hasSize(rect) || _this._notFullyContained(rect)) {
          _this._pollUntilUsable(el);
          return;
        }
      }

      var targetRect = null;
      if ((typeof elementCoOrdinate === 'undefined' ? 'undefined' : _typeof(elementCoOrdinate)) === 'object' && elementCoOrdinate !== null) {
        var _elementCoOrdinate$l = elementCoOrdinate.l,
            l = _elementCoOrdinate$l === undefined ? 0 : _elementCoOrdinate$l,
            _elementCoOrdinate$t = elementCoOrdinate.t,
            t = _elementCoOrdinate$t === undefined ? 0 : _elementCoOrdinate$t,
            _elementCoOrdinate$w = elementCoOrdinate.w,
            w = _elementCoOrdinate$w === undefined ? 0 : _elementCoOrdinate$w,
            _elementCoOrdinate$h = elementCoOrdinate.h,
            h = _elementCoOrdinate$h === undefined ? 0 : _elementCoOrdinate$h;

        targetRect = { left: l, top: t, width: w, height: h, right: l + w, bottom: t + h };
      } else if (el && el.getBoundingClientRect) {
        targetRect = el.getBoundingClientRect();
      }

      // Update spotlight immediately (direct DOM — no setState lag)
      _class.setTarget(targetRect, _this.props.disableArrow);

      if (!targetRect) {
        _this.setState({ targetRect: null, pos: null });
        _this._setReady(true);
        return;
      }

      // Measure actual tooltip height from previous render (first render uses estimate 140)
      var tooltipH = _this.tooltipRef.current ? _this.tooltipRef.current.offsetHeight : 140;

      var pos = bestPlacement(targetRect, tooltipH);
      _this.setState({ targetRect: targetRect, pos: pos });
      _this._setReady(true);
    };

    _this._pollUntilUsable = function (el) {
      if (_this._pollRaf) cancelAnimationFrame(_this._pollRaf);
      _this._polling = true;
      _class.hide();
      _this._setReady(false);

      var STABLE_FRAMES_NEEDED = 4;
      var MAX_WAIT_MS = 1500;
      var EPSILON = 0.5;
      var now = function now() {
        return typeof performance !== 'undefined' ? performance.now() : Date.now();
      };

      var start = now();
      var prevRect = el.getBoundingClientRect();
      var stableFrames = 0;
      var scrolledIntoView = false;

      var step = function step() {
        var rect = el.getBoundingClientRect();
        var hasSize = _this._hasSize(rect);

        if (hasSize && !scrolledIntoView && _this._notFullyContained(rect)) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          scrolledIntoView = true;
        }

        var stable = Math.abs(rect.top - prevRect.top) < EPSILON && Math.abs(rect.left - prevRect.left) < EPSILON;
        stableFrames = hasSize && stable ? stableFrames + 1 : 0;
        prevRect = rect;

        var timedOut = now() - start > MAX_WAIT_MS;

        if (stableFrames >= STABLE_FRAMES_NEEDED || timedOut) {
          _this._pollRaf = null;
          _this._polling = false;
          _this._resolvedFor = el;
          _this._compute();
          return;
        }
        _this._pollRaf = requestAnimationFrame(step);
      };

      _this._pollRaf = requestAnimationFrame(step);
    };

    _this.tooltipRef = React__default.createRef();
    _this._raf = null;
    _this._pollRaf = null;
    _this._polling = false;
    _this._resolvedFor = null; // element that already had its one scroll-and-settle attempt — see _pollUntilUsable
    _this.state = { targetRect: null, pos: null, ready: false };
    return _this;
  }

  createClass(OnboardingItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._compute();
      window.addEventListener('resize', this._schedule);
      window.addEventListener('scroll', this._schedule);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._schedule);
      window.removeEventListener('scroll', this._schedule);
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._pollRaf) cancelAnimationFrame(this._pollRaf);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.elementID !== this.props.elementID || prevProps.elementCoOrdinate !== this.props.elementCoOrdinate) {
        this._polling = false;
        this._resolvedFor = null;
        if (this._pollRaf) cancelAnimationFrame(this._pollRaf);
        this._compute();
        return;
      }
      if (prevState.targetRect !== this.state.targetRect) {
        _class.setTarget(this.state.targetRect, this.props.disableArrow);
      }
    }

    // A target isn't usable yet if it has no size (display:none, not yet laid
    // out). Revealing the tooltip against a 0x0 rect just shows it in the
    // wrong place, which reads as "the dialog never appeared."


    // Whether the target is fully inside the viewport. This drives *whether to
    // scroll* — scroll (and center) whenever any part is cut off, same as
    // bringing a partially-visible element fully into view. It must NOT be
    // used as the condition for *when the wait is over* (see _pollUntilUsable):
    // an element taller or wider than the viewport can never be fully
    // contained, so that would wait for something that can never happen.


    // Scrolls the target into view (once) if any part of it is cut off, then
    // waits until it stops moving before revealing the tooltip — instead of
    // guessing a fixed delay, which races against variable-length scroll
    // animations (notably Android Chrome, where the URL bar collapsing during
    // scroll keeps shifting window.innerHeight past any short guess, so a
    // too-early recheck sees the same not-yet-scrolled target and loops).
    //
    // "Stopped moving" — not "fully contained" — is what ends the wait: a
    // target taller or wider than the viewport can never be fully contained,
    // so that could never be satisfied and would wait out the full safety cap
    // on every single visit to that step. Once this poll ends (settled or
    // capped), _resolvedFor marks the element so _compute won't re-trigger
    // this same wait for it again — it just repositions directly from here on.

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          message = _props.message,
          _onNext = _props._onNext,
          _onBack = _props._onBack,
          _onClose = _props._onClose,
          _step = _props._step,
          _total = _props._total,
          _isFirst = _props._isFirst,
          _isLast = _props._isLast;
      var _state = this.state,
          pos = _state.pos,
          targetRect = _state.targetRect,
          ready = _state.ready;


      var hasNav = _onNext !== undefined;
      var showDots = _total !== undefined && _total <= 10;

      // Outer wrapper: positioned (caret hangs outside, so overflow: visible)
      var outerStyle = pos ? {
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: TW,
        zIndex: 100000,
        opacity: ready ? 1 : 0,
        // Invisible tooltip (mid scroll-settle) must not eat clicks meant
        // for the full-screen overlay behind it.
        pointerEvents: ready ? 'auto' : 'none',
        transition: 'opacity 0.18s ease',
        // Smooth relocation when target changes between steps
        willChange: 'top, left'
      } : {
        // No target: center on screen
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: TW,
        zIndex: 100000,
        opacity: ready ? 1 : 0,
        pointerEvents: ready ? 'auto' : 'none',
        transition: 'opacity 0.18s ease'
      };

      // Body: rounded, clipped, shadow
      var bodyStyle = {
        borderRadius: 12,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 16px 36px rgba(0,0,0,0.22)',
        position: 'relative'
      };

      var FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

      return React__default.createElement(
        'div',
        {
          ref: this.tooltipRef,
          style: outerStyle,
          onClick: function onClick(e) {
            return e.stopPropagation();
          }
        },
        pos && React__default.createElement(Caret, {
          placement: pos.p,
          targetRect: targetRect,
          tooltipLeft: pos.left,
          tooltipTop: pos.top,
          tooltipH: this.tooltipRef.current ? this.tooltipRef.current.offsetHeight : 140
        }),
        React__default.createElement(
          'div',
          { style: bodyStyle },
          _onClose && React__default.createElement(
            'button',
            {
              onClick: _onClose,
              style: {
                position: 'absolute',
                top: 2,
                right: 8,
                width: 30,
                height: 30,
                borderRadius: 6,
                border: 'none',
                background: 'transparent',
                color: '#374151',
                fontSize: 26,
                fontFamily: FONT,
                fontWeight: 300,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                padding: 0,
                zIndex: 1
              },
              onMouseEnter: function onMouseEnter(e) {
                e.currentTarget.style.background = '#f3f4f6';
              },
              onMouseLeave: function onMouseLeave(e) {
                e.currentTarget.style.background = 'transparent';
              },
              'aria-label': 'Skip tour'
            },
            '\xD7'
          ),
          React__default.createElement(
            'div',
            { style: { background: '#fff', padding: '22px 52px 14px 24px' } },
            React__default.createElement(
              'p',
              { style: {
                  margin: 0,
                  color: '#1f2937',
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.65,
                  textAlign: 'center'
                } },
              message
            )
          ),
          hasNav && React__default.createElement(
            'div',
            { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 14px',
                background: '#fafafa',
                borderTop: '1px solid #f3f4f6'
              } },
            React__default.createElement(
              'button',
              {
                disabled: _isFirst,
                onClick: _onBack,
                style: {
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
                  lineHeight: 1
                }
              },
              '\u2190 Back'
            ),
            showDots ? React__default.createElement(
              'div',
              { style: { display: 'flex', gap: 4, alignItems: 'center' } },
              Array.from({ length: _total }, function (_, i) {
                return React__default.createElement('span', { key: i, style: {
                    display: 'block',
                    width: i === _step ? 7 : 5,
                    height: i === _step ? 7 : 5,
                    borderRadius: '50%',
                    background: i === _step ? '#111827' : '#d1d5db',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  } });
              })
            ) : React__default.createElement(
              'span',
              { style: {
                  color: '#9ca3af',
                  fontSize: 12,
                  fontFamily: FONT
                } },
              _step + 1,
              ' / ',
              _total
            ),
            _isLast ? React__default.createElement(
              'button',
              {
                onClick: _onNext,
                style: {
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
                  lineHeight: 1
                }
              },
              'Done'
            ) : React__default.createElement(
              'button',
              {
                onClick: _onNext,
                style: {
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
                  lineHeight: 1
                }
              },
              'Next \u2192'
            )
          )
        )
      );
    }
  }]);
  return OnboardingItem;
}(React.Component);

/*eslint-disable*/

var _tagItems = [];

function OnboardingTag(_ref) {
  var message = _ref.message,
      children = _ref.children;

  var tagRef = React.useRef(null);
  var tagItemRef = React.useRef(null);

  React.useEffect(function () {
    if (tagRef.current) {
      tagItemRef.current = React__default.createElement(OnboardingItem, { elementID: tagRef.current, message: message });
      _tagItems.push(tagItemRef.current);
    } else {
      console.warn('OnboardingTag: could not find mounted element.');
    }
    return function () {
      var idx = _tagItems.indexOf(tagItemRef.current);
      if (idx > -1) _tagItems.splice(idx, 1);
    };
  }, []);

  return React__default.createElement(
    'div',
    { ref: tagRef },
    children
  );
}

OnboardingTag.TagItems = _tagItems;

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
var SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

// Elements that use these keys themselves (button activation, text editing,
// native form controls) — don't steal the keystroke from them.
var INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A']);

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
var _refCount = 0;

var _htmlOverflow = '';
var _bodyOverflow = '';
var _bodyPaddingRight = '';
var _scrollX = 0;
var _scrollY = 0;
var _usedOverflowLock = false;

function lockOverflow() {
  var html = document.documentElement;
  var body = document.body;
  var scrollbarWidth = window.innerWidth - html.clientWidth;

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

  var currentPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
  body.style.paddingRight = currentPaddingRight + scrollbarWidth + 'px';

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

var ScrollLock = function ScrollLock() {
  classCallCheck(this, ScrollLock);
};

ScrollLock.lock = function () {
  if (typeof document === 'undefined') return;
  _refCount++;
  if (_refCount > 1) return;
  lockOverflow();
  document.addEventListener('wheel', preventDefault, { passive: false });
  document.addEventListener('touchmove', preventDefault, { passive: false });
  document.addEventListener('keydown', preventScrollKey, { passive: false });
};

ScrollLock.unlock = function () {
  if (typeof document === 'undefined' || _refCount === 0) return;
  _refCount--;
  if (_refCount > 0) return;
  unlockOverflow();
  document.removeEventListener('wheel', preventDefault);
  document.removeEventListener('touchmove', preventDefault);
  document.removeEventListener('keydown', preventScrollKey);
};

/*eslint-disable*/

// Z-index layers:
//   onboarding-div  (dark spotlight)   99998
//   overlay         (interaction lock) 99999
//   tooltip                           100000

var Onboarding = function (_Component) {
  inherits(Onboarding, _Component);

  function Onboarding(props) {
    classCallCheck(this, Onboarding);

    var _this = possibleConstructorReturn(this, (Onboarding.__proto__ || Object.getPrototypeOf(Onboarding)).call(this, props));

    _this._onKey = function (e) {
      if (!_this.state.open) return;
      if (e.key === 'Escape') _this.handleClose();else if (e.key === 'ArrowRight' || e.key === 'Enter') _this.handleNext();else if (e.key === 'ArrowLeft') _this.handleBack();
    };

    _this.handleClose = function () {
      _class.clear();
      _this.setState({ open: false, activeStep: 0 });
      localStorage.setItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + _this.props.name, 'true');
    };

    _this._getChildArray = function () {
      var all = React__default.Children.toArray(_this.props.children);
      var filtered = all.filter(function (child) {
        var id = child.props && child.props.elementID;
        if (typeof id === 'string') return document.getElementById(id) !== null;
        return true;
      });
      // A step's target can mount asynchronously (lazy content, slow hydration)
      // after this render already ran. Filtering it out here is a one-shot
      // check — without a retry it's silently and permanently dropped from
      // the tour rather than picked up once it exists.
      if (filtered.length < all.length) _this._scheduleChildRetry();
      return filtered.concat(OnboardingTag.TagItems);
    };

    _this._scheduleChildRetry = function () {
      if (_this._retryRaf) return;
      _this._retryStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
      var MAX_WAIT_MS = 1500;

      var poll = function poll() {
        if (!_this.state.open) {
          _this._retryRaf = null;return;
        }

        var all = React__default.Children.toArray(_this.props.children);
        var resolvedCount = all.filter(function (child) {
          var id = child.props && child.props.elementID;
          return typeof id !== 'string' || document.getElementById(id) !== null;
        }).length;

        var now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        if (resolvedCount === all.length || now - _this._retryStart > MAX_WAIT_MS) {
          _this._retryRaf = null;
          _this.forceUpdate();
          return;
        }
        _this._retryRaf = requestAnimationFrame(poll);
      };

      _this._retryRaf = requestAnimationFrame(poll);
    };

    _this.handleNext = function () {
      var total = _this._getChildArray().length;
      if (_this.state.activeStep >= total - 1) _this.handleClose();else _this.setState(function (s) {
        return { activeStep: s.activeStep + 1, ready: false };
      });
    };

    _this.handleBack = function () {
      if (_this.state.activeStep > 0) _this.setState(function (s) {
        return { activeStep: s.activeStep - 1, ready: false };
      });
    };

    _this._setReady = function (ready) {
      _this.setState({ ready: ready });
    };

    Onboarding.current = _this;
    // Start closed — componentDidMount reads localStorage (client-only) and opens if needed.
    // This is SSR-safe: `open: false` means nothing renders on the server, preventing
    // hydration mismatches in Next.js / React Server Components environments.
    _this.state = {
      activeStep: 0,
      open: false,
      // Gates the full-screen overlay's click-to-advance behavior. Must stay
      // false until the active child reports itself visible via _onReady —
      // otherwise a tooltip stuck invisible (e.g. mid scroll-settle) leaves
      // a fully interactive, invisible overlay that silently completes the
      // tour on tap (see onboarding-div.js / OnboardingItem.js).
      ready: false
    };
    _this._mountedHref = '';
    _this._retryRaf = null;
    _this._retryStart = null;
    return _this;
  }

  createClass(Onboarding, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // All browser APIs (localStorage, document, window) are safe here — this hook
      // never runs on the server, so no SSR crash in Next.js or similar frameworks.
      _class.create();
      this._mountedHref = window.location.href;
      document.addEventListener('keydown', this._onKey);

      var flag = localStorage.getItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + this.props.name);
      if (flag === null || flag === '') {
        this.setState({ open: true });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this._onKey);
      if (window.location.href !== this._mountedHref) {
        _class.clear();
      }
      if (this.state.open) ScrollLock.unlock();
      if (this._retryRaf) cancelAnimationFrame(this._retryRaf);
    }

    // Prevents the user from scrolling the page behind the tour so the
    // highlighted element can't drift out of the spotlight while a step is
    // showing. Locks via overflow:hidden (see scroll-lock.js) which still
    // permits OnboardingItem's own programmatic scrollIntoView between steps.

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.open !== this.state.open) {
        if (this.state.open) ScrollLock.lock();else ScrollLock.unlock();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          open = _state.open,
          activeStep = _state.activeStep,
          ready = _state.ready;

      if (!open) return null;

      var children = this._getChildArray();
      var total = children.length;
      if (total === 0) return null;

      var step = Math.min(activeStep, total - 1);
      var isFirst = step === 0;
      var isLast = step >= total - 1;

      // Inject navigation props into the active child — OnboardingItem reads them
      // to render its embedded Back/Next/Done controls and progress dots.
      var activeChild = React__default.cloneElement(children[step], {
        _onNext: this.handleNext,
        _onBack: this.handleBack,
        _onClose: this.handleClose,
        _step: step,
        _total: total,
        _isFirst: isFirst,
        _isLast: isLast,
        _onReady: this._setReady
      });

      return React__default.createElement(
        React.Fragment,
        null,
        React__default.createElement('div', {
          style: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            cursor: ready ? 'pointer' : 'default',
            touchAction: 'pan-x pan-y',
            // Android shows a translucent tap-highlight flash on any element
            // with an onClick unless this is suppressed — visible as a "blue
            // flicker" across the full screen on every tap here.
            WebkitTapHighlightColor: 'transparent'
          },
          onClick: ready ? this.handleNext : undefined,
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': 'Onboarding tour'
        }),
        activeChild
      );
    }
  }], [{
    key: 'reset',
    value: function reset() {
      if (typeof localStorage === 'undefined') return;
      // Object.keys() is safe — for...in iterates the prototype chain too
      Object.keys(localStorage).filter(function (k) {
        return k.startsWith(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX);
      }).forEach(function (k) {
        return localStorage.setItem(k, '');
      });
      Onboarding.current && Onboarding.current.setState({ open: true, activeStep: 0 });
    }
  }]);
  return Onboarding;
}(React.Component);

Onboarding.current = null;

exports.Onboarding = Onboarding;
exports.OnboardingItem = OnboardingItem;
exports.OnboardingTag = OnboardingTag;
//# sourceMappingURL=index.js.map
