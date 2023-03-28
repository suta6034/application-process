import {
    computed, onMounted,
} from 'vue';
import {
    useResourceEndpointGet,
} from './resource-endpoint';
import * as contentService from '../services/content';

export function useLatestBlogArticles({ fetchOnMount = true } = {}) {
    const {
        data,
        error,
        get: fetch,
        isLoading,
    } = useResourceEndpointGet({
        endpoint: () => contentService.get({ type: 'articles', limit: 4 }),
        type: 'latest-blog-articles.js',
        requestKey: `GET|${contentService.baseUrl}`,
    });
    if (fetchOnMount) onMounted(() => fetch());
    const articles = computed(() => data.value?.data || []);

    return {
        articles,
        error,
        isLoading,
        fetch,
    };
}
