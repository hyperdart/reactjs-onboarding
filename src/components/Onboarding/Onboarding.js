import React, { Component, Fragment } from 'react';
import { Modal, MobileStepper, Button, withStyles } from '@material-ui/core';
import { isArray } from 'util';

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
    backgroundColor:"rgba(0, 0, 0, 0.69)",
    opacity:"0.1 !important"
  }
})

class Onboarding extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    // console.log(props,document.getElementById(props.children.props.elementCoOrdinate).getBoundingClientRect());
    
    let demoFlag = localStorage.getItem("_demo" + this.props.name)
    // console.log(React.Children.toArray(this.props.children)[0]);

    this.state = {
      activeStep: 0,
      open: demoFlag === null || demoFlag === "" ? true : false,
      step: React.Children.count(this.props.children),
      children: React.Children.toArray(this.props.children),
      visible : this.props.visible && React.Children.toArray(this.props.children)[0].props.elementCoOrdinate
    }

  }


  componentDidMount() {
    console.log(this.state.open)

    let childrens = [];
    let x
    React.Children.map(this.props.children, (child, i) => {


      if (child.props.elementCoOrdinate !== "") {
        // console.log(child);
        // console.log("if",i);

        childrens.push(child);
      }
      x = childrens.length;
      return childrens.length;
    });
    this.setState({ step: x, children: childrens }, () => {
      // console.log(isArray(this.state.children));

    })
  }
  componentDidUpdate(prevProps, prevState) {
    // // // console.log("did update");
    // console.log(React.Children.toArray(this.props.children) );

    if(prevProps.visible === this.props.visible)  return
    let visible = this.props.visible && React.Children.toArray(this.props.children)[0].props.elementCoOrdinate 
    if(!visible)  return

    let demoFlag = localStorage.getItem("_demo" + this.props.name)
    // console.log(demoFlag);
    var isTrueSet;
    if (demoFlag === null || demoFlag === "") {
      isTrueSet = true;
    }
    else {
      isTrueSet = (!demoFlag === 'true');
    }
    // console.log(isTrueSet);
    if (this.state.open !== isTrueSet) {
      this.setState({ open: true })
    }
    if (prevProps !== this.props) {
    let childrens = [];
    let x
    React.Children.map(this.props.children, (child, i) => {
// console.log(document.getElementById(child.props.elementCoOrdinate));

      if (document.getElementById(child.props.elementCoOrdinate) !== null) {
        // console.log("if");

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
  static reset() {
    for (let obj in localStorage) {
      if (obj.startsWith("_demo")) {
        localStorage.setItem(obj, "")
      }
    }
  }

  handleClose = () => {
    console.log(this.state.activeStep);
    
    console.log(React.Children.toArray(this.props.children[this.state.activeStep]));
    
    if(typeof React.Children.toArray(this.props.children)[this.state.activeStep].props.elementCoOrdinate == "string"){
      document.getElementById(React.Children.toArray(this.props.children)[this.state.activeStep].props.elementCoOrdinate).style.boxShadow="none"
      document.getElementById(React.Children.toArray(this.props.children)[this.state.activeStep].props.elementCoOrdinate).style.border="none"
      document.getElementById(React.Children.toArray(this.props.children)[this.state.activeStep].props.elementCoOrdinate).style.borderRadius="0"
  }
  else{
      React.Children.toArray(this.props.children)[this.state.activeStep].props.elementCoOrdinate.style.boxShadow="none"
      React.Children.toArray(this.props.children)[this.state.activeStep].props.elementCoOrdinate.style.border="none"
      React.Children.toArray(this.props.children)[this.state.activeStep].props.elementCoOrdinate.style.borderRadius="0"

  }
    this.setState({ open: false });
    this.setState({ activeStep: 0 });
    localStorage.setItem("_demo" + this.props.name, true)
  };

  handleNext = () => {
    if (this.state.activeStep == this.state.children.length - 1) {
      this.setState({
        open: false
      })
      this.setState({ activeStep: 0 });
      localStorage.setItem("_demo" + this.props.name, true)

      if(typeof React.Children.toArray(this.props.children)[this.state.children.length - 1].props.elementCoOrdinate == "string"){
        
        document.getElementById(React.Children.toArray(this.props.children)[this.state.children.length - 1].props.elementCoOrdinate).style.boxShadow="none"
        document.getElementById(React.Children.toArray(this.props.children)[this.state.children.length - 1].props.elementCoOrdinate).style.border="none"
        document.getElementById(React.Children.toArray(this.props.children)[this.state.children.length - 1].props.elementCoOrdinate).style.borderRadius="0"
    }
    else{
        React.Children.toArray(this.props.children)[this.state.children.length - 1].props.elementCoOrdinate.style.boxShadow="none"
        React.Children.toArray(this.props.children)[this.state.children.length - 1].props.elementCoOrdinate.style.border="none"
        React.Children.toArray(this.props.children)[this.state.children.length - 1].props.elementCoOrdinate.style.borderRadius="0"
  
    }


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
// console.log(this.state.children[activeStep]);

    return (
      <Fragment>
        {this.state.children.length > 0 && this.state.visible &&
          <Modal open={this.state.open} onClose={this.handleNext}
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
