import {
    onMounted,
    onUnmounted,
    readonly,
    ref,
} from 'vue';

import router from '../router';

export function usePagination() {
    const pageNumberFromRoute = parseInt(router.currentRoute?.query.page || 1, 10);
    const pageNumber = ref(Math.max(pageNumberFromRoute, 1));

    onMounted(() => {
        const removeHandler = router.afterEach(({ query }) => {
            if (!query.page) {
                pageNumber.value = 1;
                return;
            }

            pageNumber.value = Math.max(parseInt(query.page, 10), 1);
        });
        // To prevent memory leaking by often-switching routes,
        // the 'router-afterEach' has to be removed in the life cycle 'Unmounted'
        // otherwise 'router-afterEach' gets called and stacked in memory via each routing.
        onUnmounted(removeHandler);
    });

    const turnToPage = number => router.push({
        query: {
            ...router.currentRoute?.query,
            page: number,
        },
    });
    const turnToPageFirst = () => turnToPage(1);
    const turnToPageNext = () => turnToPage(pageNumber.value + 1);
    const turnToPagePrevious = () => turnToPage(Math.max(pageNumber.value - 1, 1));

    return {
        page: readonly(pageNumber),
        turnToPage,
        turnToPageFirst,
        turnToPageNext,
        turnToPagePrevious,
    };
}
