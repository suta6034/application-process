export class Work {
    constructor({
        id = null,
        start = null,
        end = null,
        title,
        company = {},
        description,
        jobfield = {},
        employmentType = {},
        category = {},
    }) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.title = title?.label || title;
        this.company = company.label;
        this.companyId = company.id;
        this.description = description;
        this.jobfield = jobfield.id;
        this.jobfieldLabel = jobfield.label;
        this.employmentType = employmentType.id;
        this.employmentTypeLabel = employmentType.label;
        this.profileExperienceCategoryId = category.id;
        this.profileExperienceCategoryLabel = category.label;
    }
}

export function createWork(data = {}) {
    return new Work(data);
}
