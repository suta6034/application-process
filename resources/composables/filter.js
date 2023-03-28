import {
    onMounted,
    onUnmounted,
    readonly,
    ref,
} from 'vue';
import router from '../router';

export function useFilter({ defaultFilter = { status: 'default' } } = {}) {
    const filterStatusFromRoute = router.currentRoute?.query.filter || defaultFilter.status;
    const filter = ref({ status: filterStatusFromRoute });

    onMounted(() => {
        const removeHandler = router.afterEach(({ query }) => {
            if (!query.filter) {
                filter.value = defaultFilter;
                return;
            }

            filter.value = { status: query.filter };
        });
        // To prevent memory leaking by often-switching routes,
        // the 'router-afterEach' has to be removed in the life cycle 'Unmounted'
        // otherwise 'router-afterEach' gets called and stacked in memory via each routing.
        onUnmounted(removeHandler);
    });

    const applyFilter = filterNew => router.push({ query: { filter: filterNew.status } });
    const resetFilter = () => router.push({ query: { filter: defaultFilter.status } });

    return {
        applyFilter,
        filter: readonly(filter),
        resetFilter,
    };
}
