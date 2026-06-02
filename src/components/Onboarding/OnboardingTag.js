/*eslint-disable*/
import React, { useEffect, useRef } from 'react';
import OnboardingItem from './OnboardingItem'

const _tagItems = [];

function OnboardingTag({ message, children }) {
  const tagRef = useRef(null);
  const tagItemRef = useRef(null);

  useEffect(() => {
    if (tagRef.current) {
      tagItemRef.current = React.createElement(OnboardingItem, { elementID: tagRef.current, message });
      _tagItems.push(tagItemRef.current);
    } else {
      console.warn('OnboardingTag: could not find mounted element.');
    }
    return () => {
      const idx = _tagItems.indexOf(tagItemRef.current);
      if (idx > -1) _tagItems.splice(idx, 1);
    };
  }, []);

  return <div ref={tagRef}>{children}</div>;
}

OnboardingTag.TagItems = _tagItems;

export default OnboardingTag;
