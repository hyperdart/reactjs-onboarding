/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import ArrowCurved from './cb-arrow.js'
import OnboardingDiv from './onboarding-div'


const styles = theme => ({
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
})

class OnboardingItem extends Component {

    constructor(props) {
        super(props);
				this.msgBox = React.createRef()
        this.state = {
					msgBoxRect: null,
					targetRect: null,
					disableArrow : props.disableArrow!==undefined ? props.disableArrow :false
        }
    }

    componentDidMount() {
			this.computeStartEndPosition()
		}

    componentDidUpdate(prevProp, prevState) {
			// console.log("PP",prevProp)
			if (prevProp.elementID !== this.props.elementID || prevProp.elementCoOrdinate !== this.props.elementCoOrdinate)
				this.computeStartEndPosition();
    }

		computeStartEndPosition = () => {
			const { elementID, elementCoOrdinate } = this.props;

			if (this.msgBox.current && this.msgBox.current.getBoundingClientRect)
				this.setState({
					msgBoxRect: this.msgBox.current.getBoundingClientRect()
				})
			const el = typeof elementID === "string" ?
								document.getElementById(elementID) :
								(typeof elementID === "object" ? elementID : null)
			const targetRect = typeof elementCoOrdinate === "object" ? {
																	left: elementCoOrdinate.l || 0,
																	top: elementCoOrdinate.t || 0,
																	width: elementCoOrdinate.w || 0,
																	height: elementCoOrdinate.h || 0,
																	right: (elementCoOrdinate.l || 0) + (elementCoOrdinate.w || 0),
																	bottom: (elementCoOrdinate.t || 0) + (elementCoOrdinate.h || 0)
																} :
										typeof elementID === "string" || typeof elementID === "object" ? el && el.getBoundingClientRect && el.getBoundingClientRect() :
										null;
			this.setState({
				targetRect: targetRect
			})

		}

    render() {
				const { classes } = this.props;
				const {msgBoxRect, targetRect} = this.state;

				OnboardingDiv.setTarget(this.state.targetRect,this.props.disableArrow)
        return (
            <Fragment>
                <div>
									<ArrowCurved color="white" width={this.state.disableArrow && "0" } startBox={msgBoxRect} endBox={targetRect}/>
									<div ref={this.msgBox} className={classes.paperStyle} style={{top: this.props.top}}>
											<Typography variant='h6' className={classes.textStyle}>{this.props.message}</Typography>
									</div>
                </div>
            </Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(OnboardingItem);