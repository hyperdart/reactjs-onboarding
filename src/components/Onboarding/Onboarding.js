import React, { Component, Fragment } from 'react';
import { Modal, MobileStepper, Button, withStyles } from '@material-ui/core';

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
    let demoFlag = localStorage.getItem("_demo" + this.props.name)              // the demoFlag will be the flag present in localStorage with the initials of `_demo`

    this.state = {
      activeStep: 0,                                                            // the current step on which the onboarding is
      open: demoFlag === null || demoFlag === "" ? true : false,
      step: React.Children.count(this.props.children),                          // the total number of steps in the modal stepper
      children: React.Children.toArray(this.props.children),
      visible : this.props.visible && (React.Children.toArray(this.props.children)[0].props.elementID || React.Children.toArray(this.props.children)[0].props.elementCoOrdinate)    // this flags the visibility of the modal
    }
    let rootDiv = document.getElementsByTagName("body")[0]     //this creates a blank div on which the box shadow will be applied
    let newDiv = document.createElement("div")
    newDiv.id = "onboarding"
    rootDiv.appendChild(newDiv)    
  }


  componentDidMount() {
    if(!document.getElementById("onboarding")){
      let rootDiv = document.getElementsByTagName("body")[0]
      let newDiv = document.createElement("div")
      newDiv.id = "onboarding"
      rootDiv.appendChild(newDiv)
    }
    let childrens = [];
    let x
    React.Children.map(this.props.children, (child, i) => {
      if ((document.getElementById(child.props.elementID) !== null || child.props.elementCoOrdinate!==undefined)  ) {      
        childrens.push(child);
      }
      x = childrens.length;
      return childrens.length;
    });
    this.setState({ step: x, children: childrens })
  }


  componentDidUpdate(prevProps, prevState) {    
    if(prevProps.visible === this.props.visible && localStorage.getItem("_demo" + this.props.name)!== "")  {
        return
      }
    let visible = this.props.visible && (React.Children.toArray(this.props.children)[0].props.elementID || React.Children.toArray(this.props.children)[0].props.elementCoOrdinate)
    if(!visible) {
      return
    } 

    else{
      let demoFlag = localStorage.getItem("_demo" + this.props.name)
      var isTrueSet;
      if (demoFlag === null || demoFlag === "") {
        isTrueSet = true;
      }
      else {
        isTrueSet = (!demoFlag === 'true');
      }
      if (this.state.open !== isTrueSet) {
        this.setState({ open: true })
      }
      if (prevProps !== this.props) {
      let childrens = [];
      let x
      React.Children.map(this.props.children, (child, i) => {
  
        if ((document.getElementById(child.props.elementID) !== null || child.props.elementCoOrdinate!==undefined) ) {
          childrens.push(child);
        }
        x = childrens.length;
        return childrens.length;
      });
      this.setState({ 
        step: x, 
        children: childrens,
        visible
        })
      }
    } 
  }
  static reset() {
    for (let obj in localStorage) {
      if (obj.startsWith("_demo")) {
        localStorage.setItem(obj, "")
      }
    }
  }

  handleClose = () => {
    
    document.getElementById("onboarding").style.boxShadow="none"
      document.getElementById("onboarding").style.border="none"
      document.getElementById("onboarding").style.borderRadius="0"

    this.setState({ open: false });
    this.setState({ visible: false });
    this.setState({ activeStep: 0 });
    localStorage.setItem("_demo" + this.props.name, true)
  };

  handleNext = () => {
    if (this.state.activeStep == this.state.children.length - 1) {
      this.setState({
        open: false
      })
      this.setState({ visible: false });
      this.setState({ activeStep: 0 });
      localStorage.setItem("_demo" + this.props.name, true)

      document.getElementById("onboarding").style.boxShadow="none"
      document.getElementById("onboarding").style.border="none"
      document.getElementById("onboarding").style.borderRadius="0"


    }
    else {
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
    const { classes } = this.props;

    return (
      <Fragment>
        {this.state.children.length > 0 && this.state.visible &&
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
                {this.state.children.length>1?this.state.children[activeStep]: this.state.children}
              </div>
              <MobileStepper
                steps={this.state.children.length}                              //maxSteps
                position="static"
                activeStep={this.state.activeStep}
                className={classes.stepper}
                classes={{
                  dotActive: classes.dotActive
                }}
                nextButton={
                  <Button size="small" onClick={this.handleNext} className={classes.text} aria-label="Done/Next">
                    {this.state.activeStep == this.state.children.length - 1 ?
                      <p>Done</p>
                      : <p>Next</p>}
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0} className={classes.text} aria-label="Done/Next">
                    {this.state.activeStep == 0 ?
                      <p></p>
                      : <p>Back</p>}
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
