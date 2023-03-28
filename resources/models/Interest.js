export class Interest {
    constructor({ id, label }) {
        this.id = id;
        this.name = label;
    }
}

export function createInterest(data = {}) {
    return new Interest(data);
}
