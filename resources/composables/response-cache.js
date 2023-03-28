import {
    ref,
} from 'vue';
import QuickLru from 'quick-lru';

export const responseCache = new QuickLru({ maxSize: 128 });

export function useResponseCache() {
    const get = ({ cacheKey }) => responseCache.get(cacheKey);
    const set = ({ cacheKey, data }) => responseCache.set(cacheKey, ref(data));
    const mutate = ({ cacheKey, data }) => {
        const responseCached = get({ cacheKey });

        if (responseCached) {
            // Update an existing resource in cache.
            responseCached.value = data;
            return;
        }

        // Add a new response to the cache.
        set({ cacheKey, data });
    };

    return {
        get,
        mutate,
        set,
    };
}
