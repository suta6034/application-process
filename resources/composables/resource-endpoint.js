import {
    computed,
    ref,
    watch,
    watchEffect,
} from 'vue';
import QuickLru from 'quick-lru';

import {
    useResourceCache,
} from './resource-cache';
import {
    useResponseCache,
} from './response-cache';

export const requestCache = new QuickLru({ maxAge: 2000, maxSize: 64 });

export const STATES = {
    isIdle: 'IDLE',
    isValidating: 'VALIDATING',
    isLoading: 'LOADING',
    isSuccess: 'SUCCESS',
    isError: 'ERROR',
    isErrorStale: 'ERROR_STALE',
};

// We need a unique cache id for each endpoint.
const cacheIdMap = {};
let requestId = 0;
function getRequestCacheId({ requestKey }) {
    if (cacheIdMap[requestKey] === undefined) {
        cacheIdMap[requestKey] = requestId;
        requestId += 1;
    }

    return cacheIdMap[requestKey];
}

// The cache key must be unique for each endpoint and params combination.
function getCacheKey({ requestKey, params }) {
    // Be aware that `{ foo: 'a', bar: 'b' }` resolves to a different key than
    // `{ bar: 'b', foo: 'a' }`.
    return JSON.stringify({ cacheId: getRequestCacheId({ requestKey }), params });
}

function useState({ data, error, isValidating }) {
    const state = ref(STATES.isIdle);

    watchEffect(() => {
        if (data.value === undefined && isValidating.value && !error.value) {
            state.value = STATES.isLoading;
            return;
        }
        if (data.value !== undefined && isValidating.value) {
            state.value = STATES.isValidating;
            return;
        }
        if (data.value !== undefined && !error.value) {
            state.value = STATES.isSuccess;
            return;
        }
        if (data.value === undefined && error.value) {
            state.value = STATES.isError;
            return;
        }
        if (data.value !== undefined && error.value) {
            state.value = STATES.isErrorStale;
        }
    });

    return {
        state,
        STATES,
    };
}

export function useResourceEndpointGet({
    endpoint,
    requestKey,
    type,
}) {
    const {
        get: getResourceCached,
        mutate: mutateResourceCached,
    } = useResourceCache();

    const {
        get: getResponseCached,
        mutate: mutateResponseCached,
    } = useResponseCache();

    const params = ref(null);
    const cacheKey = computed(() => getCacheKey({ requestKey, params: params.value }));
    const response = ref(undefined);
    const responseOrCached = computed(() => {
        const responseCached = getResponseCached({ cacheKey: cacheKey.value });
        if (responseCached) return responseCached.value;
        return response.value;
    });
    const data = computed(() => {
        const resourceCached = getResourceCached({ id: params.value?.id, type });
        const currentData = responseOrCached.value?.data;
        return resourceCached?.value || currentData;
    });
    const meta = computed(() => responseOrCached.value?.meta);
    const error = ref(null);
    const isValidating = ref(false);

    const get = async (newParams = null) => {
        try {
            isValidating.value = true;
            params.value = newParams;

            const requestCached = requestCache.get(cacheKey.value);
            const request = requestCached || endpoint(newParams);
            if (!requestCached) {
                requestCache.set(cacheKey.value, request);
            }

            const newResponse = await request;
            mutateResponseCached({ cacheKey: cacheKey.value, data: newResponse });
            response.value = newResponse;
            error.value = null;

            const resource = newResponse.data;
            mutateResourceCached({ data: resource, id: resource.id, type });
            isValidating.value = false;

            return true;
        } catch (newError) {
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.error(newError);
            }
            error.value = newError;
            isValidating.value = false;

            return false;
        }
    };

    const { state } = useState({ data, error, isValidating });
    const isLoading = computed(() => state.value === STATES.isLoading);

    return {
        data,
        error,
        get,
        meta,
        state,
        isLoading,
    };
}

export function useResourceEndpointGetReactive({ endpoint, params, type, requestKey }) {
    const { get, ...helpers } = useResourceEndpointGet({ endpoint, type, requestKey });

    const refetch = () => get(params.value);
    // If we do not want to refetch as there are no params
    // we can prevent refetch by setting params to false.
    // If we do not have params at all, we can set params undefined and still trigger refetch.
    watch(params, () => params.value !== false && refetch(), { immediate: true });

    return {
        ...helpers,
        refetch,
    };
}

