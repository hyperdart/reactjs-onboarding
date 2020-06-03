'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var core = require('@material-ui/core');

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

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

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
		var rootDiv = document.getElementsByTagName("body")[0]; //this creates a blank div on which the box shadow will be applied
		var newDiv = document.createElement("div");
		newDiv.id = CONSTANTS.ONBOARDING_DIV_ID;
		rootDiv.appendChild(newDiv);
	}
};

_class.setTarget = function (targetRect, disableArrow) {
	var onboardingDiv = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
	if (onboardingDiv && targetRect) {
		onboardingDiv.style.visibility = "visible";
		onboardingDiv.style.transition = "all .5s ease-out";
		onboardingDiv.style.position = "absolute";
		onboardingDiv.style.left = targetRect.left + "px";
		onboardingDiv.style.top = targetRect.top + "px";
		onboardingDiv.style.width = targetRect.width + "px";
		onboardingDiv.style.height = targetRect.height + "px";
		onboardingDiv.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.7)";
		if (!disableArrow) {
			onboardingDiv.style.border = "1px solid white";
			onboardingDiv.style.borderRadius = "5px";
		}
		onboardingDiv.style.zIndex = "99999";
	}
};

_class.clear = function () {
	var onboardingDiv = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
	if (onboardingDiv) {
		onboardingDiv.style.visibility = "hidden";
		onboardingDiv.style.left = "0px";
		onboardingDiv.style.top = "0px";
		onboardingDiv.style.width = "0px";
		onboardingDiv.style.height = "0px";
		onboardingDiv.style.boxShadow = "none";
		onboardingDiv.style.border = "none";
		onboardingDiv.style.borderRadius = "0";
		onboardingDiv.style.zIndex = "-1";
	}
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

var styles = function styles(theme) {
				return {
								textStyle: {
												color: 'white',
												fontFamily: "Georgia,Roboto, Helvetica, Arial, cursive",
												fontStyle: "italic"
								},
								paperStyle: {
												textAlign: "center",
												position: "absolute",
												top: "50%",
												left: "50%",
												background: "transparent",
												width: "60%",
												transform: "translate(-50%, -50%)"
								}
				};
};

var OnboardingItem = function (_Component) {
				inherits(OnboardingItem, _Component);

				function OnboardingItem(props) {
								classCallCheck(this, OnboardingItem);

								var _this = possibleConstructorReturn(this, (OnboardingItem.__proto__ || Object.getPrototypeOf(OnboardingItem)).call(this, props));

								_this.computeStartEndPosition = function () {
												var _this$props = _this.props,
												    elementID = _this$props.elementID,
												    elementCoOrdinate = _this$props.elementCoOrdinate;


												if (_this.msgBox.current && _this.msgBox.current.getBoundingClientRect) _this.setState({
																msgBoxRect: _this.msgBox.current.getBoundingClientRect()
												});
												var el = typeof elementID === "string" ? document.getElementById(elementID) : (typeof elementID === 'undefined' ? 'undefined' : _typeof(elementID)) === "object" ? elementID : null;
												var targetRect = (typeof elementCoOrdinate === 'undefined' ? 'undefined' : _typeof(elementCoOrdinate)) === "object" ? {
																left: elementCoOrdinate.l || 0,
																top: elementCoOrdinate.t || 0,
																width: elementCoOrdinate.w || 0,
																height: elementCoOrdinate.h || 0,
																right: (elementCoOrdinate.l || 0) + (elementCoOrdinate.w || 0),
																bottom: (elementCoOrdinate.t || 0) + (elementCoOrdinate.h || 0)
												} : typeof elementID === "string" || (typeof elementID === 'undefined' ? 'undefined' : _typeof(elementID)) === "object" ? el && el.getBoundingClientRect && el.getBoundingClientRect() : null;
												_this.setState({
																targetRect: targetRect
												});
								};

								_this.msgBox = React__default.createRef();
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
								}
				}, {
								key: 'componentDidUpdate',
								value: function componentDidUpdate(prevProp, prevState) {
												// console.log("PP",prevProp)
												if (prevProp.elementID !== this.props.elementID || prevProp.elementCoOrdinate !== this.props.elementCoOrdinate) this.computeStartEndPosition();
								}
				}, {
								key: 'render',
								value: function render() {
												var classes = this.props.classes;
												var _state = this.state,
												    msgBoxRect = _state.msgBoxRect,
												    targetRect = _state.targetRect;


												_class.setTarget(this.state.targetRect, this.props.disableArrow);
												return React__default.createElement(
																React.Fragment,
																null,
																React__default.createElement(
																				'div',
																				null,
																				!this.state.disableArrow && React__default.createElement(ArrowCurved, { color: 'white', startBox: msgBoxRect, endBox: targetRect }),
																				React__default.createElement(
																								'div',
																								{ ref: this.msgBox, className: classes.paperStyle, style: { top: this.props.top } },
																								React__default.createElement(
																												core.Typography,
																												{ variant: 'h6', className: classes.textStyle },
																												this.props.message
																								)
																				)
																)
												);
								}
				}]);
				return OnboardingItem;
}(React.Component);

