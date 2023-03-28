import {
    computed, onMounted,
} from 'vue';
import {
    useResourceEndpointGet,
} from './resource-endpoint';
import * as jobMatchingService from '../services/job-matching';

export function useLatestJobMatchings({ fetchOnMount = true } = {}) {
    const {
        data,
        error,
        get: fetch,
        isLoading,
    } = useResourceEndpointGet({
        endpoint: jobMatchingService.get,
        type: 'matching-latest',
        requestKey: `GET|${jobMatchingService.baseUrl}`,
    });
    if (fetchOnMount) onMounted(() => fetch());
    const jobMatchings = computed(() => data.value?.data || []);

    return {
        jobMatchings,
        error,
        isLoading,
        fetch,
    };
}
