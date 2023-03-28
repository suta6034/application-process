import {
    readonly,
    ref,
} from 'vue';

export function useSort({ defaultDirection = null } = {}) {
    const sortDirection = ref(defaultDirection);

    const sortBy = (direction) => {
        sortDirection.value = direction;
    };

    return {
        sortBy,
        sortDirection: readonly(sortDirection),
    };
}
