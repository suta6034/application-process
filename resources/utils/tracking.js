import {
    eraseCookie,
    getCookie,
} from './cookie';
import * as logger from './logger';
import {
    makeQueue,
} from './queue';

export const COOKIE_SERVER_SIDE_EVENTS = 'ga-events';

export const EVENTS = {
    pageView: 'pageview',
    profileCreated: 'profile-created',
    profileStatus: 'profile-status',
    jobSaveSuccess: 'job_save_success',
    profileCreateSuccess: 'profile_create_success',
    statusChange: 'status_change',
    userData: 'userdata',
    trackVisibility: 'show_element',
};

export const CATEGORIES = {
    conversion: 'conversion',
    page: {
        applications: 'page: applications',
        dashboard: 'page: dashboard',
        motivationLetter: 'page: application-letter',
        personalData: 'page: personal-data',
        profile: 'page: profile',
        profileCreate: 'page: profile-create',
        profileCreateTemplate: 'page: profile-create-template',
        profileCreateOnePage: 'page: /profil/anlegen/onepage-work',
        profileView: 'page: profile-view',
        messages: 'page: messages',
    },
};

export const ACTIONS = {
    clickWithName: click => `click: ${click}`,
    cvCreate: 'cv-create',
    showWithName: show => `show: ${show}`,
    uploadWithName: upload => `upload: ${upload}`,
    watchlist: 'watchlist',
};

export const LABELS = {
    application: 'application',
    click: 'click',
    event: {
        skip: 'event: skip',
        save: 'event: save',
    },
    eventWithName: x => `event: ${x}`,
    evaluate: 'evaluate',
    karl: 'karL',
};

/**
 * Event
 * @typedef {object} Event
 * @property {string} [category]
 * @property {string} [event]
 * @property {string} [action]
 * @property {string} [label]
 * @property {string} [element]
 * @property {string} [elementDetail]
 */

/**
 * Tracker
 * @typedef {object} Tracker
 * @property {function} enable
 * @property {function} event
 * @property {function} [trackUser]
 * @property {function} [trackPageView]
 * @property {function} [trackVisibility]
 * @property {function} [trackSubContentGroup]
 */

/** @type {Tracker[]} */
const trackers = [];

/**
 * Register tracker.
 *
 * @param {Tracker} tracker
 */
export function registerTracker(tracker) {
    trackers.push(tracker);
}

const eventQueue = makeQueue();

/**
 * Enable trackers.
 *
 * @param {array} dependencies
 */
export function enableTrackers(dependencies) {
    eventQueue.add(() => {
        trackers.forEach((tracker, index) => tracker.enable && tracker.enable(dependencies[index]));
    });
}

/**
 * Send user data for every tracker.
 */
export function trackUser() {
    eventQueue.add(() => Promise.all(trackers.map(tracker => tracker.trackUser?.())));
}

/**
 * Send pageview event for every tracker.
 */
export function trackPageView(pageUrl) {
    eventQueue.add(() => {
        trackers.forEach(tracker => tracker.trackPageView && tracker.trackPageView?.(pageUrl));
    });
}

/**
 * Send show_element event for every tracker.
 */
export function trackVisibility({ element, elementDetail }) {
    eventQueue.add(() => {
        trackers.forEach(tracker => tracker.trackVisibility?.({ element, elementDetail }));
    });
}

// The information if the user has a watchlist or not is part of the user
// tracking. With this hook we make sure that the new watchlist status is
// updated in the trackers whenever the user makes a change to their watchlist.
function updateWatchlistHook(event) {
    if (event.action === ACTIONS.watchlist) trackUser();
}

const eventHooks = [updateWatchlistHook];

/**
 * Track events.
 *
 * @param {Event} event
 */
export function track(event) {
    /* istanbul ignore next */
    if (Object.values(event).includes(undefined)) {
        const errMsg = 'A value of the tracking event was undefined.';
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(errMsg);
        } else {
            logger.warning({ message: errMsg });
        }
    }
    eventQueue.add(() => {
        trackers.forEach(tracker => tracker.event(event));
        eventHooks.forEach(hook => hook(event));
    });
}

/**
 * Send sub content group for every tracker.
 */
export function trackSubContentGroup(group) {
    eventQueue.add(() => {
        trackers.forEach(tracker => tracker.trackSubContentGroup && tracker.trackSubContentGroup?.(group));
    });
}

/**
 * Track events queued by the server.
 *
 * @returns {void}
 */
export function trackServerSideEvents() {
    const cookie = getCookie(COOKIE_SERVER_SIDE_EVENTS);
    if (!cookie) return;

    const eventDelimiter = ';';
    cookie
        .split(eventDelimiter)
        .map(rawEvent => JSON.parse(rawEvent))
        .forEach(event => track(event));

    eraseCookie(COOKIE_SERVER_SIDE_EVENTS);
}
