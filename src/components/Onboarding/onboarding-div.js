import CONSTANTS from './constants'

export default class {
  static create = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(CONSTANTS.ONBOARDING_DIV_ID) !== null) return;

    const div = document.createElement('div');
    div.id = CONSTANTS.ONBOARDING_DIV_ID;
    div.style.position = 'fixed';
    div.style.pointerEvents = 'none';
    div.style.visibility = 'hidden';
    // Lower than React root's overlay (99999) so the tooltip SVG/caret paints on top.
    // onboarding-div is appended after the React root in DOM order, so at equal z-index
    // it would win the paint race — keeping it one level lower prevents that.
    div.style.zIndex = '99998';
    document.getElementsByTagName('body')[0].appendChild(div);
  }

  static setTarget = (targetRect, disableArrow) => {
    if (typeof document === 'undefined') return;
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
    div.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.68)';

    if (!disableArrow) {
      div.style.border = '2px solid rgba(255,255,255,0.8)';
      div.style.borderRadius = '6px';
    } else {
      div.style.border = 'none';
      div.style.borderRadius = '0';
    }
  }

  static clear = () => {
    if (typeof document === 'undefined') return;
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
