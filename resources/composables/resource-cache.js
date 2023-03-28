import {
    ref,
} from 'vue';
import QuickLru from 'quick-lru';

export const resourceCache = new QuickLru({ maxSize: 512 });

function getResourceCacheKey({ id, type }) {
    return `${type}-${id}`;
}

export function useResourceCache() {
    const get = ({ id, type }) => {
        const resourceCacheKey = getResourceCacheKey({ id, type });
        return resourceCache.get(resourceCacheKey);
    };
    const set = ({ data, id, type }) => {
        const resourceCacheKey = getResourceCacheKey({ id, type });
        resourceCache.set(resourceCacheKey, ref(data));
    };
    const mutate = ({ data, id, type }) => {
        const resourceCached = get({ id, type });

        if (resourceCached) {
            if (data === null) {
                resourceCached.value = data;
                return;
            }

            // Prevent undefined properties from overriding existing values.
            for (const [property, value] of Object.entries(data)) {
                if (value === undefined) {
                    // eslint-disable-next-line no-param-reassign
                    delete data[property];
                }
            }

            // Update an existing resource in cache.
            Object.assign(resourceCached.value, data);
            return;
        }

        // Add a new resource to the cache.
        set({ data, id, type });
    };
    const mutatePatch = ({ data, id, type }) => {
        const resourceCached = get({ id, type });

        if (!resourceCached) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.info('Trying to patch a resource that is not in the cache yet.');
            }
            return;
        }

        Object.assign(resourceCached.value, {
            ...resourceCached.value,
            ...data,
        });
    };

    return {
        get,
        mutate,
        mutatePatch,
        set,
    };
}
