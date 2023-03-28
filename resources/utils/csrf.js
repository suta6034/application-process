export function getCsrfToken() {
    return document.querySelector('meta[name=_token]')?.content ?? false;
}
