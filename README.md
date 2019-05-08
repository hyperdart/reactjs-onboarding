# reactjs-onboarding

> Better introductions for websites and features with a step-by-step guide for your projects. 

[![NPM](https://img.shields.io/npm/v/reactjs-onboarding.svg)](https://www.npmjs.com/package/reactjs-onboarding) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


![grab-landing-page](https://media.giphy.com/media/RJtvjwk0mF2bOWk7Sx/giphy.gif)

## Install

You can obtain your local copy of reactjs-onboarding.js from:

**1)** This github repository, using ```git clone https://ikanwar97@bitbucket.org/hyperdart/reactjs-onboarding.git```

**2)** Using npm ```npm install reactjs-onboarding.js --save```


## Usage


reactjs-onboarding.js can be added to your project in three simple steps:



**1)** Include named imports of `Onboarding.js` and `OnboardingItem.js` in your page
For example:

```jsx

import {Onboarding} from 'reactjs-onboarding'
import {OnboardingItem} from 'reactjs-onboarding'
```


**2)** Give unique Id to the element that you want to point the arrow to
For example:

```jsx

<div id="example">
 Pass the co-ordinates for this element
</div>
```

**3)** Call Onboarding and OnboardingItem in render method
For example:

```jsx

<Onboarding name="example">
  <OnboardingItem elementCoOrdinate={document.getElementById("example").getBoundingClientRect()}  message='This is the onborading message'>
  </OnboardingItem>
</Onboarding>
```


## License

MIT � [](https://github.com/)
