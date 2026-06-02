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
  if (document.getElementById(CONSTANTS.ONBOARDING_DIV_ID) === null) {
    var body = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.id = CONSTANTS.ONBOARDING_DIV_ID;
    div.style.position = 'fixed';
    div.style.pointerEvents = 'none';
    div.style.visibility = 'hidden';
    // Keep below React root's z-index so the arrow SVG (rendered inside React) paints on top.
    // onboarding-div is appended to <body> after the React root, so at equal z-index it would
    // win the DOM-order paint race and cover the arrow — hence one level lower here.
    div.style.zIndex = '99998';
    body.appendChild(div);
  }
};

_class.setTarget = function (targetRect, disableArrow) {
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

  if (!disableArrow) {
    div.style.border = '2px solid rgba(255,255,255,0.8)';
    div.style.borderRadius = '6px';
    div.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.68)';
  } else {
    div.style.border = 'none';
    div.style.borderRadius = '0';
    div.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.68)';
  }
};

_class.clear = function () {
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

var ArrowCurved = (function (props) {
	var startBox = props.startBox,
	    endBox = props.endBox,
	    color = props.color,
	    width = props.width;

	var clr = color || "red";
	var w = width || 2;
	var arrowSize = 10;

	if (!startBox || !endBox) return React__default.createElement(React__default.Fragment, null);

	var startTop = startBox.bottom >= endBox.top;
	var endTop = endBox.bottom + arrowSize * w >= startBox.top;
	var start = {
		x: startBox.left + startBox.width / 2,
		y: startTop ? startBox.top : startBox.bottom
	};
	var end = {
		x: endBox.left + endBox.width / 2,
		y: endTop ? endBox.top - arrowSize * w : endBox.bottom + arrowSize * w
	};
	var cpt1 = {
		x: start.x,
		y: start.y + (end.y - start.y) / 2
	};
	var cpt2 = {
		x: end.x,
		y: end.y - (end.y - start.y) / 2
	};
	var cpt3 = {
		x: (start.x + end.x) / 2,
		y: Math.max(0, (start.y + end.y) / 2 - Math.abs(end.x - start.x))
	};
	var path = startTop && endTop ? "M " + start.x + " " + start.y + " Q " + cpt3.x + " " + cpt3.y + " " + end.x + " " + end.y : "M " + start.x + " " + start.y + " C " + cpt1.x + " " + cpt1.y + " " + cpt2.x + " " + cpt2.y + " " + end.x + " " + end.y;
	return React__default.createElement(
		"svg",
		{ style: { position: "absolute" }, height: "100%", width: "100%" },
		React__default.createElement(
			"defs",
			null,
			React__default.createElement(
				"marker",
				{ id: "triangle", viewBox: "0 0 " + arrowSize + " " + arrowSize,
					refX: "0", refY: arrowSize / 2,
					markerUnits: "strokeWidth",
					markerWidth: arrowSize, markerHeight: arrowSize,
					orient: "auto" },
				React__default.createElement("path", { d: "M 0 0 L " + arrowSize + " " + arrowSize / 2 + " L 0 " + arrowSize + " z", style: { fill: clr } })
			)
		),
		React__default.createElement("path", { d: path,
			style: {
				stroke: clr,
				strokeWidth: w + "px",
				fill: "none",
				markerEnd: "url(#triangle)",
				transition: "all .5s ease-out"
			}
		})
	);
});

/*eslint-disable*/

if (typeof document !== 'undefined' && !document.getElementById('__ob_styles')) {
  var style = document.createElement('style');
  style.id = '__ob_styles';
  style.textContent = '@keyframes obIn{from{opacity:0;transform:translate(-50%,-48%)}to{opacity:1;transform:translate(-50%,-50%)}} @keyframes obInTop{from{opacity:0}to{opacity:1}}';
  document.head.appendChild(style);
}

var getMsgBoxStyle = function getMsgBoxStyle(top) {
  return {
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
    animation: top !== undefined ? 'obInTop 0.2s ease-out' : 'obIn 0.2s ease-out'
  };
};

var msgTextStyle = {
  color: '#111827',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.65,
  margin: 0,
  textAlign: 'center'
};

var OnboardingItem = function (_Component) {
  inherits(OnboardingItem, _Component);

  function OnboardingItem(props) {
    classCallCheck(this, OnboardingItem);

    var _this = possibleConstructorReturn(this, (OnboardingItem.__proto__ || Object.getPrototypeOf(OnboardingItem)).call(this, props));

    _this._onResize = function () {
      // Throttle via rAF so rapid scroll/resize bursts don't cause continuous re-renders
      if (_this._raf) cancelAnimationFrame(_this._raf);
      _this._raf = requestAnimationFrame(_this.computeStartEndPosition);
    };

    _this.computeStartEndPosition = function () {
      var _this$props = _this.props,
          elementID = _this$props.elementID,
          elementCoOrdinate = _this$props.elementCoOrdinate;

      // Read both rects before calling setState so both go into a single update —
      // two separate setState calls would cause two renders; the first would briefly
      // render the arrow with one stale rect, causing visible flicker.

      var msgBoxRect = _this.msgBox.current && _this.msgBox.current.getBoundingClientRect ? _this.msgBox.current.getBoundingClientRect() : _this.state.msgBoxRect;

      var el = typeof elementID === 'string' ? document.getElementById(elementID) : (typeof elementID === 'undefined' ? 'undefined' : _typeof(elementID)) === 'object' ? elementID : null;

      var targetRect = null;
      if ((typeof elementCoOrdinate === 'undefined' ? 'undefined' : _typeof(elementCoOrdinate)) === 'object' && elementCoOrdinate !== null) {
        targetRect = {
          left: elementCoOrdinate.l || 0,
          top: elementCoOrdinate.t || 0,
          width: elementCoOrdinate.w || 0,
          height: elementCoOrdinate.h || 0,
          right: (elementCoOrdinate.l || 0) + (elementCoOrdinate.w || 0),
          bottom: (elementCoOrdinate.t || 0) + (elementCoOrdinate.h || 0)
        };
      } else if (typeof elementID === 'string' || (typeof elementID === 'undefined' ? 'undefined' : _typeof(elementID)) === 'object') {
        targetRect = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      }

      // Direct DOM update first — spotlight repositions immediately without waiting for setState
      _class.setTarget(targetRect, _this.props.disableArrow);

      // Single batched setState — one render, no intermediate flicker state
      _this.setState({ msgBoxRect: msgBoxRect, targetRect: targetRect });
    };

    _this.msgBox = React__default.createRef();
    _this._raf = null;
    _this.state = {
      msgBoxRect: null,
      targetRect: null,
      disableArrow: props.disableArrow !== undefined ? props.disableArrow : false
    };
    return _this;
  }

  createClass(OnboardingItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.computeStartEndPosition();
      window.addEventListener('resize', this._onResize);
      // Bubble phase only — avoids firing for every scroll inside nested elements
      window.addEventListener('scroll', this._onResize);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('scroll', this._onResize);
      if (this._raf) cancelAnimationFrame(this._raf);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.elementID !== this.props.elementID || prevProps.elementCoOrdinate !== this.props.elementCoOrdinate) {
        this.computeStartEndPosition();
        return;
      }
      // Update spotlight when targetRect changes — kept out of render() to avoid side-effect in render
      if (prevState.targetRect !== this.state.targetRect) {
        _class.setTarget(this.state.targetRect, this.props.disableArrow);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      // NOTE: no OnboardingDiv.setTarget here — side effects in render() cause flicker
      // because React may call render() multiple times before committing.
      var _state = this.state,
          msgBoxRect = _state.msgBoxRect,
          targetRect = _state.targetRect,
          disableArrow = _state.disableArrow;
      var _props = this.props,
          message = _props.message,
          top = _props.top;


      return React__default.createElement(
        React.Fragment,
        null,
        !disableArrow && React__default.createElement(ArrowCurved, { color: 'white', width: 2, startBox: msgBoxRect, endBox: targetRect }),
        React__default.createElement(
          'div',
          { ref: this.msgBox, style: getMsgBoxStyle(top) },
          React__default.createElement(
            'p',
            { style: msgTextStyle },
            message
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
//   onboarding-div (dark spotlight)  99998
//   overlay + arrow SVG              99999
//   message box (white card)        100000
//   controls + skip                 100001

var S = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 99999,
    cursor: 'pointer',
    outline: 'none'
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
    whiteSpace: 'nowrap'
  },
  navBtn: function navBtn(disabled) {
    return {
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
      flexShrink: 0
    };
  },
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
    flexShrink: 0
  },
  dot: function dot(active) {
    return {
      width: active ? '8px' : '5px',
      height: active ? '8px' : '5px',
      borderRadius: '50%',
      background: active ? 'white' : 'rgba(255,255,255,0.3)',
      transition: 'all 0.25s ease',
      flexShrink: 0
    };
  },
  stepLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    minWidth: '40px',
    textAlign: 'center'
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
    transition: 'color 0.15s'
  }
};

var Onboarding = function (_Component) {
  inherits(Onboarding, _Component);

  function Onboarding(props) {
    classCallCheck(this, Onboarding);

    var _this = possibleConstructorReturn(this, (Onboarding.__proto__ || Object.getPrototypeOf(Onboarding)).call(this, props));

    _this._handleKeyDown = function (e) {
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
      var childArray = _this._getChildArray();
      if (_this.state.activeStep >= childArray.length - 1) {
        _this.handleClose();
      } else {
        _this.setState(function (prev) {
          return { activeStep: prev.activeStep + 1 };
        });
      }
    };

    _this.handleBack = function () {
      if (_this.state.activeStep > 0) {
        _this.setState(function (prev) {
          return { activeStep: prev.activeStep - 1 };
        });
      }
    };

    Onboarding.current = _this;
    var demoFlag = localStorage.getItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + _this.props.name);
    _this.state = {
      activeStep: 0,
      open: demoFlag === null || demoFlag === ''
    };
    _class.create();
    _this._mountedHref = window.location.href;
    return _this;
  }

  createClass(Onboarding, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('keydown', this._handleKeyDown);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this._handleKeyDown);
      if (window.location.href !== this._mountedHref) {
        _class.clear();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          activeStep = _state.activeStep,
          open = _state.open;

      if (!open) return null;

      var childArray = this._getChildArray();
      var childCount = childArray.length;
      if (childCount === 0) return null;

      var step = Math.min(activeStep, childCount - 1);
      var activeChild = childArray[step];
      var isFirst = step === 0;
      var isLast = step >= childCount - 1;
      var showDots = childCount <= 10;

      return React__default.createElement(
        React.Fragment,
        null,
        React__default.createElement(
          'div',
          {
            style: S.overlay,
            onClick: this.handleNext,
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': 'Onboarding tour',
            tabIndex: -1
          },
          activeChild
        ),
        React__default.createElement(
          'div',
          { style: S.controls, onClick: function onClick(e) {
              return e.stopPropagation();
            } },
          React__default.createElement(
            'button',
            {
              style: S.navBtn(isFirst),
              onClick: this.handleBack,
              disabled: isFirst,
              'aria-label': 'Previous step'
            },
            '\u2039'
          ),
          showDots ? childArray.map(function (_, i) {
            return React__default.createElement('span', { key: i, style: S.dot(i === step), 'aria-hidden': 'true' });
          }) : React__default.createElement(
            'span',
            { style: S.stepLabel },
            step + 1,
            ' / ',
            childCount
          ),
          React__default.createElement(
            'button',
            {
              style: isLast ? S.doneBtn : S.navBtn(false),
              onClick: isLast ? this.handleClose : this.handleNext,
              'aria-label': isLast ? 'Finish tour' : 'Next step'
            },
            isLast ? 'Done' : '›'
          )
        ),
        React__default.createElement(
          'button',
          {
            style: S.skip,
            onClick: this.handleClose,
            'aria-label': 'Skip tour',
            onMouseEnter: function onMouseEnter(e) {
              e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
            },
            onMouseLeave: function onMouseLeave(e) {
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }
          },
          'Skip tour'
        )
      );
    }
  }], [{
    key: 'reset',
    value: function reset() {
      for (var obj in localStorage) {
        if (obj.startsWith(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX)) {
          localStorage.setItem(obj, '');
        }
      }
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
