import React, { Component } from 'react';
import OnboardingItem from './OnboardingItem'

export default class OnboardingTag extends Component {
	static TagItems = [];

	constructor(props) {
		super(props);
		this.tagRef = React.createRef();
		this.tagItem = null
		OnboardingTag.tag = this.tagRef;
	}

	componentDidMount() {
		if (this.tagRef.current) {
			this.tagItem = React.createElement(OnboardingItem, {elementID: this.tagRef.current, message: this.props.message})
			OnboardingTag.TagItems.push(this.tagItem)	
		} else {
			console.log('Warning: Could not find OnboardingTag item to add.')
		}
	}

	componentWillUnmount() {
		const idx = OnboardingTag.TagItems.indexOf(this.tagItem)
		if (idx > -1)
			OnboardingTag.TagItems.splice(idx, 1)
	}

	render() {
		return <div ref={this.tagRef}>{this.props.children}</div>
	}
}