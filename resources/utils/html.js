/**
 * Replace line breaks with HTML <br> tag.
 * @param {string} text
 * @returns {(string | null)}
 */
export const convertLineBreaks = (text) => {
    if (text) return text.replace(/(?:\r\n|\r|\n)/g, '<br>');

    return null;
};

/**
 * Split message into chunks based on linebreaks.
 * @param {string} text
 * @returns {array}
 */
export const splitByLinebreaks = text => text
    .split(/\r\n|\r|\n/g)
    .map(paragraph => paragraph.trim());

/**
 * Decode HTML entities
 * @param {string} text
 * @returns {string}
 */
export const decodeHTML = (text) => {
    // By putting the text in the innerHTML of a dummy textarea, the HTML entities are automatically decoded.
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;

    return textArea.value;
};
