import {
    readonly,
    shallowRef,
} from 'vue';

const current = shallowRef(document.activeElement);
const previous = shallowRef(null);

document.addEventListener('focus', (event) => {
    previous.value = current.value;
    current.value = event.target;
}, { capture: true });

document.addEventListener('blur', (event) => {
    // In case the current element loses focus but another
    // element immediately receives focus instead, we skip
    // because the `focus` event listener is fired anyway.
    const hasNewFocusedElement = Boolean(event.relatedTarget);
    if (hasNewFocusedElement) return;

    previous.value = current.value;
    current.value = document.activeElement;
}, { capture: true });

export function useFocusElement() {
    return {
        current: readonly(current),
        previous: readonly(previous),
    };
}
