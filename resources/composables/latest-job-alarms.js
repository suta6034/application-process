import {
    computed, onMounted,
} from 'vue';
import {
    useResourceEndpointGet,
} from './resource-endpoint';
import * as jobAlarmService from '../services/job-alarm';

export function useLatestJobAlarms({ fetchOnMount = true } = {}) {
    const {
        data,
        error,
        get: fetch,
        isLoading,
    } = useResourceEndpointGet({
        endpoint: jobAlarmService.latest,
        type: 'jobalarm-latest-list',
        requestKey: `GET|${jobAlarmService.baseUrl}`,
    });
    if (fetchOnMount) onMounted(() => fetch());
    const jobAlarmItems = computed(() => data.value?.data || []);
    const jobAlarmCount = computed(() => data.value?.meta.count || 0);

    return {
        jobAlarmItems,
        jobAlarmCount,
        error,
        isLoading,
        fetch,
    };
}
