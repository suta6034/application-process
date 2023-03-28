export const DEFAULT_LEVEL_ID = 10;
export const LEVELS = [
    {
        id: 10,
        label: 'Basiswissen',
    },
    {
        id: 20,
        label: 'Fortgeschritten',
    },
    {
        id: 30,
        label: 'Ausgezeichnet',
    },
];

export function skillLevelById(id) {
    return { ...LEVELS.find(level => level.id === id) };
}

export class Skill {
    constructor({ id, label, level = skillLevelById(DEFAULT_LEVEL_ID) }) {
        this.id = id;
        this.name = label;
        this.level = level.id;
        this.levelLabel = level.label;
    }
}

export function createSkill(data = {}) {
    return new Skill(data);
}
