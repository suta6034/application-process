import {
    computed, onMounted,
} from 'vue';
import {
    useResourceEndpointGet,
} from './resource-endpoint';
import * as watchlistService from '../services/job-watchlist';

export function useLatestWatchlist({ fetchOnMount = true } = {}) {
    const {
        data,
        error,
        get: fetch,
        isLoading,
    } = useResourceEndpointGet({
        endpoint: watchlistService.latest,
        type: 'watchlist-latest',
        requestKey: `GET|${watchlistService.baseUrl}`,
    });
    if (fetchOnMount) onMounted(() => fetch());
    const jobs = computed(() => data.value?.data || null);
    const count = computed(() => data.value?.meta.count || 0);

    return {
        jobs,
        count,
        error,
        isLoading,
        fetch,
    };
}