export function useResourceEndpointGetList({
    endpoint,
    type,
    requestKey,
}) {
    const {
        get: getResourceCached,
        mutate: mutateResourceCached,
    } = useResourceCache();

    const {
        get: getResponseCached,
        mutate: mutateResponseCached,
    } = useResponseCache();

    const params = ref(null);
    const cacheKey = computed(() => getCacheKey({ requestKey, params: params.value }));
    const response = ref(undefined);
    const responseOrCached = computed(() => {
        const responseCached = getResponseCached({ cacheKey: cacheKey.value });
        if (responseCached) return responseCached.value;
        return response.value;
    });
    const data = computed(() => {
        const currentData = responseOrCached.value?.data;

        return currentData?.map?.((resource) => {
            const resourceCached = getResourceCached({ id: resource.id, type });

            return resourceCached ? resourceCached.value : resource;
        })
            // Filter deleted resources.
            .filter(resource => resource !== null);
    });
    const meta = computed(() => responseOrCached.value && responseOrCached.value.meta);
    const error = ref(null);
    const isValidating = ref(false);

    const getList = async (newParams = null) => {
        try {
            isValidating.value = true;
            params.value = newParams;

            const requestCached = requestCache.get(cacheKey.value);
            const request = requestCached || endpoint(newParams);
            if (!requestCached) {
                requestCache.set(cacheKey.value, request);
            }

            const newResponse = await request;
            mutateResponseCached({ cacheKey: cacheKey.value, data: newResponse });
            response.value = newResponse;
            error.value = null;

            for (const resource of newResponse.data) {
                mutateResourceCached({ data: resource, id: resource.id, type });
            }

            isValidating.value = false;

            return true;
        } catch (newError) {
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.error(newError);
            }
            error.value = newError;
            isValidating.value = false;

            return false;
        }
    };

    const { state } = useState({ data, error, isValidating });

    return {
        data,
        error,
        getList,
        meta,
        state,
    };
}

export function useResourceEndpointGetListReactive({ endpoint, params, type, requestKey }) {
    const { getList, ...helpers } = useResourceEndpointGetList({ endpoint, type, requestKey });
    const refetch = () => getList(params.value);
    // If we do not want to refetch as there are no params
    // we can prevent refetch by setting params to false.
    // If we do not have params at all, we can set params undefined and still trigger refetch.
    watch(params, () => params.value !== false && refetch(), { immediate: true });

    return {
        ...helpers,
        refetch,
    };
}

export function useResourceEndpointPersist({
    endpoint,
    type,
    requestKey,
}) {
    const {
        get: getResourceCached,
        mutate: mutateResourceCached,
        mutatePatch: mutatePatchResourceCached,
    } = useResourceCache();

    const params = ref(null);
    const response = ref(undefined);
    const data = computed(() => {
        const resourceCached = getResourceCached({ id: params.value?.id, type });
        const currentData = response.value && response.value.data;

        return resourceCached?.value || currentData;
    });
    const meta = computed(() => response.value && response.value.meta);
    const error = ref(null);
    const isValidating = ref(false);

    const persist = async (newParams, { isOptimistic = true } = {}) => {
        try {
            isValidating.value = true;
            params.value = newParams;

            if (isOptimistic) {
                if (newParams.data) {
                    // Optimistically updating a resource in cache.
                    mutatePatchResourceCached({ data: newParams.data, id: newParams.id, type });
                } else {
                    // Optimistically deleting a resource from cache.
                    mutateResourceCached({ data: null, id: newParams.id, type });
                }
            }

            const cacheKey = getCacheKey({ requestKey, params: newParams });
            const requestCached = requestCache.get(cacheKey);
            const request = requestCached || endpoint(newParams);
            if (!requestCached) {
                requestCache.set(cacheKey, request);
            }

            const newResponse = await request;
            response.value = newResponse;
            error.value = null;

            const resource = newResponse?.data || null;
            if (isOptimistic && resource) mutateResourceCached({ data: resource, id: resource.id, type });
            isValidating.value = false;

            return true;
        } catch (newError) {
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.error(newError);
            }
            error.value = newError;
            isValidating.value = false;

            return false;
        }
    };

    const { state } = useState({ data, error, isValidating });

    return {
        data,
        error,
        meta,
        persist,
        state,
    };
}