var OnboardingItem$1 = core.withStyles(styles, { withTheme: true })(OnboardingItem);

var OnboardingTag = function (_Component) {
	inherits(OnboardingTag, _Component);

	function OnboardingTag(props) {
		classCallCheck(this, OnboardingTag);

		var _this = possibleConstructorReturn(this, (OnboardingTag.__proto__ || Object.getPrototypeOf(OnboardingTag)).call(this, props));

		_this.tagRef = React__default.createRef();
		_this.tagItem = null;
		OnboardingTag.tag = _this.tagRef;
		return _this;
	}

	createClass(OnboardingTag, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (this.tagRef.current) {
				this.tagItem = React__default.createElement(OnboardingItem$1, { elementID: this.tagRef.current, message: this.props.message });
				OnboardingTag.TagItems.push(this.tagItem);
			} else {
				console.log('Warning: Could not find OnboardingTag item to add.');
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var idx = OnboardingTag.TagItems.indexOf(this.tagItem);
			if (idx > -1) OnboardingTag.TagItems.splice(idx, 1);
		}
	}, {
		key: 'render',
		value: function render() {
			return React__default.createElement(
				'div',
				{ ref: this.tagRef },
				this.props.children
			);
		}
	}]);
	return OnboardingTag;
}(React.Component);

OnboardingTag.TagItems = [];

/*eslint-disable*/

var styles$1 = function styles(theme) {
  return {
    stepper: defineProperty({
      background: 'transparent',
      position: 'fixed',
      height: '5%',
      width: '100%',
      margin: '0 auto',
      bottom: '5%'
    }, theme.breakpoints.up('md'), {
      width: '50%',
      right: "0",
      left: "0",
      position: "absolute"
    }),
    skip: {
      position: 'absolute',
      bottom: "10%",
      width: '20%',
      right: 0,
      left: 0,
      padding: 0,
      margin: '0 auto',
      color: 'white',
      fontFamily: "Georgia,Roboto, Helvetica, Arial, cursive",
      fontSize: '15px',
      fontStyle: "italic"
      // [theme.breakpoints.up('sm')]: {
      //   fontFamily: '"cursive","Roboto", "Helvetica", "Arial", sans-serif'
      // },
    },
    dotActive: {
      backgroundColor: 'white'
    },
    text: {
      fontFamily: "Georgia,Roboto, Helvetica, Arial, cursive",
      color: 'white',
      fontSize: '15px',
      fontStyle: "italic"
      // [theme.breakpoints.up('sm')]: {
      //   fontFamily: '"cursive", "Roboto", "Helvetica", "Arial", sans-serif'
      // },
    },
    backdrop: {
      backgroundColor: "transparent!important"
      // opacity:"0.1 !important"
    },
    modalRoot: {
      zIndex: '99999'
    }
  };
};

