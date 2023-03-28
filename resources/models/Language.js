export const DEFAULT_LEVEL_ID = 10;
export const LEVELS = [
    {
        id: 10,
        label: 'Grundkenntnisse',
    },
    {
        id: 20,
        label: 'Gut',
    },
    {
        id: 30,
        label: 'Fließend',
    },
    {
        id: 40,
        label: 'Muttersprache',
    },
];

export function languageLevelById(id) {
    return { ...LEVELS.find(level => level.id === id) };
}

export class Language {
    constructor({ id, label, languageId, level = languageLevelById(DEFAULT_LEVEL_ID) }) {
        this.id = id;
        this.title = label;
        this.languageId = languageId;
        this.skillLevelLabel = level.label;
        this.skillLevel = level.id;
    }
}

export function createLanguage(data = {}) {
    return new Language(data);
}
