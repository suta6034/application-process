/**
 * Get a cookie by name.
 *
 * @param {string} name
 * @returns {?string}
 */
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

/**
 * Set a cookie.
 */
export function setCookie({ name, value = '', expires = null, path = '/' }) {
    const parts = [encodeURIComponent(value)];

    if (expires) {
        const date = new window.Date(window.Date.now() + (expires * 1000));
        parts.push(`expires=${date.toUTCString()}`);
    }

    document.cookie = `${name}=${parts.join(';')};path=${path}`;
}

/**
 * Erase a existing cookie
 */
export function eraseCookie(name) {
    if (getCookie(name)) document.cookie = `${name}=;expires=1990-01-01;path=/`;
}
