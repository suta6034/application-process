import {
    ref,
    computed,
    onMounted,
    onUnmounted,
} from 'vue';
import router from '../router';

const availableApplicationFilter = [
    {
        key: 'applied',
        trackingName: 'Applied',
    },
    {
        key: 'invited',
        trackingName: 'Invited',
    },
    {
        key: 'confirmed',
        trackingName: 'Confirmed',
    },
    {
        key: 'rejected',
        trackingName: 'Rejected',
    },
    {
        key: 'archived',
        trackingName: 'Archived',
    },
];

const stateObject = ref(availableApplicationFilter.map(({ key, trackingName }, index) => ({
    key,
    active: false,
    id: index,
    trackingName,
})));

export function useApplicationsFilter() {
    const activeFilter = computed(() => stateObject.value.filter(filterToCheck => filterToCheck.active));
    const hasActiveFilter = computed(() => activeFilter.value.length > 0);

    const resetFilter = () => {
        // eslint-disable-next-line no-param-reassign
        stateObject.value.forEach((filterName) => { filterName.active = false; });
    };

    const filterString = computed(() => activeFilter.value
        .map(filter => filter.key)
        .reduce((acc, cur) => `${acc}${cur},`, '')
        .slice(0, -1) || '');

    const resourceFilterString = ref(router.currentRoute?.query.filter);

    const generateStateFromQueryString = () => {
        if (router.currentRoute?.name !== 'page-applications') return;
        resetFilter();
        router.currentRoute?.query.filter?.split(',')
            .forEach((filterName) => {
                const filter = stateObject.value.find(filterToCheck => filterToCheck.key === filterName);
                if (!filter) return;
                filter.active = true;
            });
        resourceFilterString.value = filterString.value;
    };

    const setFilter = (filterKey, active) => {
        const filter = stateObject.value.find(filterInState => filterInState.key === filterKey);
        filter.active = active;
    };

    onMounted(() => {
        // Generate initial state from route
        generateStateFromQueryString();

        const routeChangeWatcher = router.afterEach(() => {
            generateStateFromQueryString();
        });

        // To prevent memory leaking by often-switching routes,
        // the 'router-afterEach' has to be removed in the life cycle 'Unmounted'
        // otherwise 'router-afterEach' gets called and stacked in memory via each routing.
        onUnmounted(routeChangeWatcher);
    });

    return {
        activeFilter,
        applicationsFilter: stateObject,
        resetFilter,
        hasActiveFilter,
        resourceFilterString,
        filterString,
        setFilter,
    };
}
