import flushPromises from 'flush-promises';

import {
    getTrackingStats,
} from '../services/tracking';
import {
    getUuid,
} from '../services/auth';
import {
    setCookie,
} from './cookie';
import {
    makeTrackerGtm,
} from './tracker-gtm';
import {
    COOKIE_SERVER_SIDE_EVENTS,
    registerTracker,
    trackServerSideEvents,
    trackUser,
    trackPageView,
} from './tracking';

jest.mock('../services/tracking');
jest.mock('../services/auth');

window.dataLayer = [];
window.dataLayer.push = jest.fn();

registerTracker(makeTrackerGtm());

describe('trackServerSideEvents()', () => {
    test('If the server-side events cookie is set it should track the given events.', async () => {
        const rawEvents = [
            '{ "category": "fooA", "action": "barA", "label": "bazA" }',
            '{ "category": "fooB", "action": "barB", "label": "bazB" }',
        ];
        setCookie({
            expires: true,
            name: COOKIE_SERVER_SIDE_EVENTS,
            value: rawEvents.join(';'),
        });

        trackServerSideEvents();
        await flushPromises();

        expect(window.dataLayer.push).toBeCalledWith(
            {
                event: 'event',
                eventCategory: 'fooA',
                eventAction: 'barA',
                eventLabel: 'bazA',
                eventNonInteraction: { nonInteraction: true },
            },
        );
        expect(window.dataLayer.push).toBeCalledWith(
            {
                event: 'event',
                eventCategory: 'fooB',
                eventAction: 'barB',
                eventLabel: 'bazB',
                eventNonInteraction: { nonInteraction: true },
            },
        );
    });
});

describe('trackUser()', () => {
    test('It should push user data to the dataLayer.', async () => {
        const trackingStats = {
            userFeatureLebenslauf: 1,
            userFeatureJobalarm: 1,
            userFeatureMerkliste: 1,
            userFeatureFirmenalarm: 1,
        };
        getTrackingStats.mockReturnValue(trackingStats);
        getUuid.mockReturnValue('199d367f-d66a-57ec-ba26-7b4642a6e0fb');
        trackUser();
        await flushPromises();

        expect(window.dataLayer.push).toBeCalledWith({
            event: 'userdata',
            userType: 'user',
            userId: '199d367f-d66a-57ec-ba26-7b4642a6e0fb',
            ...trackingStats,
        });
    });
});

describe('trackPageView()', () => {
    test('It should send the pageview event to the dataLayer.', async () => {
        document.title = 'title';

        trackPageView('url');
        await flushPromises();

        expect(window.dataLayer.push).toBeCalledWith({
            event: 'pageview',
            pageTitle: 'title',
            pageUrl: 'url',
        });
    });
});
