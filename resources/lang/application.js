import {
    extend,
} from '../utils/i18n';

export const strings = {
    application: {
        status: {
            applied: 'Beworben',
            rejected: 'Absage',
            invited: 'Eingeladen',
            confirmed: 'Zusage',
            archived: 'Archiviert',
        },
        created: 'Bewerbung wurde angelegt.',
        deleted: 'Bewerbung wurde gelöscht.',
        statusUpdated: 'Status wurde aktualisiert.',
        updated: 'Bewerbung wurde aktualisiert.',
        archived: 'Bewerbung wurde archiviert.',
    },
};

extend(strings);
