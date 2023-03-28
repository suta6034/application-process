import {
    sanitizeUrl,
} from '../utils/filter';

export class Project {
    constructor({
        description,
        end = null,
        id = null,
        name,
        start = null,
        url = '',
    }) {
        this.description = description;
        this.end = end;
        this.id = id;
        this.name = name;
        this.start = start;
        this.url = sanitizeUrl(url);
    }
}

export function createProject(data = {}) {
    return new Project(data);
}
