import flushPromises from 'flush-promises';

import {
    exists,
    fetchAvailability,
    getTemplateSettings,
    patchTemplateSettings,
    postTemplateSettings,
    prepareLivePreviewData,
} from './cv-file';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');
jest.useFakeTimers();

describe('cvFile()', () => {
    describe('exists()', () => {
        test('It should be a function.', () => {
            expect(typeof exists).toBe('function');
        });

        test('It should call the GET `exists` endpoint.', () => {
            exists();

            expect(__axiosInstance.get).toBeCalledWith('exists');
        });
    });

    describe('fetchAvailability()', () => {
        test('It should be a function.', () => {
            expect(typeof fetchAvailability).toBe('function');
        });

        test('It should return `true` if the CV file is available.', async () => {
            __axiosInstance.get = jest.fn(() => ({
                data: {
                    meta: {
                        exists: true,
                    },
                },
            }));
            const response = await fetchAvailability();

            expect(response).toBe(true);
        });
    });

    describe('getTemplateSettings()', () => {
        test('It should be a function.', () => {
            expect(typeof getTemplateSettings).toBe('function');
        });

        test('It should call the GET `template-settings` endpoint.', () => {
            getTemplateSettings();

            expect(__axiosInstance.get).toBeCalledWith('template-settings');
        });
    });

    describe('patchTemplateSettings()', () => {
        test('It should be a function.', () => {
            expect(typeof patchTemplateSettings).toBe('function');
        });

        test('It should call the PATCH `template-settings` endpoint.', async () => {
            patchTemplateSettings();

            await flushPromises();

            expect(__axiosInstance.patch).toBeCalled();
        });
    });

    describe('postTemplateSettings()', () => {
        test('It should be a function.', () => {
            expect(typeof postTemplateSettings).toBe('function');
        });

        test('It should call the POST `template-settings` endpoint.', async () => {
            postTemplateSettings();

            await flushPromises();

            expect(__axiosInstance.post).toBeCalled();
        });
    });

    describe('prepareLivePreviewData()', () => {
        test('It should be a function.', () => {
            expect(typeof prepareLivePreviewData).toBe('function');
        });

        test('It should call the GET `preview-data` endpoint.', async () => {
            __axiosInstance.get.mockReturnValueOnce({ data: { data: { attributes: { cv: {} } } } });
            await prepareLivePreviewData();

            expect(__axiosInstance.get).toBeCalledWith('preview-data');
        });

        test('It should update template settings based on passed object.', async () => {
            __axiosInstance.get.mockReturnValueOnce({ data: { data: { attributes: { cv: { settings: {} } } } } });
            const data = await prepareLivePreviewData({
                template: 'One',
                color: 'Two',
                font: 'Three',
            });

            expect(data.settings.template).toBe('One');
            expect(data.settings.color).toBe('Two');
            expect(data.settings.fontFace).toBe('Three');
        });

        test('It should copy the `avatarUrl` to the root of the preview data object.', async () => {
            __axiosInstance.get.mockReturnValueOnce({ data: { data: { attributes: { cv: { }, avatarUrl: 'url' } } } });
            const data = await prepareLivePreviewData();

            expect(data.avatarUrl).toBe('url');
        });
    });
});
