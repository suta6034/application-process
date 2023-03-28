/**
 * =================================================================
 * Date Filter
 * =================================================================
 */

export function parseDate(date) {
    if (!date) return {};

    const [dateData, timeData] = date.split('T');
    const [year, month, day] = dateData.split('-');

    return {
        year,
        month,
        day,
        time: timeData ? timeData.substring(0, 8) : null,
        timeZone: timeData ? timeData.substring(8, 13) : null,
    };
}

export function formatDate({ format, date }) {
    const monthNames = {
        '01': 'Jänner',
        '02': 'Februar',
        '03': 'März',
        '04': 'April',
        '05': 'Mai',
        '06': 'Juni',
        '07': 'Juli',
        '08': 'August',
        '09': 'September',
        10: 'Oktober',
        11: 'November',
        12: 'Dezember',
    };
    const {
        day,
        month,
        time = ':',
        year,
    } = parseDate(date);
    const [hours, minutes] = time.split(':');
    const placeholders = {
        i: minutes,
        h: hours,
        F: monthNames[month] || monthNames['01'],
        M: (monthNames[month] || monthNames['01']).substring(0, 3),
        Y: year,
        d: day,
        m: month,
    };

    return format.split('').map(token => placeholders[token] || token).join('');
}

export function yearsSince(date) {
    if (!date) return null;

    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }

    return age;
}

/**
 * =================================================================
 * Url Filter
 * =================================================================
 */

/**
 * Sanitizes a URL by turning it into an URL object and casting it back to a string.
 *
 * @param {string} url
 * @returns {*}
 */
export function sanitizeUrl(url) {
    try {
        const urlObject = new URL(url);
        return urlObject.toString();
    } catch (error) {
        return url;
    }
}

export function formatUrl(url) {
    return url && sanitizeUrl(url).replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

/**
 * =================================================================
 * String Filter
 * =================================================================
 */

export function truncate(str, len) {
    return str.length > len ? `${str.substring(0, len)}...` : str;
}

/**
 * =================================================================
 * File Filter
 * =================================================================
 */

export function formatFileSize(size) {
    const sizeTypes = ['Bytes', 'KB', 'MB', 'GB'];
    if (size === 0) return '0 Byte';

    const i = Math.floor(Math.log(size) / Math.log(1024));
    const computedSize = Math.round((size / (1024 ** i)) * 100) / 100;

    return `${computedSize} ${sizeTypes[i]}`;
}
