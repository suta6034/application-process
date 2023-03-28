import {
    computed,
} from 'vue';

import {
    usePagination,
} from './pagination';
import {
    useResourceEndpointGetListReactive,
    useResourceEndpointPersist,
} from './resource-endpoint';
import * as profileViewsService from '../services/profile-view';

export { STATES } from './resource-endpoint';

export function useProfileViewList() {
    const {
        page,
        turnToPageFirst,
        turnToPageNext,
        turnToPagePrevious,
    } = usePagination();
    const params = computed(() => ({
        page: page.value,
    }));
    const {
        data,
        error,
        meta,
        refetch,
        state,
    } = useResourceEndpointGetListReactive({
        endpoint: profileViewsService.getList,
        requestKey: `GET|${profileViewsService.baseUrl}`,
        params,
        type: profileViewsService.TYPE,
    });

    const pagination = computed(() => meta.value?.pagination || {});

    return {
        data,
        error,
        meta,
        pagination,
        refetch,
        state,
        turnToPageFirst,
        turnToPageNext,
        turnToPagePrevious,
    };
}

export function useProfileViewNotificationPatch() {
    const {
        data,
        error,
        meta,
        persist: patch,
        state,
    } = useResourceEndpointPersist({
        endpoint: profileViewsService.patch,
        type: profileViewsService.TYPE,
        requestKey: `PATCH|${profileViewsService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        patch,
        state,
    };
}