var Onboarding = function (_Component) {
  inherits(Onboarding, _Component);

  // to store the current Onboarding item (required for a static reset function - easier to use)

  function Onboarding(props) {
    classCallCheck(this, Onboarding);

    var _this = possibleConstructorReturn(this, (Onboarding.__proto__ || Object.getPrototypeOf(Onboarding)).call(this, props));

    _this.handleClose = function () {
      _class.clear();
      _this.setState({ open: false, activeStep: 0 });
      localStorage.setItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + _this.props.name, true);
    };

    _this.handleNext = function () {

      var children = _this.props.children;
      children.forEach(function (child, index) {
        typeof child.props.elementID === 'string' ? document.getElementById(child.props.elementID) === null ? children = children.filter(function (id) {
          return id.props.elementID !== child.props.elementID;
        }) : "" : "";
      });
      if (_this.state.activeStep >= React__default.Children.count(children) + OnboardingTag.TagItems.length - 1) {
        _this.handleClose();
      } else {
        _this.setState(function (prevState) {
          return {
            activeStep: prevState.activeStep + 1
          };
        });
      }
    };

    _this.handleBack = function () {
      _this.setState(function (prevState) {
        return {
          activeStep: prevState.activeStep - 1
        };
      });
    };

    Onboarding.current = _this;
    var demoFlag = localStorage.getItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + _this.props.name); // the demoFlag will be the flag present in localStorage
    _this.state = {
      activeStep: 0, // the current step on which the onboarding is
      open: demoFlag === null || demoFlag === ""
    };
    _class.create();
    return _this;
  }

  createClass(Onboarding, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {}
  }, {
    key: 'render',
    value: function render() {
      var activeStep = this.state.activeStep;
      var _props = this.props,
          classes = _props.classes,
          children = _props.children;


      var children1 = this.props.children;
      children1.forEach(function (child, index) {
        typeof child.props.elementID === 'string' ? document.getElementById(child.props.elementID) === null ? children1 = children1.filter(function (id) {
          return id.props.elementID !== child.props.elementID;
        }) : "" : "";
      });

      // const childCount = React.Children.count(children)
      // const activeChild = childCount > 0 ?
      // (
      // 		childCount === 1 ? children :
      // 		(
      // 			childCount > activeStep ?
      // 				children[activeStep] :
      // 				children[childCount - 1]
      // 		)
      // 	) : null
      var childArray = React__default.Children.toArray(children1).concat(OnboardingTag.TagItems);

      var childCount = childArray.length;
      var activeChild = childCount > 0 ? childCount > activeStep ? childArray[activeStep] : childArray[childCount - 1] : null;
      return React__default.createElement(
        React.Fragment,
        null,
        childCount > 0 && React__default.createElement(
          core.Modal,
          { open: this.state.open, onClose: this.handleNext,
            style: { zIndex: '99999', backgroundColor: "transparent!important" },
            hideBackdrop: true
            // classes={{
            //   root: classes.modalRoot
            // }}
            // BackdropProps={{
            //   classes: { root: classes.backdrop }
            // }}
          },
          React__default.createElement(
            'div',
            null,
            React__default.createElement(
              'div',
              { onClick: this.handleNext },
              activeChild
            ),
            React__default.createElement(core.MobileStepper, {
              steps: childCount //maxSteps
              , position: 'static',
              activeStep: activeStep,
              className: classes.stepper,
              classes: {
                dotActive: classes.dotActive
              },
              nextButton: React__default.createElement(
                core.Button,
                { size: 'small', onClick: this.handleNext, className: classes.text, 'aria-label': 'Done/Next' },
                activeStep == childCount - 1 ? React__default.createElement(
                  'p',
                  null,
                  'Done'
                ) : React__default.createElement(
                  'p',
                  null,
                  'Next'
                )
              ),
              backButton: React__default.createElement(
                core.Button,
                { size: 'small', onClick: this.handleBack, disabled: activeStep === 0, className: classes.text, 'aria-label': 'Done/Next' },
                activeStep == 0 ? React__default.createElement('p', null) : React__default.createElement(
                  'p',
                  null,
                  'Back'
                )
              )
            }),
            React__default.createElement(
              core.Button,
              { size: 'small', onClick: this.handleClose, className: classes.skip },
              ' SKIP '
            )
          )
        )
      );
    }
  }], [{
    key: 'reset',
    value: function reset() {
      for (var obj in localStorage) {
        if (obj.startsWith(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX)) {
          localStorage.setItem(obj, "");
        }
      }
      Onboarding.current && Onboarding.current.setState({ open: true, activeStep: 0 });
    }
  }]);
  return Onboarding;
}(React.Component);

Onboarding.current = null;


var _Onboarding = core.withStyles(styles$1, { withTheme: true })(Onboarding);

var Onboarding$1 = _Onboarding;
// module.exports.reset = _Onboarding.reset
var OnboardingItem$2 = OnboardingItem$1;
var OnboardingTag$1 = OnboardingTag;

var src = {
	Onboarding: Onboarding$1,
	OnboardingItem: OnboardingItem$2,
	OnboardingTag: OnboardingTag$1
};

exports.default = src;
exports.Onboarding = Onboarding$1;
exports.OnboardingItem = OnboardingItem$2;
exports.OnboardingTag = OnboardingTag$1;
//# sourceMappingURL=index.js.map
