/* istanbul ignore file */
import {
    UserManager,
    WebStorageStateStore,
} from 'oidc-client';

import {
    convertQueryParamsToQueryString,
    redirect,
} from '../utils/navigation';

import {
    getCookie,
} from '../utils/cookie';

import config from '../config';

const userManager = new UserManager({
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    authority: config.oauth.authority,
    client_id: config.oauth.clientId,
    redirect_uri: window.location.origin + config.oauth.loginRedirectUri,
    silent_redirect_uri: window.location.origin + config.oauth.loginRedirectUri,
    post_logout_redirect_uri: window.location.origin + config.oauth.postLogoutRedirectUri,
    response_type: 'code',
    scope: 'openid offline',
    automaticSilentRenew: true,
});

/**
 * @param {Record<string, any>} [queryParameters]
 */
export function register(queryParameters) {
    const queryString = convertQueryParamsToQueryString({
        clientId: config.oauth.clientId,
        ...queryParameters,
    });
    redirect(`${config.oauth.identityProviderUrl}/register?${queryString}`);
}

/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export function login(state = null) {
    return userManager.signinRedirect({ state });
}

/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export function logout(state = null) {
    userManager.signoutRedirect({ state });
}

/**
 * Sync `auth` status with K3/K4, so they'll know we're already logged in.
 */
function syncAuth() {
    const MAX_WAIT = config.oauth.loginSyncMaxWait;

    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.src = `${config.oauth.loginSyncUri}?isModal=1`;
        iframe.hidden = true;
        iframe.style.display = 'none';
        iframe.sandbox = 'allow-same-origin allow-scripts';

        // Syncing the auth status is not mission critical. This makes sure that
        // we can proceed even if something goes wrong in the iframe.
        setTimeout(() => resolve(), MAX_WAIT);

        // If the login flow completed, remove the iframe again
        window.addEventListener('message', (event) => {
            if (event.data === 'userLoginOauthCallback') {
                resolve();
                if (document.body.contains(iframe)) document.body.removeChild(iframe);
            }
        });

        document.body.appendChild(iframe);
    });
}

/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export async function handleLoginRedirect() {
    const user = await userManager.signinRedirectCallback();
    await syncAuth();

    return user;
}

/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export function handleLogoutRedirect() {
    return userManager.signoutRedirectCallback();
}

/**
 * Check if User isLoggedIn Remote
 *
 * @returns Boolean
 */
export function isUserLoggedInRemote() {
    return Boolean(getCookie('oauth2_authenticated'));
}

/**
 * Load auth user.
 *
 * @returns {Promise<User>}
 */
/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export async function getUser() {
    const user = await userManager.getUser();
    if (user?.expired) return null;

    return user;
}

/**
 * Check whether or not a user is currently logged in.
 *
 * @returns {Promise<boolean>}
 */
/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export async function isUserLoggedIn() {
    const user = await getUser();
    return Boolean(user);
}

/**
 * Get the profile data for the currently authenticated user.
 *
 * @returns {Promise<object|null>}
 */
/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export async function getProfile() {
    const user = await getUser();
    return user ? user.profile : null;
}

/**
 * Get the UUID of the currently authenticated user.
 *
 * @returns {Promise<string|null>}
 */
/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export async function getUuid() {
    const profile = await getProfile();
    return profile ? profile.sub : null;
}

/**
 * Get the access token.
 *
 * @returns {Promise<string|null>}
 */
/* istanbul ignore next: Mostly a wrapper around the external `oidc-client` library. */
export async function getAccessToken() {
    const user = await getUser();
    return user ? user.access_token : null;
}
