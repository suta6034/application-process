/**
 * Convert a `px` value (e.g., `10px`) into a number.
 *
 * @param {string} value
 * @returns {number}
 */
function pxValueToNumber(value) {
    return parseInt(value, 10);
}

/**
 * Return `null` if the value is not a pixel value (e.g., `auto`, `0px`).
 *
 * @param {string} value
 * @returns {string}
 */
function pxValueOrNull(value) {
    if (value?.includes('px') && value !== '0px') return value;

    return null;
}

/**
 * Get scroll padding top number either from the element or the root scroll
 * container.
 *
 * @param {Element} $element
 * @returns {number}
 */
function getScrollPaddingTop($element) {
    let style = window.getComputedStyle($element);
    let scrollPaddingTop = pxValueOrNull(style.scrollPaddingTop) || pxValueOrNull(style.scrollPadding);

    if (scrollPaddingTop) return pxValueToNumber(scrollPaddingTop);

    style = window.getComputedStyle(document.querySelector('html'));
    scrollPaddingTop = pxValueOrNull(style.scrollPaddingTop) || pxValueOrNull(style.scrollPadding);

    return scrollPaddingTop ? pxValueToNumber(scrollPaddingTop) : 0;
}

/**
 * Scroll to the given HTML element.
 *
 * @param {Element} $element
 * @param {ScrollBehavior} behavior
 * @returns {void}
 */
export default function scrollToElement($element, behavior = 'auto') {
    // Ideally, this should be solved with a simple `scrollIntoView()`. But
    // certain browsers (https://caniuse.com/?search=scroll-padding) do not
    // support `scrollIntoView()` in combination with `scroll-padding`. This
    // workaround can be removed as soon as the problem is fixed in all
    // browsers.
    const scrollPaddingTop = getScrollPaddingTop($element);
    window.scrollTo({
        behavior,
        top: $element.offsetTop - scrollPaddingTop,
    });
}
