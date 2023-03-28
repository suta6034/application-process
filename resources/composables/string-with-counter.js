import {
    computed,
    isRef,
} from 'vue';

export function useStringWithCounter({ singular, plural, counter }) {
    if (!isRef(counter)) throw new Error('`counter` must be a ref!');

    const stringWithCounter = computed(() => {
        if (counter.value === 1) return `${counter.value} ${singular}`;
        if (counter.value >= 0) return `${counter.value} ${plural}`;
        return `${plural}`; // while undefined
    });
    return {
        stringWithCounter,
    };
}
