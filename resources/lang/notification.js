import {
    extend,
} from '../utils/i18n';

export const strings = {
    notification: {
        saved: 'Deine Daten wurden aktualisiert',
        noResult: `
            Sorry – für deine Eingabe können wir kein Ergebnis finden.
            Tipp: Vielleicht klappt's mit einem anderen Begriff.
        `,
        noResultBlacklist: 'Tut uns leid, diese Firma haben wir noch nicht in unserer Datenbank.',
    },
};

extend(strings);
