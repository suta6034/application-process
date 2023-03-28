import {
    computed,
    unref,
} from 'vue';

import {
    usePagination,
} from './pagination';
import {
    useResourceEndpointGetListReactive,
    useResourceEndpointGetReactive,
    useResourceEndpointPersist,
} from './resource-endpoint';
import * as conversationService from '../services/conversation';
import {
    useFilter,
} from './filter';

export { STATES } from './resource-endpoint';

export function useConversation({ id }) {
    const params = computed(() => (unref(id) ? ({
        id: unref(id),
    }) : false));
    const {
        data,
        error,
        meta,
        refetch,
        state,
    } = useResourceEndpointGetReactive({
        endpoint: conversationService.get,
        params,
        type: conversationService.TYPE,
        requestKey: `GET|${conversationService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        refetch,
        state,
    };
}

export function useConversationList({ pageSize } = {}) {
    const {
        page,
        turnToPageFirst,
        turnToPageNext,
        turnToPagePrevious,
    } = usePagination();
    const {
        applyFilter,
        filter,
    } = useFilter();

    const params = computed(() => ({
        filter: filter.value,
        page: page.value,
        pageSize: unref(pageSize),
    }));
    const {
        data,
        error,
        meta,
        refetch,
        state,
    } = useResourceEndpointGetListReactive({
        endpoint: conversationService.getList,
        params,
        type: conversationService.TYPE,
        requestKey: `GET|${conversationService.baseUrl}`,
    });

    const pagination = computed(() => meta.value?.pagination || {});
    return {
        applyFilter,
        data: computed(() => data.value && data.value.filter((conversation) => {
            if (filter.value.status === 'deleted') return conversation.deleted;
            return !conversation.deleted;
        })),
        error,
        filter,
        meta,
        pagination,
        refetch,
        state,
        turnToPageFirst,
        turnToPageNext,
        turnToPagePrevious,
    };
}

export function useConversationPatch() {
    const {
        data,
        error,
        meta,
        persist: patch,
        state,
    } = useResourceEndpointPersist({
        endpoint: conversationService.patch,
        type: conversationService.TYPE,
        requestKey: `PATCH|${conversationService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        patch,
        state,
    };
}

export function useConversationRemove() {
    const {
        error,
        persist: remove,
        state,
    } = useResourceEndpointPersist({
        endpoint: conversationService.remove,
        type: conversationService.TYPE,
        requestKey: `DELETE|${conversationService.baseUrl}`,
    });

    return {
        error,
        remove: ({ id }) => remove({ id, data: { deleted: true } }),
        state,
    };
}
