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
})

class OnboardingItem extends Component {

    constructor(props) {
        super(props);
        // console.log(props);
       
        var coordinate
        if(typeof props.elementCoOrdinate == "string"){
        document.getElementById(props.elementCoOrdinate).style.boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.8)"
        document.getElementById(props.elementCoOrdinate).style.border="2px solid white"
        document.getElementById(props.elementCoOrdinate).style.borderRadius="5px"
        coordinate = document.getElementById(props.elementCoOrdinate).getBoundingClientRect()
    }
        else{
         props.elementCoOrdinate.style.boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.8)"
        props.elementCoOrdinate.style.border="2px solid white"
        props.elementCoOrdinate.style.borderRadius="5px"
        coordinate = props.elementCoOrdinate.getBoundingClientRect()

        }
        // coordinate.left = coordinate.top = coordinate.width = coordinate.height = 0 
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
        var coordinate
        if(typeof this.props.elementCoOrdinate == "string"){
            document.getElementById(this.props.elementCoOrdinate).style.boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.8)"
        document.getElementById(this.props.elementCoOrdinate).style.border="2px solid white"
        document.getElementById(this.props.elementCoOrdinate).style.borderRadius="5px"
        coordinate = document.getElementById(this.props.elementCoOrdinate).getBoundingClientRect()
        }
        else{
            this.props.elementCoOrdinate.style.boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.8)"
            this.props.elementCoOrdinate.style.border="2px solid white"
            this.props.elementCoOrdinate.style.borderRadius="5px"
        coordinate = this.props.elementCoOrdinate.getBoundingClientRect()

        }
        // var coordinate = document.getElementById(this.props.elementCoOrdinate).getBoundingClientRect()
        if (document.getElementById("arrow") !== null) {
            this.setState({
                arrowWidth: document.getElementById("arrow").getBoundingClientRect().width,
                arrowHeight: document.getElementById("arrow").getBoundingClientRect().height,
                elementToPointLeft: coordinate.left,
                elementToPointTop: coordinate.top,
                elementToPointWidth: coordinate.width,
                elementToPointHeight: coordinate.height
            }, () => {
                this.calculateArrowPosition(this.state.elementToPointLeft, this.state.elementToPointTop, this.state.elementToPointWidth , this.state.elementToPointHeight / 1.05, this.state.innerWidth / 2, this.state.innerHeight / 2, this.state.arrowWidth, this.state.arrowHeight);
            })
        }
    }

    componentDidUpdate(prevProp, prevState) {
        if(prevProp.elementCoOrdinate !== this.props.elementCoOrdinate){
            if(typeof prevProp.elementCoOrdinate == "string"){
                document.getElementById(prevProp.elementCoOrdinate).style.boxShadow="none"
                document.getElementById(prevProp.elementCoOrdinate).style.border="none"
                document.getElementById(prevProp.elementCoOrdinate).style.borderRadius="0"
            }
            else{
                prevProp.elementCoOrdinate.style.boxShadow="none"
                prevProp.elementCoOrdinate.style.border="none"
                prevProp.elementCoOrdinate.style.borderRadius="0"
    
            }
           

        }
        var coordinate
        if(typeof this.props.elementCoOrdinate == "string"){
            document.getElementById(this.props.elementCoOrdinate).style.boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.8)"
        document.getElementById(this.props.elementCoOrdinate).style.border="2px solid white"
        document.getElementById(this.props.elementCoOrdinate).style.borderRadius="5px"
        coordinate = document.getElementById(this.props.elementCoOrdinate).getBoundingClientRect()
        }
        else{
            this.props.elementCoOrdinate.style.boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.8)"
            this.props.elementCoOrdinate.style.border="2px solid white"
            this.props.elementCoOrdinate.style.borderRadius="5px"
        coordinate = this.props.elementCoOrdinate.getBoundingClientRect()

        }
        // var coordinate = document.getElementById(this.  props.elementCoOrdinate).getBoundingClientRect()
        if (prevProp !== this.props && document.getElementById("arrow") !== null) {
            this.setState({
                arrowWidth: document.getElementById("arrow").getBoundingClientRect().width,
                arrowHeight: document.getElementById("arrow").getBoundingClientRect().height,
                elementToPointLeft: coordinate.left,
                elementToPointTop: coordinate.top,
                elementToPointWidth: coordinate.width,
                elementToPointHeight: coordinate.height
            }, () => {
                this.calculateArrowPosition(this.state.elementToPointLeft, this.state.elementToPointTop, this.state.elementToPointWidth , this.state.elementToPointHeight / 2, this.state.innerWidth / 2, this.state.innerHeight / 2, this.state.arrowWidth, this.state.arrowHeight);
            })
        }
    }

    calculateArrowPosition = (elementToPointLeft, elementToPointTop, elementToPointWidth, elementToPointHeight, innerWidth, innerHeight, arrowWidth, arrowHeight) => {
        if (this.state.elementToPointTop < innerHeight && elementToPointLeft > innerWidth) {
            console.log('Q1',arrowWidth)
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
            console.log('Q2')
            if(elementToPointLeft + elementToPointWidth < arrowWidth ){
                this.setState({
                    arrowPositionLeft: elementToPointLeft + elementToPointWidth,
                    arrowPositionTop: elementToPointTop  + elementToPointHeight,
                    // flipX: 0,
                    // flipY: 180
                    flipX: -1,
                    flipY: 1
                })
            }
            else{
                this.setState({
                    arrowPositionLeft: elementToPointLeft + elementToPointWidth ,
                    arrowPositionTop: elementToPointTop + elementToPointHeight ,
                    // flipX: 0,
                    // flipY: 180
                    flipX: -1,
                    flipY: 1
                })
            }

        }
        else if (elementToPointTop > innerHeight && elementToPointLeft < innerWidth) {
            console.log('Q3')
            if(elementToPointLeft - elementToPointWidth < arrowWidth ){
                this.setState({
                    arrowPositionLeft: elementToPointLeft + elementToPointWidth,
                    arrowPositionTop: elementToPointTop - elementToPointHeight ,
                    // flipX: 180,
                    // flipY: 180
                    flipX: -1,
                    flipY: -1
                })
            }
            else
            {
                this.setState({
                    arrowPositionLeft: elementToPointLeft  - arrowWidth,
                    arrowPositionTop: elementToPointTop - elementToPointHeight ,
                    // flipX: 180,
                    // flipY: 180
                    flipX: -1,
                    flipY: -1
                })
            }


        }
        else if (elementToPointTop > innerHeight && elementToPointLeft > innerWidth) {
            console.log('Q4')
            this.setState({
                arrowPositionLeft: elementToPointLeft - arrowWidth,
                arrowPositionTop: elementToPointTop - elementToPointHeight ,
                // flipX: 180,
                // flipY: 0
                flipX:1,
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
    render() {
        // let angle1 = Math.abs(Math.atan((innerHeight / 2 - y) / (innerWidth / 2 - x)));
        // let angle = (angle1 * 180 / Math.PI)

        const { classes } = this.props;
        let stylesImg
        if (this.props.elementCoOrdinate) {
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