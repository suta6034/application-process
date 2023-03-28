export class Training {
    constructor({
        id = null,
        date = null,
        title,
        institute = '',
    }) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.institute = institute;
    }
}

export function createTraining(data = {}) {
    return new Training(data);
}
