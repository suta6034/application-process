import {
    sanitizeUrl,
} from '../utils/filter';

export class Award {
    constructor({
        id = null,
        date = null,
        name,
        url = '',
    }) {
        this.id = id;
        this.date = date;
        this.name = name;
        this.url = sanitizeUrl(url);
    }
}

export function createAward(data = {}) {
    return new Award(data);
}
