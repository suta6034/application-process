import * as Sentry from '@sentry/vue';
import {
    BrowserTracing,
} from '@sentry/tracing';
import * as svgicon from 'vue-svgicon';
import Vue, {
    h, provide,
} from 'vue';
import VueGtm from '@gtm-support/vue2-gtm';

import {
    makeTrackerGtm,
} from './utils/tracker-gtm';
import {
    makeGA4Tracker,
} from './utils/tracker-ga4';
import {
    registerTracker, trackVisibility,
} from './utils/tracking';
import {
    getUuid,
} from './services/auth';
import App from './components/App';
import config from './config';
import i18n from './utils/i18n';
import randomFieldId from './utils/random-field-id';
import router from './router';
import store from './store';

if (config.sentry) {
    Sentry.init({
        Vue,
        dsn: config.sentry.dsn,
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracingOrigins: [
                    'localhost',
                    'kcdn.at',
                    // This matches all requests relative to the current domain.
                    // E.g., `/backend/stuff`.
                    /^\//,
                    // Match all karriere.at origins except `gtm.karriere.at`.
                    // If you want to exclude other subdomains you can do it
                    // with a regular expression like this:
                    // `/^((?!gtm\.|other\.).)*karriere.at.*$/`
                    /^((?!gtm\.|login\.).)*karriere.at.*$/,
                ],
            }),
        ],
        tracesSampleRate: config.sentry.tracesSampleRate,
        trackComponents: true,
        hooks: ['activate', 'create', 'destroy', 'mount', 'update'],
        release: process.env.VUE_APP_RELEASE,
        environment: process.env.VUE_APP_ENV,
        allowUrls: [
            /.*\.karriere\.at/,
            /kcdn\.at/,
        ],
        ignoreErrors: [
            /Navigation cancelled from .*/,
            'NavigationDuplicated',
        ],
    });

    Sentry.setTag('version', process.env.VUE_APP_VERSION);
    Sentry.setTag('source', 'js');
    (async () => {
        const userUuid = await getUuid();
        if (userUuid) Sentry.setUser({ id: userUuid });
    })();
}

if (config.gtm) {
    Vue.use(VueGtm, {
        id: config.gtm.id,
        enabled: false,
        debug: config.gtm.debug,
        ignoredViews: ['page-cv-pdf-preview'],
        loadScript: true,
    });
    registerTracker(makeTrackerGtm());
    registerTracker(makeGA4Tracker());
}

Vue.use(svgicon, {
    tagName: 'AppSvgIcon',
    classPrefix: 'c-appIcon-',
});

Vue.config.productionTip = false;

Vue.prototype.$t = i18n;
Vue.prototype.$randomFieldId = randomFieldId;

Vue.directive('track-visibility', {
    // In case of Vue 3 upgrade, replace 'inserted' with 'mounted'
    inserted(el, { value = { element: null, elementDetail: null } }) {
        if (value.element) {
            trackVisibility(value);
        } else {
            trackVisibility({
                element: el.dataset.gtmElement ?? null,
                elementDetail: el.dataset.gtmElementDetail ?? null,
            });
        }
    },
});

// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    setup() {
        provide('router', router);
        provide('store', store);

        return () => h(App);
    },
    errorCaptured(error) {
        if (error.message.includes('Redirected when going from')) return false;
        return true;
    },
    store,
    router,
});
