import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = apiEndpoint({
    api: BACKEND,
    endpoint: 'gdpr',
});

export const PROFILE_ACTIVATION_CONSENT = 'b2c_cv_activation';

export const SPECIFIC_INFOS = [
    {
        headline: 'Zweck der Datenverarbeitung',
        key: 'purpose',
    },
    {
        headline: 'Kategorieren personenbezogener Daten',
        key: 'dataCategory',
    },
    {
        headline: 'Speicherdauer / Löschfrist',
        key: 'storageDuration',
    },
    {
        headline: 'Empfängerkategorien',
        key: 'recipientCategory',
    },
    {
        headline: 'Rechtsgrundlage',
        key: 'legalBasis',
    },
];

export function check(type) {
    return endpoint.get('check', {
        params: {
            infoType: type,
        },
    });
}

export function info(type) {
    return endpoint.get('info', {
        params: {
            infoType: type,
        },
    });
}

export function approve(type) {
    return endpoint.post('approve', { infoType: type });
}
