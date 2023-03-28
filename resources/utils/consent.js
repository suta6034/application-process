import {
    getCookie,
} from './cookie';

export const CONSENT_GROUPS = {
    necessary: 'necessary',
    performance: 'performance',
    marketing: 'marketing',
};
const CONSENT_GROUPS_ONE_TRUST = {
    [CONSENT_GROUPS.necessary]: 'C0001',
    [CONSENT_GROUPS.performance]: 'C0002',
    [CONSENT_GROUPS.marketing]: 'C0004',
};
const CONSENT_COOKIE_NAME = 'OptanonConsent';

let commandStack = [];
function queueFunctionCall(functionCall) {
    return new Promise((resolve) => {
        if (window.OneTrust) {
            resolve(functionCall());
        } else {
            commandStack.push({
                method: functionCall,
                resolve,
            });
        }
    });
}
const onChangeCallbacks = new Set();
queueFunctionCall(() => window.OneTrust.OnConsentChanged(() => onChangeCallbacks.forEach(cb => cb())));
const consentDriver = {
    openSettings() {
        return queueFunctionCall(() => window.OneTrust.ToggleInfoDisplay());
    },
    revoke() {
        return queueFunctionCall(() => window.OneTrust.RejectAll());
    },
    onChange(callback) {
        onChangeCallbacks.add(callback);
        const removeCallback = () => onChangeCallbacks.delete(callback);

        return removeCallback;
    },
};

function runCommands() {
    commandStack.forEach(({ method, resolve }) => resolve(method()));
    commandStack = [];
}

let OneTrustOriginal;
Object.defineProperty(window, 'OneTrust', {
    get() {
        return OneTrustOriginal;
    },
    set(value) {
        OneTrustOriginal = value;
        if (value) runCommands();
    },
});

function getGroupsGranted() {
    const cookie = getCookie(CONSENT_COOKIE_NAME);
    const params = new URLSearchParams(cookie);
    const groupsRaw = params.get('groups');

    if (!groupsRaw) return [];

    return groupsRaw.split(',')
        .filter(groupRaw => groupRaw.includes(':1'))
        .map(groupRaw => groupRaw.replace(':1', ''));
}

export function hasConsent(group = null) {
    const groupsGranted = getGroupsGranted();
    if (group) return groupsGranted.includes(CONSENT_GROUPS_ONE_TRUST[group]);

    return groupsGranted.length > 0;
}

export function onConsentChange(callback) {
    consentDriver.onChange(callback);
}
