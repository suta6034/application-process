export const ERROR_CLASS = '.has-status-error';

export function focusFirstStatus(firstElementWithError) {
    if (!firstElementWithError) return;
    if (firstElementWithError.focus) firstElementWithError.focus();

    // Fallback for elements which are not focusable and for browsers which
    // do not support focusing elements asynchronously (e.g. iOS Safari).
    if (firstElementWithError.scrollIntoViewIfNeeded) {
        firstElementWithError.scrollIntoViewIfNeeded(true);
    } else if (firstElementWithError.scrollIntoView) {
        firstElementWithError.scrollIntoView(true);
    }
}
