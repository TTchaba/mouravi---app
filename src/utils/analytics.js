import { logEvent } from 'firebase/analytics';
import { analytics } from './firebaseConfig';

/**
 * Safe wrapper around Firebase Analytics
 * Logs events and handles errors gracefully
 * If analytics is not available, events are silently ignored
 */

/**
 * Track a custom event with optional parameters
 * @param {string} eventName - Name of the event
 * @param {object} params - Event parameters (optional)
 */
export function trackEvent(eventName, params = {}) {
  if (!analytics) {
    // Analytics not available - silently ignore
    return;
  }

  try {
    logEvent(analytics, eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Failed to track event "${eventName}":`, error.message);
  }
}

/**
 * Track page view
 * @param {string} pageName - Name of the page
 */
export function trackPageView(pageName) {
  trackEvent('page_view', {
    page_name: pageName,
  });
}

/**
 * Track website open (call on app initialization)
 */
export function trackWebsiteOpen() {
  trackEvent('website_open', {
    device_type: getDeviceType(),
  });
}

/**
 * Track when user starts the calculator
 * @param {string} path - "livestock" or "arable"
 */
export function trackCalculatorStarted(path) {
  trackEvent('calculator_started', {
    path,
  });
}

/**
 * Track when user selects a path
 * @param {string} path - "livestock" or "arable"
 */
export function trackPathSelected(path) {
  trackEvent('path_selected', {
    path,
  });
}

/**
 * Track when user completes input form
 * @param {string} path - "livestock" or "arable"
 * @param {object} formData - Form data object
 */
export function trackCalculatorInputCompleted(path, formData) {
  trackEvent('calculator_input_completed', {
    path,
    region: formData.region,
    area: String(formData.area),
    condition: formData.condition || '',
    animal: formData.animal || '',
    crop: formData.crop || '',
  });
}

/**
 * Track when calculation is completed
 * @param {string} path - "livestock" or "arable"
 * @param {object} calculationData - Data about the calculation
 */
export function trackCalculationCompleted(path, calculationData) {
  trackEvent('calculation_completed', {
    path,
    region: calculationData.region,
    area: String(calculationData.area),
    condition: calculationData.condition || '',
    animal: calculationData.animal || '',
    crop: calculationData.crop || '',
    result_suitability: String(calculationData.suitability || 0),
  });
}

/**
 * Track when results are viewed
 * @param {string} path - "livestock" or "arable"
 * @param {object} results - Results data
 */
export function trackResultsViewed(path, results) {
  trackEvent('results_viewed', {
    path,
    suitability: String(results.suitability || results.capacity || 0),
  });
}

/**
 * Track rotational grazing toggle
 * @param {boolean} enabled - Whether rotational grazing is enabled
 */
export function trackRotationalGrazingEnabled(enabled) {
  trackEvent('rotational_grazing_enabled', {
    enabled: String(enabled),
  });
}

/**
 * Track when user opens action plan
 * @param {string} path - "livestock" or "arable"
 */
export function trackActionPlanOpened(path) {
  trackEvent('action_plan_opened', {
    path,
  });
}

/**
 * Track when user clicks a CTA button in action plan
 * @param {string} actionType - The action type/CTA text
 */
export function trackActionPlanCtaClicked(actionType) {
  trackEvent('action_plan_cta_clicked', {
    action_type: actionType,
  });
}

/**
 * Track when user clicks back button
 * @param {string} fromStep - Current step
 * @param {string} toStep - Step navigating to
 */
export function trackBackClicked(fromStep, toStep) {
  trackEvent('back_clicked', {
    from_step: fromStep,
    to_step: toStep,
  });
}

/**
 * Track when user resets calculator
 */
export function trackCalculatorReset() {
  trackEvent('calculator_reset', {});
}

/**
 * Get device type for analytics
 * @returns {string} "desktop", "mobile", or "tablet"
 */
function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk|(android(?!.*mobi))/.test(ua)) {
    return 'tablet';
  }
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export default {
  trackEvent,
  trackPageView,
  trackWebsiteOpen,
  trackCalculatorStarted,
  trackPathSelected,
  trackCalculatorInputCompleted,
  trackCalculationCompleted,
  trackResultsViewed,
  trackRotationalGrazingEnabled,
  trackActionPlanOpened,
  trackActionPlanCtaClicked,
  trackBackClicked,
  trackCalculatorReset,
  getDeviceType,
};
