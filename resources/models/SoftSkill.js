export class SoftSkill {
    constructor({ id, personalityTraitId }) {
        this.id = id;
        this.personalityTraitId = personalityTraitId;
    }
}

export function createSoftSkill(data = {}) {
    return new SoftSkill(data);
}
