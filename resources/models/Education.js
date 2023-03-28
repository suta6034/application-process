export class Education {
    constructor({
        id = null,
        start = null,
        end = null,
        name,
        location,
        description,
        focus,
        title,
        completed = true,
        type = {},
        customType = '',
        trainingCompany,
    }) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.name = name;
        this.location = location;
        this.description = description;
        this.focus = focus;
        this.title = title;
        this.completed = completed;
        this.type = type.id;
        this.typeLabel = type.label;
        this.customType = customType;
        this.trainingCompany = trainingCompany;
    }
}

export function createEducation(data = {}) {
    return new Education(data);
}
