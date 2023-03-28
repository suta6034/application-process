/* istanbul ignore file */
import {
    getTrackingStats,
} from '../services/tracking';
import {
    EVENTS,
} from './tracking';
import * as authService from '../services/auth';
import * as logger from './logger';

/**
 * Create a Google Tag Manager tracker.
 *
 * @returns {import('./tracking.js').Tracker}
 */
export function makeTrackerGtm() {
    window.dataLayer = window.dataLayer || [];

    return {
        enable(gtm) {
            // Loading of GTM could be blocked (e.g., by an ad blocker).
            if (!gtm) return;

            gtm.enable(true);
        },
        event({
            event = 'event',
            category,
            action,
            label,
            nonInteraction = true,
            ga4Event,
        }) {
            if (ga4Event) return; // Abort if it's a GA4 event

            window.dataLayer.push({
                event,
                eventCategory: category,
                eventAction: action,
                eventLabel: label,
                eventNonInteraction: { nonInteraction },
            });
        },
        async trackUser() {
            try {
                const userUuid = await authService.getUuid();
                const userType = userUuid ? 'user' : 'guest';
                const tracking = userUuid ? await getTrackingStats() : null;

                window.dataLayer.push({
                    ...tracking,
                    event: EVENTS.userData,
                    userType,
                    userId: userUuid,
                });
            } catch (exception) {
                /* istanbul ignore next */
                logger.warning({
                    exception,
                    message: 'Failed to track user data.',
                });
            }
        },
        trackPageView(pageUrl) {
            window.dataLayer.push({
                event: EVENTS.pageView,
                pageTitle: document.title,
                pageUrl,
            });
        },
        trackSubContentGroup(group) {
            window.dataLayer.push({
                content_group_detail: group,
            });
        },
    };
}
