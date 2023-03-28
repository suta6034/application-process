import {
    strings,
} from '../lang';

export function extend(newStrings) {
    Object.assign(strings, newStrings);
}

export default function i18n(stringName, replacements) {
    const string = stringName.split('.').reduce((o, i) => o[i], strings);

    return typeof string === 'function' ? string(replacements) : string;
}
