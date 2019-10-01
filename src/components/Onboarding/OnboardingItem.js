import React, { Component, Fragment } from 'react';
import { Paper, Typography, withStyles, RootRef } from '@material-ui/core';
import ArrowCurved from './cb-arrow.js'
import CONSTANTS from './constants'

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
					targetRect: null
        }
    }

    componentDidMount() {
			this.computeStartEndPosition()
		}

    componentDidUpdate(prevProp, prevState) {
			if (prevProp.elementID !== this.props.elementID || prevProp.elementCoOrdinate !== this.props.elementCoOrdinate)
				this.computeStartEndPosition();
    }
		
		computeStartEndPosition = () => {
			const { elementID, elementCoOrdinate } = this.props;

			if (this.msgBox.current !== null)
				this.setState({
					msgBoxRect: this.msgBox.current.getBoundingClientRect()
				})
			const targetRect = typeof elementCoOrdinate === "object" ? {
																	left: elementCoOrdinate.l, 
																	top: elementCoOrdinate.t, 
																	width: elementCoOrdinate.w, 
																	height: elementCoOrdinate.h, 
																	right: elementCoOrdinate.l + elementCoOrdinate.w,
																	bottom: elementCoOrdinate.t + elementCoOrdinate.h
																} :
										typeof elementID === "string" ? document.getElementById(elementID).getBoundingClientRect() :
										typeof elementID === "object" ? elementID.getBoundingClientRect() :
										null;
			this.setState({
				targetRect: targetRect
			})

		}
    
    setOnboardingDivStyles() {
			const {targetRect} = this.state
			if (targetRect) {
				const onboardingDiv = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID)
				onboardingDiv.style.transition = "all .5s ease-out"
				onboardingDiv.style.position = "absolute"
				onboardingDiv.style.left = targetRect.left + "px"
				onboardingDiv.style.top = targetRect.top + "px"
				onboardingDiv.style.width = targetRect.width + "px"
				onboardingDiv.style.height = targetRect.height + "px"
				onboardingDiv.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.7)"
				onboardingDiv.style.border = "1px solid white"
				onboardingDiv.style.borderRadius = "5px"
				onboardingDiv.style.zIndex = "99999"	
			}
		}

    render() {
				const { classes } = this.props;
				const {msgBoxRect, targetRect} = this.state;

				this.setOnboardingDivStyles()
        return (
            <Fragment>
                <div>
									<ArrowCurved color="white" startBox={msgBoxRect} endBox={targetRect}/>
									<RootRef rootRef={this.msgBox} >
                    <Paper square elevation={0} className={classes.paperStyle} style={{top: this.props.top}}>
                        <Typography variant='h6' className={classes.textStyle}>{this.props.message}</Typography>
                    </Paper>
									</RootRef>
                </div>
            </Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(OnboardingItem);