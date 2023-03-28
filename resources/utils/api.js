import axios from 'axios';

import * as authService from '../services/auth';
import * as logger from './logger';
import config from '../config';
import {
    HEADER_CACHE,
} from './cache';
import {
    redirect,
} from './navigation';
import {
    getCsrfToken,
} from './csrf';

export const MOCK_TEST_API = 'mockTestApi';
export const BACKEND = 'backend';

// Explicitly set XHR header to mark all requests as XMLHttpRequest
function apiRequiresXhrHeader(api) {
    return [
        BACKEND,
    ].includes(api);
}

// Send an auth header if the user is logged in but don't throw an error if not.
function endpointOptionalAuthorization(endpoint) {
    return [
        'cv-file',
    ].includes(endpoint);
}

function endpointRequiresAuthorization(endpoint) {
    return [
        'application',
        'application/empty',
        'application/manual',
        'company-follow',
        'conversations',
        'entrant',
        'gdpr',
        'job-alarm',
        'job-matching',
        'job-watchlist',
        'messages',
        'notifications',
        'profile/activate',
        'profile/deactivate',
        'profile-views',
        'tracking-statistic',
        'user',
    ].includes(endpoint);
}

function shouldInterceptAuthError(endpoint) {
    // Those requests happen in the background and low value for the user. We
    // want to prevent the user being redirected because of one of those.
    const exceptions = [
        'notifications',
        'tracking-stats',
    ];

    return !exceptions.includes(endpoint);
}

export async function interceptorAuthHeaders(axiosConfig, endpoint) {
    if (endpointOptionalAuthorization(endpoint)) {
        const accessToken = await authService.getAccessToken();
        if (accessToken) {
            // eslint-disable-next-line no-param-reassign
            axiosConfig.headers = { ...axiosConfig.headers, authorization: `Bearer ${accessToken}` };
        }
    }

    if (endpointRequiresAuthorization(endpoint)) {
        const accessToken = await authService.getAccessToken();
        if (!accessToken) throw new Error('Missing Authentication Token');

        // eslint-disable-next-line no-param-reassign
        axiosConfig.headers = { ...axiosConfig.headers, authorization: `Bearer ${accessToken}` };
    }

    return axiosConfig;
}

let isRedirectingUnauthenticated = false;

const REDIRECT_LOOP_CIRCUIT_BREAKER = 'REDIRECT_LOOP_CIRCUIT_BREAKER';
const MAX_REDIRECTS = 3;
const MAX_PERIOD = 40000;

function isInRedirectLoop() {
    const redirectTrail = JSON.parse(sessionStorage.getItem(REDIRECT_LOOP_CIRCUIT_BREAKER)) || [];
    const newRedirectTrail = [
        ...redirectTrail,
        Date.now(),
    ].filter(timestamp => timestamp > Date.now() - MAX_PERIOD);
    sessionStorage.setItem(REDIRECT_LOOP_CIRCUIT_BREAKER, JSON.stringify(newRedirectTrail));

    return newRedirectTrail.length > MAX_REDIRECTS;
}

// Handle 401 Unauthorized network errors.
async function interceptorAuthError(error) {
    const isUnauthorized = error.response?.status === 401;
    const shouldInterceptError = isUnauthorized && !isRedirectingUnauthenticated;

    if (shouldInterceptError) {
        // Destroy first level header cache
        const cache = sessionStorage.getItem(HEADER_CACHE);
        if (cache) sessionStorage.removeItem(HEADER_CACHE);

        // Only send one redirect, in case multiple requests are made
        // simultaneously.
        isRedirectingUnauthenticated = true;

        if (isInRedirectLoop()) {
            const user = await authService.getUser();
            logger.warning({
                exception: error,
                message: 'Redirect loop detected!',
                extras: {
                    profile: user?.profile,
                },
                tags: {
                    user_info: logger.userInfoTags.PAGE,
                },
            });
            return redirect('/fehler');
        }

        return authService.login(window.location.pathname);
    }

    return Promise.reject(error);
}

export function apiEndpoint({
    api,
    endpoint,
    options = {},
}) {
    const axiosOptions = {
        baseURL: `${config.api[api].url}/${endpoint}`,
        timeout: 60000,
        headers: {
            'X-Origin': `${config.xOriginHeader}`,
            'X-CSRF-TOKEN': getCsrfToken(),
        },
        ...options,
    };

    if (apiRequiresXhrHeader(api)) {
        axiosOptions.headers = { ...axiosOptions.headers, 'X-Requested-With': 'XMLHttpRequest' };
    }

    const axiosInstance = axios.create(axiosOptions);
    axiosInstance.interceptors.request.use(axiosConfig => interceptorAuthHeaders(axiosConfig, endpoint));
    if (shouldInterceptAuthError(endpoint)) {
        axiosInstance.interceptors.response.use(response => response, interceptorAuthError);
    }

    return axiosInstance;
}

export function apiResource(type, body, id) {
    const data = {
        type,
        attributes: body,
    };
    if (id) {
        data.id = id;
    }
    return {
        data,
    };
}

export function apiErrorShouldBeReported(error) {
    return error.response ? error.response.status !== 404 : true;
}
