import React, { Component, Fragment } from 'react';
import { Modal, MobileStepper, Button, withStyles } from '@material-ui/core';
import CONSTANTS from './constants'

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
    backgroundColor:"transparent",
    // opacity:"0.1 !important"
  },
  modalRoot: {
    zIndex: '99999'
  }
})

class Onboarding extends Component {
  constructor(props) {
    super(props);
    let demoFlag = localStorage.getItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + this.props.name)              // the demoFlag will be the flag present in localStorage with the initials of `_demo`

    this.state = {
      activeStep: 0,                                                            // the current step on which the onboarding is
      open: demoFlag === null || demoFlag === "",
		}
		if (document.getElementById(CONSTANTS.ONBOARDING_DIV_ID) === null) {
			let rootDiv = document.getElementsByTagName("body")[0]     //this creates a blank div on which the box shadow will be applied
			let newDiv = document.createElement("div")
			newDiv.id = CONSTANTS.ONBOARDING_DIV_ID
			rootDiv.appendChild(newDiv)    
		}
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
  }

  handleClose = () => {   
		const onboardingDiv = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID)
		if (onboardingDiv) {
			onboardingDiv.style.boxShadow="none"
			onboardingDiv.style.border="none"
			onboardingDiv.style.borderRadius="0"
		}
    this.setState({ open: false, activeStep: 0 });
    localStorage.setItem(CONSTANTS.LOCALSTORAGE_FLAG_PREFIX + this.props.name, true)
  }

  handleNext = () => {
    if (this.state.activeStep >= React.Children.count(this.props.children) - 1) {
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
		const childCount = React.Children.count(children)
		const activeChild = childCount > 0 ? 
			(
				childCount === 1 ? children :
				(
					childCount > this.state.activeStep ?
						children[this.state.activeStep] :
						children[childCount - 1]
				) 
			) : null
    return (
      <Fragment>
        {childCount > 0 &&
          <Modal open={this.state.open} onClose={this.handleNext}
          classes={{
            root: classes.modalRoot
          }}
          BackdropProps={{
            classes: { root: classes.backdrop }
          }}
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
                  <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0} className={classes.text} aria-label="Done/Next">
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
let reset = Onboarding.reset
export default withStyles(styles, { withTheme: true })(Onboarding)
