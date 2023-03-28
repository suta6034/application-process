import {
    helpers,
} from '@vuelidate/validators';
import {
    unref,
} from 'vue';
import {
    parseDate,
} from './filter';

export const MAX_BIRTHDATE = new Date(new Date().setFullYear(new Date().getFullYear() - 14));
export const MIN_BIRTHDATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
export const MAX_LENGTH_STREET = 50;

export function dateRange(start, end) {
    return helpers.withParams({ type: 'dateRange', start, end }, (value) => {
        if (value === undefined || value === null) return true;

        return unref(start) <= unref(end);
    });
}

export function fileSize(maxSize) {
    return helpers.withParams({ type: 'fileSize', maxSize }, (value) => {
        if (value === undefined || value === null) return true;

        return value.size <= maxSize;
    });
}

export function fileType(acceptedFormats) {
    return helpers.withParams({ type: 'fileType', acceptedFormats }, (value) => {
        // IE 11 does not support all file types, sometimes the `type` is empty so we can't validate it.
        if (value === undefined || value === null || value.type === undefined) return true;

        return acceptedFormats.includes(value.type);
    });
}

export function maxDate(max) {
    return helpers.withParams({ type: 'maxDate', max }, (value) => {
        if (value === undefined || value === null) return true;

        return new Date(value).valueOf() <= max.valueOf();
    });
}

export function minDate(min) {
    return helpers.withParams({ type: 'minDate', min }, (value) => {
        if (value === undefined || value === null) return true;

        return new Date(value).valueOf() >= min.valueOf();
    });
}

export function isoDate(hasYear = true, hasMonth = true, hasDay = true) {
    return helpers.withParams({ type: 'date' }, (value) => {
        if (value === undefined || value === null || value === '') return true;

        const dateObject = parseDate(value);
        const year = dateObject.year.match(/^\d{4}$/) ? parseInt(dateObject.year, 10) : null;
        const month = dateObject.month.match(/^\d{2}$/) ? parseInt(dateObject.month, 10) : null;
        const day = dateObject.day.match(/^\d{2}$/) ? parseInt(dateObject.day, 10) : null;

        if (hasYear && year === null) return false;
        if (hasMonth && (month <= 0 || month > 12)) return false;
        if (hasDay && (day <= 0 || day > 31)) return false;

        return true;
    });
}

export const url = helpers.withParams({ type: 'url' }, (value) => {
    if (!value) return true;
    const lowercaseUrl = value.toLowerCase();
    return lowercaseUrl.startsWith('https://') || lowercaseUrl.startsWith('http://');
});

export function validateIf(condition, validator) {
    return helpers.withParams({ type: 'validateIf ', condition }, (value) => {
        const conditionEvaluation = typeof unref(condition) === 'function' ? unref(condition()) : unref(condition);
        if (!conditionEvaluation) return true;
        return validator.$validator?.(value) ?? validator(value);
    });
}

export function validateEmoji(value) {
    // eslint-disable-next-line max-len
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u20AB]|[\u20AD-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
    return !emojiRegex.test(value);
}

export function isEmpty(o) {
    return typeof o === 'undefined' || o === null || o === '' || o.length === 0
        || (Object.keys(o).length === 0 && o.constructor === Object);
}

export function skillMaxLength(value) {
    return value.label === undefined || value.label.length <= 70;
}
