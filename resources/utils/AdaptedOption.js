export class AdaptedOption {
    constructor({ id, label, value }) {
        this.id = id || label;
        this.label = label;
        this.value = value;
    }
}

export function createAdaptedOption(data = {}) {
    return new AdaptedOption(data);
}
