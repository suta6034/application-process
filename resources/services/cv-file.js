import {
    BACKEND,
    apiEndpoint,
    apiResource,
} from '../utils/api';
import * as authService from './auth';

// This distinction is needed for the performance of automated tests.
/* istanbul ignore next: Hard to test – tested in acceptance tests. */
const WAIT_TIME_IN_MS = process.env.MODE_ENV === 'production' ? 2000 : 10;

/* istanbul ignore next: Hard to test – tested in acceptance tests. */
function sleep(ms) {
    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    return new Promise((resolve) => { setTimeout(resolve, ms); });
}

export const endpoint = apiEndpoint({
    api: BACKEND,
    endpoint: 'cv-file',
});

export function exists() {
    return endpoint.get('exists');
}

export async function fetchAvailability() {
    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    try {
        /* eslint-disable */
        let response = await exists();
        if (response && response.data.meta.exists) return response.data.meta.exists;
        for (let i = 0; i < 5; i += 1) {
            await sleep(WAIT_TIME_IN_MS);
            response = await exists();
            if (response && response.data.meta.exists) return response.data.meta.exists;
        }
        /* eslint-enable */
        return false;
    } catch (e) {
        return false;
    }
}

export function getTemplateSettings() {
    return endpoint.get('template-settings');
}

export async function patchTemplateSettings(settings, params = null) {
    const uuid = await authService.getUuid();
    return endpoint.patch('template-settings', apiResource('template-settings', settings, uuid), { params });
}

export async function postTemplateSettings(settings, params = null) {
    const uuid = await authService.getUuid();
    return endpoint.post('template-settings', apiResource('template-settings', settings, uuid), { params });
}

export async function prepareLivePreviewData(settings) {
    const response = await endpoint.get('preview-data');
    const previewData = response.data.data.attributes.cv;
    if (settings) {
        // We use `font` in our code/database, but Kickresume expects `fontFace`.
        const mappedSettings = { ...settings };
        mappedSettings.fontFace = mappedSettings.font;
        delete mappedSettings.font;
        Object.assign(previewData.settings, mappedSettings);
    }
    // Unfortunately, the expected object is a bit different to what we send when creating a job.
    previewData.avatarUrl = response.data.data.attributes.avatarUrl;
    return previewData;
}
