/* istanbul ignore file */

/* eslint-disable camelcase */
import {
    EVENTS,
} from './tracking';

export function makeGA4Tracker() {
    window.dataLayer = window.dataLayer || [];

    return {
        enable(gtm) {
            // Loading of GTM could be blocked (e.g., by an ad blocker).
            if (!gtm) return;

            gtm.enable(true);
        },
        event({
            event = 'click_element',
            element = null,
            elementDetail = null,
            jobId = null,
            method = null,
            ga4Event = false,
        }) {
            if (!ga4Event) return; // Abort if it's not GA4 style tracking
            window.dataLayer.push({
                event,
                element,
                element_detail: elementDetail,
                job_id: jobId,
                method,
            });
        },
        trackVisibility({ element = null, elementDetail = null }) {
            if (process.env.NODE_ENV === 'development' && element === null) {
                // eslint-disable-next-line no-console
                console.warn('No element for GA4 visibility tracking defined');
            }
            window.dataLayer.push({
                event: EVENTS.trackVisibility,
                element,
                // eslint-disable-next-line camelcase
                element_detail: elementDetail,
            });
        },
    };
}
/* eslint-enable camelcase */
