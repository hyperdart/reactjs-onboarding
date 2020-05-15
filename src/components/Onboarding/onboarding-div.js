import CONSTANTS from './constants'

export default class {
	static create = () => {
		if (document.getElementById(CONSTANTS.ONBOARDING_DIV_ID) === null) {
			let rootDiv = document.getElementsByTagName("body")[0]     //this creates a blank div on which the box shadow will be applied
			let newDiv = document.createElement("div")
			newDiv.id = CONSTANTS.ONBOARDING_DIV_ID
			rootDiv.appendChild(newDiv)
		}
	}

	static setTarget = (targetRect,disableArrow) => {
		const onboardingDiv = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID)
		if (onboardingDiv && targetRect) {
					onboardingDiv.style.visibility = "visible"
					onboardingDiv.style.transition = "all .5s ease-out"
					onboardingDiv.style.position = "absolute"
					onboardingDiv.style.left = targetRect.left + "px"
					onboardingDiv.style.top = targetRect.top + "px"
					onboardingDiv.style.width = targetRect.width + "px"
					onboardingDiv.style.height = targetRect.height + "px"
					onboardingDiv.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.7)"
				 	if(!disableArrow){
						onboardingDiv.style.border = "1px solid white"
						onboardingDiv.style.borderRadius = "5px"
					}
				onboardingDiv.style.zIndex = "99999"
		}
	}

	static clear = () => {
		const onboardingDiv = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID)
		if (onboardingDiv) {
			onboardingDiv.style.visibility = "hidden"
			onboardingDiv.style.left = "0px"
			onboardingDiv.style.top = "0px"
			onboardingDiv.style.width = "0px"
			onboardingDiv.style.height = "0px"
			onboardingDiv.style.boxShadow="none"
			onboardingDiv.style.border="none"
			onboardingDiv.style.borderRadius="0"
			onboardingDiv.style.zIndex = "-1"
		}
	}
}
