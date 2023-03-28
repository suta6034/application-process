import {
    computed,
    ref,
    unref,
} from 'vue';

import {
    useResourceEndpointGetReactive,
    useResourceEndpointGetListReactive,
    useResourceEndpointPersist,
} from './resource-endpoint';
import * as motivationLetterService from '../services/motivation-letter';

export { STATES } from './resource-endpoint';

export function useMotivationLetter({ id }) {
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
        endpoint: motivationLetterService.get,
        params,
        type: motivationLetterService.TYPE,
        requestKey: `GET|${motivationLetterService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        refetch,
        state,
    };
}

export function useMotivationLetterList() {
    const params = ref(undefined);
    const {
        data,
        error,
        meta,
        refetch,
        state,
    } = useResourceEndpointGetListReactive({
        endpoint: motivationLetterService.getList,
        params,
        type: motivationLetterService.TYPE,
        requestKey: `GET|${motivationLetterService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        refetch,
        state,
    };
}

export function useMotivationLetterPost() {
    const {
        data,
        error,
        meta,
        persist: post,
        state,
    } = useResourceEndpointPersist({
        endpoint: motivationLetterService.post,
        type: motivationLetterService.TYPE,
        requestKey: `POST|${motivationLetterService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        post,
        state,
    };
}

export function useMotivationLetterPatch() {
    const {
        data,
        error,
        meta,
        persist: patch,
        state,
    } = useResourceEndpointPersist({
        endpoint: motivationLetterService.patch,
        type: motivationLetterService.TYPE,
        requestKey: `PATCH|${motivationLetterService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        patch,
        state,
    };
}

export function useMotivationLetterRemove() {
    const {
        error,
        persist: remove,
        state,
    } = useResourceEndpointPersist({
        endpoint: motivationLetterService.remove,
        type: motivationLetterService.TYPE,
        requestKey: `DELETE|${motivationLetterService.baseUrl}`,
    });

    return {
        error,
        remove,
        state,
    };
}
