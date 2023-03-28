export default {
    api: {
        action: {
            url: process.env.VUE_APP_API_URL_ACTION,
        },
        mockTestApi: {
            url: 'http://localhost:123',
        },
        backend: {
            url: process.env.VUE_APP_API_URL_BACKEND,
        },
    },
    oauth: {
        authority: process.env.VUE_APP_OAUTH_AUTHORITY,
        clientId: 'karriere-sso-karl',
        identityProviderUrl: process.env.VUE_APP_OAUTH_IDENTITY_PROVIDER_URL,
        loginRedirectUri: '/profil/login/oauth/callback',
        loginSyncUri: '/user/login/oauth',
        loginSyncMaxWait: parseInt(process.env.VUE_APP_OAUTH_LOGIN_SYNC_MAX_WAIT ?? '10000', 10),
        postLogoutRedirectUri: '/profil/logout/oauth/callback',
    },
    sentry: process.env.VUE_APP_SENTRY === 'true' ? {
        dsn: process.env.VUE_APP_SENTRY_DSN,
        tracesSampleRate: 0.01,
    } : false,
    gtm: process.env.VUE_APP_GTM === 'true' ? {
        id: 'GTM-5WGVNH5',
        debug: process.env.VUE_APP_GTM_DEBUG === 'true',
    } : false,
    xOriginHeader: process.env.VUE_APP_X_ORIGIN,
    store: {
        strict: process.env.VUE_APP_STORE_STRICT === 'true',
    },
};
