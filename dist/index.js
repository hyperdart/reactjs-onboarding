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
  // Lower than React root's overlay (99999) so the tooltip SVG/caret paints on top.
  // onboarding-div is appended after the React root in DOM order, so at equal z-index
  // it would win the paint race — keeping it one level lower prevents that.
  div.style.zIndex = '99998';
  document.getElementsByTagName('body')[0].appendChild(div);
};

_class.setTarget = function (targetRect, disableArrow) {
  if (typeof document === 'undefined') return;
  var div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
  if (!div || !targetRect) return;

  div.style.visibility = 'visible';
  div.style.transition = 'left 0.35s cubic-bezier(0.4,0,0.2,1), top 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1)';
  div.style.position = 'fixed';
  div.style.left = targetRect.left + 'px';
  div.style.top = targetRect.top + 'px';
  div.style.width = targetRect.width + 'px';
  div.style.height = targetRect.height + 'px';
  div.style.zIndex = '99998';
  div.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.68)';

  if (!disableArrow) {
    div.style.border = '2px solid rgba(255,255,255,0.8)';
    div.style.borderRadius = '6px';
  } else {
    div.style.border = 'none';
    div.style.borderRadius = '0';
  }
};

_class.clear = function () {
  if (typeof document === 'undefined') return;
  var div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
  if (!div) return;
  div.style.visibility = 'hidden';
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

    _this._schedule = function () {
      if (_this._raf) cancelAnimationFrame(_this._raf);
      _this._raf = requestAnimationFrame(_this._compute);
    };

    _this._compute = function () {
      var _this$props = _this.props,
          elementID = _this$props.elementID,
          elementCoOrdinate = _this$props.elementCoOrdinate;


      var el = typeof elementID === 'string' ? document.getElementById(elementID) : (typeof elementID === 'undefined' ? 'undefined' : _typeof(elementID)) === 'object' ? elementID : null;

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
        _this.setState({ targetRect: null, pos: null, ready: true });
        return;
      }

      // Measure actual tooltip height from previous render (first render uses estimate 140)
      var tooltipH = _this.tooltipRef.current ? _this.tooltipRef.current.offsetHeight : 140;

      var pos = bestPlacement(targetRect, tooltipH);
      _this.setState({ targetRect: targetRect, pos: pos, ready: true });
    };

    _this.tooltipRef = React__default.createRef();
    _this._raf = null;
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
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.elementID !== this.props.elementID || prevProps.elementCoOrdinate !== this.props.elementCoOrdinate) {
        this._compute();
        return;
      }
      if (prevState.targetRect !== this.state.targetRect) {
        _class.setTarget(this.state.targetRect, this.props.disableArrow);
      }
    }
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
      var filtered = React__default.Children.toArray(_this.props.children).filter(function (child) {
        var id = child.props && child.props.elementID;
        if (typeof id === 'string') return document.getElementById(id) !== null;
        return true;
      });
      return filtered.concat(OnboardingTag.TagItems);
    };

    _this.handleNext = function () {
      var total = _this._getChildArray().length;
      if (_this.state.activeStep >= total - 1) _this.handleClose();else _this.setState(function (s) {
        return { activeStep: s.activeStep + 1 };
      });
    };

    _this.handleBack = function () {
      if (_this.state.activeStep > 0) _this.setState(function (s) {
        return { activeStep: s.activeStep - 1 };
      });
    };

    Onboarding.current = _this;
    // Start closed — componentDidMount reads localStorage (client-only) and opens if needed.
    // This is SSR-safe: `open: false` means nothing renders on the server, preventing
    // hydration mismatches in Next.js / React Server Components environments.
    _this.state = {
      activeStep: 0,
      open: false
    };
    _this._mountedHref = '';
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
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          open = _state.open,
          activeStep = _state.activeStep;

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
        _isLast: isLast
      });

      return React__default.createElement(
        React.Fragment,
        null,
        React__default.createElement('div', {
          style: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            cursor: 'pointer'
          },
          onClick: this.handleNext,
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
