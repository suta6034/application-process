import {
    computed,
    unref,
} from 'vue';

import {
    TYPE as TYPE_APPLICATION,
} from '../services/application';
import {
    useResourceEndpointGetList,
    useResourceEndpointGetListReactive,
    useResourceEndpointPersist,
} from './resource-endpoint';
import {
    useResourceCache,
} from './resource-cache';
import * as applicationStatusService from '../services/application-status';

export { STATES } from './resource-endpoint';
export { STATUS } from '../services/application-status';

export function useApplicationStatusList({ id }) {
    const params = computed(() => ({
        id: unref(id),
    }));
    const {
        data,
        error,
        meta,
        refetch,
        state,
    } = useResourceEndpointGetListReactive({
        endpoint: applicationStatusService.getList,
        params,
        type: applicationStatusService.TYPE,
        requestKey: `GET|${applicationStatusService.baseUrl}`,
    });

    return {
        data,
        error,
        meta,
        refetch,
        state,
    };
}

export function useApplicationStatusPatch() {
    const {
        data,
        error,
        meta,
        persist,
        state,
    } = useResourceEndpointPersist({
        endpoint: applicationStatusService.patch,
        type: applicationStatusService.TYPE,
        requestKey: `PATCH|${applicationStatusService.baseUrl}`,
    });
    const {
        mutatePatch,
    } = useResourceCache();

    const {
        getList,
    } = useResourceEndpointGetList({
        endpoint: applicationStatusService.getList,
        type: applicationStatusService.TYPE,
        requestKey: `GET|${applicationStatusService.baseUrl}`,
    });

    const patch = async ({ data: newData, id }) => {
        // Because the application status pretends to be a separate resource, we
        // must manually update the corresponding application resource with the
        // same ID.
        mutatePatch({ data: newData, id, type: TYPE_APPLICATION });
        const result = await persist({ data: newData, id });
        getList({ id });

        return result;
    };

    return {
        data,
        error,
        meta,
        patch,
        state,
    };
}
