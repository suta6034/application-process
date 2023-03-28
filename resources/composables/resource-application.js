import {
    computed,
    unref,
} from 'vue';

import {
    useApplicationsFilter,
} from './applications-filter';
import {
    usePagination,
} from './pagination';
import {
    useResourceEndpointGetReactive,
    useResourceEndpointGetListReactive,
    useResourceEndpointPersist,
} from './resource-endpoint';
import {
    useSort,
} from './sort';
import * as applicationService from '../services/application';

export { STATES } from './resource-endpoint';
export { STATUS } from '../services/application';

export function useApplication({ id }) {
    const params = computed(() => ({
        id: unref(id),
    }));
    const {
        data,
        error,
        meta,
        refetch,
        state,
    } = useResourceEndpointGetReactive({
        endpoint: applicationService.get,
        params,
        type: applicationService.TYPE,
        requestKey: `GET|${applicationService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        refetch,
        state,
    };
}

export function useApplicationList({ pageSize } = {}) {
    const {
        page,
        turnToPageFirst,
        turnToPageNext,
        turnToPagePrevious,
    } = usePagination();
    const {
        sortBy,
        sortDirection,
    } = useSort({ defaultDirection: applicationService.SORT_DIRECTION.createDateDesc });
    const {
        activeFilter,
        resetFilter,
        setFilter,
        defaultFilterActive,
        hasActiveFilter,
        filterString,
        resourceFilterString,
    } = useApplicationsFilter();

    const params = computed(() => ({
        filterString: resourceFilterString.value,
        pageSize: unref(pageSize),
        page: page.value,
        sortDirection: sortDirection.value,
    }));

    const {
        data,
        error,
        meta,
        refetch,
        state,
    } = useResourceEndpointGetListReactive({
        endpoint: applicationService.getList,
        params,
        type: applicationService.TYPE,
        requestKey: `GET|${applicationService.baseUrl}`,
    });
    const pagination = computed(() => meta.value?.pagination || {});

    return {
        data,
        error,
        meta,
        pagination,
        refetch,
        sortBy,
        sortDirection,
        state,
        setFilter,
        resetFilter,
        filterString,
        activeFilter,
        defaultFilterActive,
        hasActiveFilter,
        turnToPageFirst,
        turnToPageNext,
        turnToPagePrevious,
    };
}

export function useApplicationPatch() {
    const {
        data,
        error,
        meta,
        persist: patch,
        state,
    } = useResourceEndpointPersist({
        endpoint: applicationService.patch,
        type: applicationService.TYPE,
        requestKey: `PATCH|${applicationService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        patch,
        state,
    };
}

export function useApplicationPost() {
    const {
        data,
        error,
        meta,
        persist: post,
        state,
    } = useResourceEndpointPersist({
        endpoint: applicationService.post,
        type: applicationService.TYPE,
        requestKey: `POST|${applicationService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        post,
        state,
    };
}

export function useApplicationRemove() {
    const {
        error,
        persist: remove,
        state,
    } = useResourceEndpointPersist({
        endpoint: applicationService.remove,
        type: applicationService.TYPE,
        requestKey: `DELETE|${applicationService.baseUrl}`,
    });

    return {
        error,
        remove,
        state,
    };
}
