const ACCEPTED_FILE_FORMATS_BASIC = [
    '.doc',
    '.docx',
    '.odt',
    '.pdf',
    '.rtf',
    'application/msword',
    'application/octet-stream',
    'application/pdf',
    'application/rtf',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/x-rtf',
    'text/richtext',
    'text/rtf',
];

export const ACCEPTED_IMAGE_FORMATS = [
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png',
];

export const ACCEPTED_FILE_FORMATS = [...ACCEPTED_FILE_FORMATS_BASIC, ...ACCEPTED_IMAGE_FORMATS];

export const MAX_ATTACHMENTS = 25;

export const MIN_FILE_SIZE_IN_BYTES = 10000;

export const MAX_FILE_SIZE_DOCUMENTS_IN_BYTES = 8000000;

export const MAX_FILE_SIZE_IMAGES_IN_BYTES = 10000000;
