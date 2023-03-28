import iconFromMimetype from './icon-from-mimetype';

export class AdaptedFile {
    constructor({
        deletable = true,
        mimetype,
        name,
        preview,
        progress = null,
        ribbon,
        url,
        uuid = null,
        size,
    }) {
        this.deletable = deletable;
        this.icon = iconFromMimetype(mimetype);
        this.name = name;
        this.preview = preview;
        this.progress = progress;
        this.ribbon = ribbon;
        this.url = url;
        this.uuid = uuid;
        this.size = size;
    }
}

export function createAdaptedFile(data = {}) {
    return new AdaptedFile(data);
}
