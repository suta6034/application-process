import {
    computed,
} from 'vue';

export function useTimeGatedElement({ key, timeToShow }) {
    const elementShown = () => {
        if (localStorage?.getItem(key)) return;
        localStorage?.setItem(key, new Date());
    };
    const shouldShowElement = computed(() => {
        if (!localStorage?.getItem(key)) return true;
        const firstShownTime = new Date(localStorage?.getItem(key)).getTime();
        return timeToShow > new Date().getTime() - firstShownTime;
    });

    return {
        elementShown,
        shouldShowElement,
    };
}
