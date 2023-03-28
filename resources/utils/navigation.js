/**
 * Location redirect.
 *
 * Useful for non-Vue links, like redirects to K4.
 *
 * @param {string} href
 */
export function redirect(href) {
    // Prevent redirect loop in development environment.
    if (href !== (window.location.pathname + window.location.search)) {
        window.location.assign(href);
    }
}

/**
 * Convert an object of query parameters to a valid query string.
 *
 * @param {Record<string, any>} queryParameters
 */
export function convertQueryParamsToQueryString(queryParameters) {
    return Object.entries(queryParameters)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}
