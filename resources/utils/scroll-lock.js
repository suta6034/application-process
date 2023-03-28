let scrollPosition = null;

export function enableScrollLock() {
    scrollPosition = window.pageYOffset;
    document.querySelector('body').style.position = 'fixed';
    document.querySelector('body').style.top = `-${scrollPosition}px`;
    document.querySelector('body').style.width = '100%';
}

export function disableScrollLock() {
    document.querySelector('body').style.removeProperty('position');
    document.querySelector('body').style.removeProperty('top');
    document.querySelector('body').style.removeProperty('width');

    if (scrollPosition === null) return;
    window.scrollTo(0, scrollPosition);
    scrollPosition = null;
}
