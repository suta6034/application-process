import {
    apiEndpoint,
    BACKEND,
} from '../utils/api';

const backendEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint: 'tracking-statistic',
});

export async function getTrackingStats() {
    const tracking = await backendEndpoint.get('');
    const stats = {};

    const statsEntries = Object.entries(tracking.data.meta);

    // Convert numbers to strings because k4 does it too
    // Possibly used by Hotjar and that's why the values have to be converted to strings
    for (const [key, value] of statsEntries) {
        stats[key] = `${value}`;
    }

    return stats;
}
