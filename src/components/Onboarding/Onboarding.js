/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import { Modal, MobileStepper, Button, withStyles } from '@material-ui/core';
import CONSTANTS from './constants'
import OnboardingDiv from './onboarding-div'
import OnboardingTag from './OnboardingTag'

const styles = theme => ({
  stepper: {
    background: 'transparent',
    position: 'fixed',
    height: '5%',
    width: '100%',
    margin: '0 auto',
    bottom: '5%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
      right: "0",
      left: "0",
      position: "absolute",
    },
  },
  skip: {
    position: 'absolute',
    bottom: "10%",
    width: '20%',
    right:0,
    left:0,
    padding:0,
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
  backdrop:{
    backgroundColor:"transparent!important",
    // opacity:"0.1 !important"
  },
  modalRoot: {
    zIndex: '99999'
  }
})

class Onboarding extends Component {
	static current = null;						// to store the current Onboarding item (required for a static reset function - easier to use)

  constructor(props) {
		super(props);
		Onboarding.current = this;
    let demoFlag = localStorage.getItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + this.props.name)              // the demoFlag will be the flag present in localStorage
    this.state = {
      activeStep: 0,                                                            // the current step on which the onboarding is
      open: demoFlag === null || demoFlag === "",
		}
		OnboardingDiv.create();
  }


  componentDidMount() {
  }


  componentDidUpdate(prevProps, prevState) {
	}

  static reset() {
    for (let obj in localStorage) {
      if (obj.startsWith(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX)) {
        localStorage.setItem(obj, "")
      }
    }
		Onboarding.current && Onboarding.current.setState({open: true, activeStep: 0})
  }

  handleClose = () => {
		OnboardingDiv.clear()
    this.setState({ open: false, activeStep: 0 });
    localStorage.setItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + this.props.name, true)
  }

  handleNext = () => {

    let children = this.props.children
    children.forEach((child,index)=>{
      typeof child.props.elementID === 'string'?
        document.getElementById(child.props.elementID) === null ?
        children = children.filter(id => id.props.elementID!==child.props.elementID)
        :
        "" : ""
    })
    if (this.state.activeStep >= React.Children.count(children) + OnboardingTag.TagItems.length - 1) {
			this.handleClose();
    } else {
      this.setState(prevState => ({
        activeStep: prevState.activeStep + 1,
      }));
    }
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  render() {
    const { activeStep } = this.state;
    const { classes, children } = this.props;

    let children1 = this.props.children
    children1.forEach((child,index)=>{
      typeof child.props.elementID === 'string'?
        document.getElementById(child.props.elementID) === null ?
        children1 = children1.filter(id => id.props.elementID!==child.props.elementID)
        :
        "" : ""
    })

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
    const childArray = React.Children.toArray(children1).concat(OnboardingTag.TagItems)

		const childCount = childArray.length
		const activeChild = childCount > 0 ?
			(childCount > activeStep ?
				childArray[activeStep] :
				childArray[childCount - 1]
			) : null
    return (
      <Fragment>
        {childCount > 0 &&
          <Modal open={this.state.open} onClose={this.handleNext}
            style={{zIndex: '99999',backgroundColor:"transparent!important"}}
            hideBackdrop={true}
            // classes={{
            //   root: classes.modalRoot
            // }}
            // BackdropProps={{
            //   classes: { root: classes.backdrop }
            // }}
          >

            <div>
              <div onClick={this.handleNext}>
                {activeChild}
              </div>
              <MobileStepper
                steps={childCount}                              //maxSteps
                position="static"
                activeStep={activeStep}
                className={classes.stepper}
                classes={{
                  dotActive: classes.dotActive
                }}
                nextButton={
                  <Button size="small" onClick={this.handleNext} className={classes.text} aria-label="Done/Next">
                    {activeStep == childCount - 1 ? <p>Done</p> : <p>Next</p>}
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={this.handleBack} disabled={activeStep === 0} className={classes.text} aria-label="Done/Next">
                    {activeStep == 0 ? <p></p> : <p>Back</p>}
                  </Button>
                }
              />
              <Button size='small' onClick={this.handleClose} className={classes.skip}> SKIP </Button>
            </div>
          </Modal>
        }
      </Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Onboarding)
