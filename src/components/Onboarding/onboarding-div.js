import CONSTANTS from './constants'

export default class {
  static create = () => {
    if (document.getElementById(CONSTANTS.ONBOARDING_DIV_ID) === null) {
      const body = document.getElementsByTagName('body')[0];
      const div = document.createElement('div');
      div.id = CONSTANTS.ONBOARDING_DIV_ID;
      div.style.position = 'fixed';
      div.style.pointerEvents = 'none';
      div.style.visibility = 'hidden';
      // Keep below React root's z-index so the arrow SVG (rendered inside React) paints on top.
      // onboarding-div is appended to <body> after the React root, so at equal z-index it would
      // win the DOM-order paint race and cover the arrow — hence one level lower here.
      div.style.zIndex = '99998';
      body.appendChild(div);
    }
  }

  static setTarget = (targetRect, disableArrow) => {
    const div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
    if (!div || !targetRect) return;

    div.style.visibility = 'visible';
    div.style.transition = 'left 0.35s cubic-bezier(0.4,0,0.2,1), top 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1)';
    div.style.position = 'fixed';
    div.style.left = targetRect.left + 'px';
    div.style.top = targetRect.top + 'px';
    div.style.width = targetRect.width + 'px';
    div.style.height = targetRect.height + 'px';
    div.style.zIndex = '99998';

    if (!disableArrow) {
      div.style.border = '2px solid rgba(255,255,255,0.8)';
      div.style.borderRadius = '6px';
      div.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.68)';
    } else {
      div.style.border = 'none';
      div.style.borderRadius = '0';
      div.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.68)';
    }
  }

  static clear = () => {
    const div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
    if (!div) return;
    div.style.visibility = 'hidden';
    div.style.left = '0';
    div.style.top = '0';
    div.style.width = '0';
    div.style.height = '0';
    div.style.boxShadow = 'none';
    div.style.border = 'none';
    div.style.borderRadius = '0';
    div.style.zIndex = '-1';
  }
}
