import React, { Component, Fragment } from 'react';
import { Paper, Typography, withStyles } from '@material-ui/core';
import ArrowCurved from './curved-arrow.js'

const styles = theme => ({
    textStyle: {
        color: 'white',
        fontFamily: "Georgia,Roboto, Helvetica, Arial, cursive",
        fontStyle: "italic"
    },
    svgDimensions: {
        width: '60%',
    },
    boxShadow: {
        position: "absolute"

    }
})

class OnboardingItem extends Component {

    constructor(props) {
        super(props);
        // console.log(props);
        const { classes } = props;
        var coordinate = {left:0,top:0,width:0,height:0}

        // send id
        if (typeof props.elementID == "string") {
            this.setOnboardingDivStyles(document.getElementById("onboarding"), document.getElementById(props.elementID).getBoundingClientRect())
            coordinate = document.getElementById(props.elementID).getBoundingClientRect()
        }

        // send ref
        else if (typeof props.elementID=="object") {
            console.log("Ref...",props.elementID);
            this.setOnboardingDivStyles(document.getElementById("onboarding"), props.elementID.getBoundingClientRect())
            coordinate = props.elementID.getBoundingClientRect()
            
        }

        // send co-ord
        else {
            console.log("co...",props.elementCoOrdinate.l);
            
            coordinate.left = props.elementCoOrdinate.l
            coordinate.top = props.elementCoOrdinate.t
            coordinate.width = props.elementCoOrdinate.w
            coordinate.height = props.elementCoOrdinate.h
        }
        // console.log(props);
        this.state = {
            innerHeight: window.innerHeight,
            innerWidth: window.innerWidth,
            elementToPointLeft: coordinate.left,
            elementToPointTop: coordinate.top,
            elementToPointWidth: coordinate.width,
            elementToPointHeight: coordinate.height,
            flipX: 0,
            flipY: 0,
            arrowPositionLeft: 0,
            arrowPositionTop: 0,
            arrowWidth: 0,
            arrowHeight: 0,
        }
    
    }


    componentDidMount() {
        var coordinate = {left:0,top:0,width:0,height:0}

        // id
        if (typeof this.props.elementID == "string") {
            this.setOnboardingDivStyles(document.getElementById("onboarding"), document.getElementById(this.props.elementID).getBoundingClientRect())
            coordinate = document.getElementById(this.props.elementID).getBoundingClientRect()
        }

        // ref
        else if (typeof this.props.elementID == "object" ) {

            this.props.elementID.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.8)"
            this.props.elementID.style.border = "2px solid white"
            this.props.elementID.style.borderRadius = "5px"
            coordinate = this.props.elementID.getBoundingClientRect()
            
        }

        // co-ord
        else {
            console.log("co...",this.props.elementCoOrdinate.l);
            coordinate.left = this.props.elementCoOrdinate.l
            coordinate.top = this.props.elementCoOrdinate.t
            coordinate.width = this.props.elementCoOrdinate.w
            coordinate.height = this.props.elementCoOrdinate.h


            this.setOnboardingDivStyles(document.getElementById("onboarding"), coordinate)

        }
        // var coordinate = document.getElementById(this.props.elementID).getBoundingClientRect()

