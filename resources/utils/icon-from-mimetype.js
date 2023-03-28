const DEFAULT_ICON = 'file-text';

export default function iconFromMimetype(mimetype) {
    const icons = {
        'application/pdf': 'file-pdf',
        'image/gif': 'file-image',
        'image/jpeg': 'file-image',
        'image/jpg': 'file-image',
        'image/pjpeg': 'file-image',
        'image/png': 'file-image',
    };

    return icons[mimetype] || DEFAULT_ICON;
}
