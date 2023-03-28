import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';
import {
    getAccessToken,
} from './auth';

const endpoint = 'profile';
export const baseUrl = `${BACKEND}/${endpoint}`;
const backendEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint,
});
const backendImageUploadEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint: 'profile',
    options: {
        timeout: 120000,
    },
});

async function setAuthorizationHeader(axiosInstance = backendEndpoint) {
    // eslint-disable-next-line no-param-reassign
    axiosInstance.defaults.headers.common.authorization = `Bearer ${await getAccessToken()}`;
}

export async function profileGet() {
    await setAuthorizationHeader();

    return backendEndpoint.get();
}

export async function profileCreate(profile, params = null) {
    /*
    * The profile endpoint can either be called with hash or authorization bearer token.
    * 1. /profil/lebenslauf where the user is logged in, and we have access to the access
    *    token that is set as Authorization token
    * 2. /profil/anlegen/speichern where the user is not logged in and/or does not exists yet,
    *      a hash is used to authenticate towards applicant api
    *
    * We can't send both Authorization header and hash to Applicant API as it will always
    * validate Authorization header first.
    */
    if (params?.hash === undefined) {
        await setAuthorizationHeader();
    }

    return backendEndpoint.post('', { profile, queryParameters: params });
}

export async function updateProfileMeta(profileMeta) {
    await setAuthorizationHeader();

    return backendEndpoint.put('meta', profileMeta);
}

export async function deleteImage() {
    await setAuthorizationHeader();

    return backendEndpoint.delete('image');
}

export async function uploadImage(imageData) {
    await setAuthorizationHeader(backendImageUploadEndpoint);

    return backendImageUploadEndpoint.post('image', imageData);
}

export async function deleteAttachment(uuid) {
    await setAuthorizationHeader();

    return backendEndpoint.delete(`attachment/${uuid}`);
}

export async function uploadAttachment(attachmentData, uploadProgressCallback = () => null) {
    const backendAttachmentUploadEndpoint = apiEndpoint({
        api: BACKEND,
        endpoint: 'profile',
        options: {
            timeout: 120000,
            onUploadProgress(e) {
                const percentCompleted = Math.round((e.loaded * 100) / e.total);
                uploadProgressCallback(percentCompleted);
            },
        },
    });

    await setAuthorizationHeader(backendAttachmentUploadEndpoint);

    return backendAttachmentUploadEndpoint.post('attachment', attachmentData);
}
