/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Gigamon site-wide cleanup.
 * Selectors verified from captured DOM (cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent (OneTrust) - found at line 4450: div#onetrust-consent-sdk
    // Remove sticky footer CTA bar - found at line 1812: div.sticky-footer
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.sticky-footer',
      'cs-native-frame-holder',
    ]);
  }

  if (hookName === H.after) {
    // Remove global navigation - found at line 12: div.global-navigation
    // Remove fat footer - found at line 4157: div.fat-footer
    // Remove mobile nav - found at line 15: nav#mp-menu
    // Remove link elements (hreflang, CSS) - found at lines 3-10
    // Remove iframes, noscript
    WebImporter.DOMUtils.remove(element, [
      '.global-navigation',
      '.fat-footer',
      'nav#mp-menu',
      'link',
      'iframe',
      'noscript',
    ]);
  }
}