        if (document.getElementById("arrow") !== null) {
            this.setState({
                arrowWidth: document.getElementById("arrow").getBoundingClientRect().width,
                arrowHeight: document.getElementById("arrow").getBoundingClientRect().height,
                elementToPointLeft: coordinate.left,
                elementToPointTop: coordinate.top,
                elementToPointWidth: coordinate.width,
                elementToPointHeight: coordinate.height
            }, () => {
                this.calculateArrowPosition(this.state.elementToPointLeft, this.state.elementToPointTop, this.state.elementToPointWidth, this.state.elementToPointHeight / 1.05, this.state.innerWidth / 2, this.state.innerHeight / 2, this.state.arrowWidth, this.state.arrowHeight);
            })
        }
    }

    componentDidUpdate(prevProp, prevState) {
        if (prevProp.elementID !== this.props.elementID) {
            if (typeof prevProp.elementID == "string") {
                document.getElementById("onboarding").style.boxShadow = "none"
                document.getElementById("onboarding").style.border = "none"
                document.getElementById("onboarding").style.borderRadius = "0"
            }
            else if (typeof prevProp.elementID == "object") {
                prevProp.elementID.style.boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.8)"
                prevProp.elementID.style.border="2px solid white"
                prevProp.elementID.style.borderRadius="5px"
            }
            else {
                document.getElementById("onboarding").style.boxShadow = "none"
                document.getElementById("onboarding").style.border = "none"
                document.getElementById("onboarding").style.borderRadius = "0"
            }


        }

        else if(prevProp.elementCoOrdinate !== this.props.elementCoOrdinate){
            document.getElementById("onboarding").style.boxShadow = "none"
                document.getElementById("onboarding").style.border = "none"
                document.getElementById("onboarding").style.borderRadius = "0"
        }

        var coordinate = {left:0,top:0,width:0,height:0}
        if (typeof this.props.elementID == "string") {
            
            this.setOnboardingDivStyles(document.getElementById("onboarding"), document.getElementById(this.props.elementID).getBoundingClientRect())
            coordinate = document.getElementById(this.props.elementID).getBoundingClientRect()
        }
        else if (typeof this.props.elementID == "object") {
            this.props.elementID.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.8)"
            this.props.elementID.style.border = "2px solid white"
            this.props.elementID.style.borderRadius = "5px"
            coordinate = this.props.elementID.getBoundingClientRect()
        }

        else {
            
            coordinate.left = this.props.elementCoOrdinate.l
            coordinate.top = this.props.elementCoOrdinate.t
            coordinate.width = this.props.elementCoOrdinate.w
            coordinate.height = this.props.elementCoOrdinate.h
            this.setOnboardingDivStyles(document.getElementById("onboarding"), coordinate)
        }



        // var coordinate = document.getElementById(this.  props.elementID).getBoundingClientRect()
        if (prevProp !== this.props && document.getElementById("arrow") !== null) {

            this.setState({
                arrowWidth: document.getElementById("arrow").getBoundingClientRect().width,
                arrowHeight: document.getElementById("arrow").getBoundingClientRect().height,
                elementToPointLeft: coordinate.left,
                elementToPointTop: coordinate.top,
                elementToPointWidth: coordinate.width,
                elementToPointHeight: coordinate.height
            }, () => {
                this.calculateArrowPosition(this.state.elementToPointLeft, this.state.elementToPointTop, this.state.elementToPointWidth, this.state.elementToPointHeight / 2, this.state.innerWidth / 2, this.state.innerHeight / 2, this.state.arrowWidth, this.state.arrowHeight);
            })
        }
    }

    calculateArrowPosition = (elementToPointLeft, elementToPointTop, elementToPointWidth, elementToPointHeight, innerWidth, innerHeight, arrowWidth, arrowHeight) => {
     
        
        if (elementToPointTop < innerHeight && elementToPointLeft > innerWidth) {
            // console.log('Q1')
            this.setState({
                arrowPositionLeft: elementToPointLeft - arrowWidth,
                arrowPositionTop: elementToPointTop + elementToPointHeight,
                // flipX: 0,
                // flipY: 0
                flipX: 1,
                flipY: 1
            })
        }
        else if (elementToPointTop < innerHeight && elementToPointLeft < innerWidth) {
            // console.log('Q2')
            if (elementToPointLeft + elementToPointWidth < arrowWidth) {
                this.setState({
                    arrowPositionLeft: elementToPointLeft + elementToPointWidth,
                    arrowPositionTop: elementToPointTop + elementToPointHeight,
                    // flipX: 0,
                    // flipY: 180
                    flipX: -1,
                    flipY: 1
                })
            }
            else {
                this.setState({
                    arrowPositionLeft: elementToPointLeft + elementToPointWidth,
                    arrowPositionTop: elementToPointTop + elementToPointHeight,
                    // flipX: 0,
                    // flipY: 180
                    flipX: -1,
                    flipY: 1
                })
            }

        }
        else if (elementToPointTop > innerHeight && elementToPointLeft < innerWidth) {
            // console.log('Q3')
            if (elementToPointLeft - elementToPointWidth < arrowWidth) {
                this.setState({
                    arrowPositionLeft: elementToPointLeft + elementToPointWidth,
                    arrowPositionTop: elementToPointTop - elementToPointHeight,
                    // flipX: 180,
                    // flipY: 180
                    flipX: -1,
                    flipY: -1
                })
            }
            else {
                this.setState({
                    arrowPositionLeft: elementToPointLeft + elementToPointWidth,
                    arrowPositionTop: elementToPointTop - elementToPointHeight,
                    // flipX: 180,
                    // flipY: 180
                    flipX: -1,
                    flipY: -1
                })
            }


        }
        else if (elementToPointTop > innerHeight && elementToPointLeft > innerWidth) {
            // console.log('Q4')
            this.setState({
                arrowPositionLeft: elementToPointLeft - arrowWidth,
                arrowPositionTop: elementToPointTop - elementToPointHeight,
                // flipX: 180,
                // flipY: 0
                flipX: 1,
                flipY: -1
            })
        }
        else if (elementToPointTop === innerHeight || elementToPointLeft === innerWidth) {
            // console.log('Equal height or width')
            this.setState({
                arrowPositionLeft: elementToPointLeft - elementToPointWidth - arrowWidth,
                arrowPositionTop: elementToPointTop - elementToPointHeight,
                // flipX: 180,
                // flipY: 180
                flipX: -1,
                flipY: -1
            })
        }
    }


    setOnboardingDivStyles(onboardingDiv, elementID) {
        onboardingDiv.style.position = "absolute"
        onboardingDiv.style.left = elementID.left + "px"
        onboardingDiv.style.top = elementID.top + "px"
        onboardingDiv.style.width = elementID.width + "px"
        onboardingDiv.style.height = elementID.height + "px"
        onboardingDiv.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.8)"
        onboardingDiv.style.border = "2px solid white"
        onboardingDiv.style.borderRadius = "5px"
        onboardingDiv.style.zIndex = "99999"
    }
    render() {
        // let angle1 = Math.abs(Math.atan((innerHeight / 2 - y) / (innerWidth / 2 - x)));
        // let angle = (angle1 * 180 / Math.PI)

        const { classes } = this.props;
        let stylesImg
        if (this.props.elementID || this.props.elementCoOrdinate ) {
            stylesImg = {
                width: '64px',
                height: "64px",
                position: 'absolute',
                fill: "white",
                // transform: `rotateX(${this.state.flipX}deg) rotateY(${this.state.flipY}deg)`,
                // WebkitTransform: `rotateX(${this.state.flipX}deg) rotateY(${this.state.flipY}deg)`,
                transform: `scaleX(${this.state.flipX}) scaleY(${this.state.flipY})`,
                WebkitTransform: `scaleX(${this.state.flipX}) scaleY(${this.state.flipY})`,
                left: this.state.arrowPositionLeft,
                top: this.state.arrowPositionTop,
                color:"red"

            }
        }
        return (
            <Fragment>
                {this.props.render && this.props.render()}
                <div>
                    {React.createElement(ArrowCurved, { dimensions: classes.svgDimensions, stylesImg: stylesImg, id: "arrow" })}
                    <Paper square elevation={0} style={{ textAlign: "center", position: "absolute", top: "0", left: 0, bottom: 0, right: 0, margin: "auto", background: "transparent", height: "100px", width: "100%" }} >
                        <Typography variant='h6' className={classes.textStyle}>{this.props.message}</Typography>
                    </Paper>
                </div>
            </Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(OnboardingItem);