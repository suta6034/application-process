import Router from 'vue-router';
import Vue from 'vue';

import {
    redirect,
} from '../utils/navigation';
import config from '../config';
import auth from './middleware/auth';
import guest from './middleware/guest';
import profileExists from './middleware/profile-exists';
import fetchProfile from './middleware/fetch-profile';
import {
    CATEGORIES,
    trackPageView,
    trackUser,
    trackSubContentGroup,
} from '../utils/tracking';
import * as authService from '../services/auth';
import routerNextFactory from '../utils/router-next-factory';
import store from '../store';
import {
    log,
} from '../utils/action-logger';
import {
    done as progressDone,
    start as progressStart,
} from '../components/atoms/progress/ProgressLoadingBar';

Vue.use(Router);

/* eslint-disable max-len */
const PageApplications = () => import('../components/pages/PageApplications');
const PageApplicationDetail = () => import('../components/pages/PageApplicationDetail');
const PageApplicationForm = () => import('../components/pages/PageApplicationForm');
const PageProfileCreateTemplate = () => import('../components/pages/PageProfileCreateTemplate');
const FormProfileCreateOnePage = () => import('../components/organisms/form/profile-create/FormProfileCreateOnePage');
const PageProfileCreateOnePageWork = () => import('../components/pages/PageProfileCreateOnePageWork');
const PageProfileSave = () => import('../components/pages/PageProfileSave');
const PageConversations = () => import('../components/pages/PageConversations');
const PageConversationDetail = () => import('../components/pages/PageConversationDetail');
const PageCv = () => import('../components/pages/PageCv');
const PageCvDesiredJobForm = () => import('../components/pages/PageCvDesiredJobForm');
const PageCvEditOverview = () => import('../components/pages/PageCvEditOverview');
const PageCvSkillForm = () => import('../components/pages/PageCvSkillForm');
const PageCvFileEdit = () => import('../components/pages/PageCvFileEdit');
const PageCvFilePreview = () => import('../components/pages/PageCvFilePreview');
const PageCvPdfPreview = () => import('../components/pages/PageCvPdfPreview');
const PageDashboard = () => import('../components/pages/PageDashboard');
const PageError = () => import('../components/pages/PageError');
const PageMotivationLetters = () => import('../components/pages/PageMotivationLetters');
const PageMotivationLetterDetail = () => import('../components/pages/PageMotivationLetterDetail');
const PageMotivationLetterForm = () => import('../components/pages/PageMotivationLetterForm');
const PageNotFound = () => import('../components/pages/PageNotFound');
const PageProfileViews = () => import('../components/pages/PageProfileViews');
const PageVisibilityForm = () => import('../components/pages/PageVisibilityForm');
const SliderCvTemplates = () => import('../components/organisms/slider/SliderCvTemplates');
/* eslint-enable */

