import {
    extend,
} from '../utils/i18n';

export const strings = {
    validation: {
        birthdate: 'Bitte gib einen gültigen Geburtstag an.',
        characters: 'Der eingegebene Text enthält ungültige Zeichen.',
        date: 'Gib ein gültiges Datum an.',
        dateMaxFuture: 'Das Datum darf nicht in der Zukunft liegen.',
        dateMin: ({ date }) => `Bitte gib ein Datum später als ${date} an.`,
        dateRange: 'Bitte gib einen gültigen Zeitraum an.',
        distinct: 'Diesen Begriff hast du bereits eingegeben.',
        distinctBlacklist: 'Diese Firma befindet sich bereits auf deiner Liste.',
        distinctWeb: 'Diese Webadresse hast du bereits hinzugefügt.',
        educationCategory: 'Bitte wähle eine Ausbildung aus.',
        educationType: 'Bitte wähle einen Schultyp aus.',
        email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
        fileUnique: ({ fileName }) => `Du hast ${fileName} bereits hochgeladen.`,
        fileSizeMax: ({ fileName }) => `Die Dateigröße von ${fileName} entspricht nicht den Anforderungen.`,
        fileSizeMinProfileImage: ({ size }) => `Das Foto darf nicht weniger als ${size} KB haben.`,
        fileSizeMaxProfileImage: ({ size }) => `Das Foto darf nicht mehr als ${size} MB haben.`,
        fileType: ({ fileName }) => `Der Dateityp von ${fileName} entspricht nicht den Anforderungen.`,
        fileTypeProfileImage: 'Dieser Dateityp ist nicht erlaubt.',
        fullname: 'Bitte gib deinen vollständigen Namen an.',
        fullnameMaxLength: 'Bitte gib deinen vollständigen Namen an, mit max. 50 Zeichen pro Feld.',
        invalidSelection: ({ fieldName }) => `Zu diesem ${fieldName} haben wir leider keinen Eintrag gefunden.`,
        title: 'Bitte gib eine Position an.',
        jobfield: 'Bitte wähle ein Berufsfeld aus.',
        location: 'Bitte gib deinen Wohnort an.',
        max: ({ fieldName, n }) => `Du hast das Maximum von ${n} ${fieldName} erreicht.`,
        maxLength: ({ n }) => `Du kannst nur ${n} Zeichen eingeben.`,
        // eslint-disable-next-line max-len
        min: ({ fieldName, n, quantifier = 'einen' }) => `Bitte gib mindestens ${n === 1 ? quantifier : n} ${fieldName} an.`,
        skillMaxLength: () => 'Bitte gib maximal 70 Zeichen ein.',
        numeric: 'Dieses Feld darf nur Zahlen enthalten.',
        phoneNumber: 'Bitte gib eine gültige Telefonnummer ein.',
        phoneCountryPrefix: 'Bitte gib eine gültige Ländervorwahl ein.',
        phoneNumberTooLong: 'Bitte gib eine gültige Telefonnummer ein, mit max. 25 Zeichen.',
        required: ({ fieldName = '' }) => `Bitte fülle das Feld ${fieldName} aus.`,
        requiredMaxLength: ({ fieldName, n }) => `Bitte fülle das Feld ${fieldName} mit max. ${n} Zeichen aus.`,
        url: 'Das ist keine gültige URL. Tipp: Kopiere die URL am besten direkt aus der Adressleiste deines Browsers.',
        year: 'Bitte gib ein gültiges Jahr an.',
    },
};

extend(strings);
