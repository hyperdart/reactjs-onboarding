import CONSTANTS from './constants'

const POSITION_TRANSITION = 'left 0.35s cubic-bezier(0.4,0,0.2,1), top 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1)';
const PADDING = 8; // breathing room around the highlighted element

// Tracks the timer that re-enables position transitions after a fade-in completes.
// Module-level so rapid setTarget calls don't stack timers.
let _reEnableTimer = null;

export default class {
  static create = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(CONSTANTS.ONBOARDING_DIV_ID) !== null) return;

    const div = document.createElement('div');
    div.id = CONSTANTS.ONBOARDING_DIV_ID;
    div.style.position = 'fixed';
    div.style.pointerEvents = 'none';
    div.style.visibility = 'hidden';
    div.style.opacity = '0';
    div.style.zIndex = '99998';
    document.getElementsByTagName('body')[0].appendChild(div);
  }

  // Makes the spotlight invisible without resetting its position/size.
  // Used before scrolling so setTarget can fade in at the correct spot.
  static hide = () => {
    if (typeof document === 'undefined') return;
    const div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
    if (!div) return;
    div.style.transition = 'opacity 0.15s ease';
    div.style.opacity = '0';
  }

  static setTarget = (targetRect, disableArrow) => {
    if (typeof document === 'undefined') return;
    const div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
    if (!div || !targetRect) return;

    // Detect whether we're appearing from a hidden/faded state so we can
    // snap to position first and fade in, rather than slide from 0,0.
    const appearing = div.style.visibility === 'hidden' || parseFloat(div.style.opacity || '1') < 0.5;

    div.style.visibility = 'visible';
    div.style.position = 'fixed';
    div.style.zIndex = '99998';
    div.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.68)';

    if (!disableArrow) {
      div.style.border = '2px solid rgba(255,255,255,0.8)';
      div.style.borderRadius = '6px';
    } else {
      div.style.border = 'none';
      div.style.borderRadius = '0';
    }

    if (appearing) {
      // Kill any pending re-enable timer from a previous appear cycle
      clearTimeout(_reEnableTimer);

      // Snap to the correct position instantly (no transition) while still invisible
      div.style.transition = 'none';
      div.style.opacity = '0';
      div.style.left = (targetRect.left - PADDING) + 'px';
      div.style.top = (targetRect.top - PADDING) + 'px';
      div.style.width = (targetRect.width + PADDING * 2) + 'px';
      div.style.height = (targetRect.height + PADDING * 2) + 'px';

      // Next frame: fade in at the already-correct position
      requestAnimationFrame(() => {
        div.style.transition = 'opacity 0.22s ease';
        div.style.opacity = '1';
        // After fade-in completes, restore position transitions for normal step movement
        _reEnableTimer = setTimeout(() => {
          div.style.transition = POSITION_TRANSITION;
        }, 220);
      });
    } else {
      clearTimeout(_reEnableTimer);
      div.style.transition = POSITION_TRANSITION;
      div.style.opacity = '1';
      div.style.left = (targetRect.left - PADDING) + 'px';
      div.style.top = (targetRect.top - PADDING) + 'px';
      div.style.width = (targetRect.width + PADDING * 2) + 'px';
      div.style.height = (targetRect.height + PADDING * 2) + 'px';
    }
  }

  static clear = () => {
    if (typeof document === 'undefined') return;
    const div = document.getElementById(CONSTANTS.ONBOARDING_DIV_ID);
    if (!div) return;
    clearTimeout(_reEnableTimer);
    div.style.transition = 'none';
    div.style.visibility = 'hidden';
    div.style.opacity = '0';
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