const routes = [
    {
        path: '/profil/anlegen',
        name: 'page-profile-create-onepage',
        component: PageProfileCreateOnePageWork,
        meta: {
            middleware: [guest],
        },
    },
    {
        path: '/profil/anlegen/vorlage',
        component: PageProfileCreateTemplate,
        meta: {
            middleware: [guest],
        },
        children: [
            {
                path: '',
                name: 'slider-cv-templates',
                meta: {
                    middleware: [guest],
                },
                component: SliderCvTemplates,
                props: route => ({
                    querySettings: {
                        template: route.query.template || null,
                        color: route.query.color || null,
                        font: route.query.font || null,
                    },
                    profileCreate: true,
                }),
            },
            {
                path: 'daten',
                name: 'form-profile-create-onepage',
                meta: {
                    middleware: [guest],
                },
                component: FormProfileCreateOnePage,
            },
        ],
    },
    {
        path: '/profil/anlegen/speichern',
        name: 'page-profile-save',
        component: PageProfileSave,
        meta: {
            middleware: [guest],
        },
    },
    {
        path: '/profil/lebenslauf',
        name: 'page-cv',
        component: PageCv,
        meta: {
            middleware: [auth, profileExists],
            trackingCategory: CATEGORIES.page.profile,
            subContentGroup: 'List View',
        },
    },
    {
        path: '/dashboard',
        name: 'page-dashboard',
        component: PageDashboard,
        meta: {
            middleware: [auth],
            trackingCategory: CATEGORIES.page.dashboard,
        },
    },
    {
        path: '/datenschutzerklaerung',
        name: 'page-privacy-policy',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/matching',
        name: 'page-job-matching',
        meta: {
            middleware: [auth, profileExists],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/profil',
        beforeEnter: () => {
            redirect('/lebenslauf');
        },
    },
    {
        path: '/fehler',
        component: PageError,
    },
    {
        path: '*',
        component: PageNotFound,
    },
    {
        path: '/profil/login/oauth',
        name: 'login',
        beforeEnter: (to) => {
            // Either set state to a given redirect URL or go to the dashboard
            // page by default.
            const redirectUrl = to.query.redirectUrl
                || (to.query.type === 'cv-created' && '/profil/lebenslauf?first-activation=karl')
                || '/dashboard';
            authService.login(redirectUrl);
        },
    },
    {
        path: config.oauth.loginRedirectUri,
        name: 'login-callback',
        beforeEnter: async () => {
            try {
                const { state } = await authService.handleLoginRedirect();
                redirect(state || '/dashboard');
            } catch (error) {
                redirect('/');
            }
        },
    },
    {
        path: config.oauth.postLogoutRedirectUri,
        name: 'logout-callback',
        beforeEnter: async () => {
            try {
                const { state } = await authService.handleLogoutRedirect();
                redirect(state || '/');
            } catch (error) {
                redirect('/');
            }
        },
    },
    {
        path: '/profil/registrieren',
        name: 'register',
        beforeEnter: (to) => {
            authService.register(to.query);
        },
    },
    {
        path: '/lp/events',
        name: 'lp-events',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/gehaltsstudie',
        name: 'gehaltsstudie',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/lp/faqs',
        name: 'lp-faqs',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/profil/aufrufe',
        name: 'page-views',
        component: PageProfileViews,
        meta: {
            middleware: [auth, profileExists],
        },
    },
    {
        path: '/profil/nachrichten',
        name: 'page-conversations',
        component: PageConversations,
        meta: {
            middleware: [auth, profileExists],
            subContentGroup: 'Listing',
        },
        props: route => ({ id: route.params.id }),
    },
    {
        path: '/profil/nachrichten/:id',
        name: 'page-conversation-detail',
        component: PageConversationDetail,
        meta: {
            middleware: [auth, profileExists],
            subContentGroup: 'Detail',
        },
        props: route => ({ id: route.params.id }),
    },
    {
        path: '/profil/bewerbungen',
        name: 'page-applications',
        component: PageApplications,
        meta: {
            middleware: [auth, fetchProfile],
            trackingCategory: CATEGORIES.page.applications,
            subContentGroup: 'Listing',
        },
        props: route => ({
            id: route.params.id,
            subNavId: route.params.subNavId,
        }),
    },
    {
        path: '/profil/bewerbungen/anlegen',
        name: 'page-application-create',
        component: PageApplicationForm,
        meta: {
            middleware: [auth],
            subContentGroup: 'Detail',
        },
    },
    {
        path: '/profil/bewerbungen/:id/bearbeiten',
        props: true,
        name: 'page-application-edit',
        component: PageApplicationForm,
        meta: {
            middleware: [auth],
            trackingCategory: CATEGORIES.page.applications,
            subContentGroup: 'Detail',
        },
    },
    {
        path: '/profil/bewerbungen/:id/:subNavId?',
        name: 'page-application-detail',
        component: PageApplicationDetail,
        meta: {
            middleware: [auth, fetchProfile],
            trackingCategory: CATEGORIES.page.applications,
            subContentGroup: 'Detail',
        },
        props: route => ({
            id: route.params.id,
            subNavId: route.params.subNavId,
        }),
    },
    // Bewerbungsschreiben are disabled, until the feature is revamped
    {
        path: '/profil/bewerbungsschreiben',
        name: 'page-motivation-letters',
        component: PageMotivationLetters,
        meta: {
            middleware: [auth, profileExists],
        },
        redirect: '/dashboard',
    },
    {
        path: '/profil/bewerbungsschreiben/anlegen',
        name: 'page-motivation-letter-create',
        component: PageMotivationLetterForm,
        meta: {
            middleware: [auth],
        },
        redirect: '/dashboard',
    },
    {
        path: '/profil/bewerbungsschreiben/:id',
        props: true,
        name: 'page-motivation-letter-detail',
        component: PageMotivationLetterDetail,
        meta: {
            middleware: [auth, fetchProfile],
        },
        redirect: '/dashboard',
    },
    {
        path: '/profil/bewerbungsschreiben/:id/bearbeiten',
        props: true,
        name: 'page-motivation-letter-edit',
        component: PageMotivationLetterForm,
        meta: {
            middleware: [auth],
        },
        redirect: '/dashboard',
    },
    {
        path: '/profile/onlinetests',
        name: 'page-onlinetests',
        component: PageDashboard,
        meta: {
            middleware: [auth],
        },
    },
    {
        path: '/profile/share-profile',
        name: 'share',
        meta: {
            middleware: [auth, profileExists],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/user/cv-file',
        name: 'pdf',
        meta: {
            middleware: [auth, profileExists],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/lebenslauf',
        name: 'cv-landing-page',
        meta: {
            // If an error occurs while fetching the profile, an error-popup is shown
            // This setting will persist the popup when the route changes.
            popup: 'persistOnRouteChange',
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/c/k/jobsuche/bewerbung',
        name: 'page-tips-application',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/companyalarm',
        name: 'page-companyalarm',
        meta: {
            middleware: [auth],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/companyalarm/*',
        name: 'page-company-alarm-detail',
        meta: {
            middleware: [auth],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/firmen',
        name: 'page-company',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/f/*',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/b/*',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/jobalarm',
        name: 'page-job-alarm',
        meta: {
            middleware: [auth],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/jobalarm/:id',
        name: 'page-job-alarm-detail',
        meta: {
            middleware: [auth],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/jobs',
        name: 'page-jobs',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/jobs/:id',
        name: 'page-job-detail',
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/watchlist',
        name: 'page-watchlist',
        meta: {
            middleware: [auth],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/settings',
        name: 'page-settings',
        meta: {
            middleware: [auth],
        },
        beforeEnter: (to) => {
            redirect(to.fullPath);
        },
    },
    {
        path: '/profil/lebenslauf/wunschjob',
        name: 'page-cv-desired-job-form',
        component: PageCvDesiredJobForm,
        props: route => ({ target: route.params.target, matching: route.query.matching }),
        meta: {
            middleware: [auth, profileExists],
        },
        beforeEnter: (to, from, next) => {
            // Only show this if "matching" param is given in the URL
            // Currently only done in k4 on /matching to open this page in a modal
            if (to.query.matching) {
                next();
            } else {
                redirect('/dashboard');
            }
        },
    },
    {
        path: '/profil/lebenslauf/kenntnisse',
        name: 'page-cv-skill-form',
        component: PageCvSkillForm,
        meta: {
            middleware: [auth, profileExists],
        },
        props: route => ({ matching: route.query.matching }),
        beforeEnter: (to, from, next) => {
            // Only show this if "matching" param is given in the URL
            // Currently only done in k4 on /matching to open this page in a modal
            if (to.query.matching) {
                next();
            } else {
                redirect('/dashboard');
            }
        },
    },
    {
        path: '/profil/sichtbarkeit',
        name: 'page-visibility-form',
        component: PageVisibilityForm,
        props: { standalone: true },
        meta: {
            middleware: [auth, profileExists],
        },
    },
    {
        path: '/profil/lebenslauf/design-aendern',
        name: 'page-cv-file-edit',
        component: PageCvFileEdit,
        props: route => ({ reset: route.params.reset }),
        meta: {
            middleware: [auth, profileExists],
            subContentGroup: 'Change Template',
        },
    },
    {
        path: '/profil/lebenslauf/design-vorschau/',
        name: 'page-cv-file-preview',
        component: PageCvFilePreview,
        meta: {
            middleware: [auth, profileExists],
        },
    },
    {
        path: '/profil/lebenslauf/bearbeitungs-uebersicht',
        name: 'page-cv-edit-overview',
        component: PageCvEditOverview,
        meta: {
            middleware: [auth, profileExists],
        },
    },
    {
        path: '/profil/lebenslauf/pdf-vorschau',
        name: 'page-cv-pdf-preview',
        component: PageCvPdfPreview,
        meta: {
            middleware: [auth, profileExists],
            subContentGroup: 'Preview',
        },
    },
];

const router = new Router({
    routes,
    mode: 'history',
    linkExactActiveClass: 'is-active',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        return { x: 0, y: 0 };
    },
});

// Prevent debug page to be available on production and staging (same build).
if (process.env.NODE_ENV === 'development') {
    router.addRoutes([
        {
            path: '/profil/debug',
            name: 'debug',
            component: () => import('../components/pages/PageDebug'),
        },
    ]);
}

router.beforeEach((to, from, next) => {
    if (to.name !== from.name) progressStart();
    log(to.name).catch((error) => {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    });

    // eslint-disable-next-line no-param-reassign
    to.meta.referrer = from;

    let middleware = [];
    if (to.meta.middleware) {
        middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];
    }

    const context = {
        from,
        next,
        router,
        store,
        to,
    };
    const index = 1;
    const nextMiddleware = routerNextFactory(context, middleware, index);

    if (middleware.length > 0) return middleware[0]({ ...context, next: nextMiddleware });
    return next();
});

router.afterEach((to, from) => {
    if (to.name !== from.name) progressDone();
    trackUser();

    trackSubContentGroup(to.meta?.subContentGroup ?? null);

    const isNotInitialPageview = from.name !== null;
    // Don't track initial pageview because it is tracked automatically.
    if (isNotInitialPageview) {
        trackPageView(to.fullPath);
    }
});

export default router;
