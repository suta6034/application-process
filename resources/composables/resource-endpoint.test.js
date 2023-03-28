import flushPromises from 'flush-promises';

import {
    useResourceCache,
} from './resource-cache';
import {
    useResourceEndpointGet,
    useResourceEndpointGetList,
    useResourceEndpointPersist,
} from './resource-endpoint';

jest.useFakeTimers();

describe('useResourceEndpointGet()', () => {
    test('It should call the given `endpoint` with the given `params`.', () => {
        const endpoint = jest.fn().mockReturnValue({ data: {} });
        const params = { foo: 'foo' };

        const { get } = useResourceEndpointGet({ endpoint, type: 'FOO' });
        get(params);

        expect(endpoint).toBeCalledWith(params);
    });

    test('It should use an existing cached response.', async () => {
        const endpoint = async () => ({ data: { foo: 'foo' } });
        const params = { foo: 'foo' };

        const { get } = useResourceEndpointGet({ endpoint, type: 'FOO' });
        // Prewarm response cache.
        await get(params);
        // Expect to immediately get data from response cache.
        const { get: getAgain, data } = useResourceEndpointGet({ endpoint, type: 'FOO' });

        // Note: no await because we get the data immediately from response cache!
        getAgain(params);

        expect(data.value).toEqual({ foo: 'foo' });
    });

    test('It should return an existing cached entity.', async () => {
        const entity1 = { id: 1, foo: 'foo' };
        const entity2 = { id: 1, foo: 'bar' };
        const endpoint1 = async () => ({ data: entity1 });
        const endpoint2 = async () => ({ data: entity2 });
        const params = { id: 1 };

        const { get } = useResourceEndpointGet({
            endpoint: endpoint1,
            type: 'FOO',
            requestKey: 'someKey',
        });
        // Prewarm resource cache.
        await get(params);
        // Expect to immediately get data from resource cache.
        const { get: getAgain, data } = useResourceEndpointGet({
            endpoint: endpoint2,
            type: 'FOO',
            requestKey: 'someKey2',
        });

        // Note: no await because we get the data immediately from resource cache!
        getAgain(params);

        // Immediately get data from resource cache.
        expect(data.value).toEqual(entity1);

        await flushPromises();

        // Data is updated as soon as the fresh data is loaded.
        expect(data.value).toEqual(entity2);
    });

    test('It should return a `data` ref that is updated when the cached entity is updated.', async () => {
        const entity1 = { id: 1, foo: 'foo' };
        const entity2 = { id: 1, foo: 'bar' };
        const endpoint1 = async () => ({ data: entity1 });
        const endpoint2 = async () => ({ data: entity2 });
        const params = { id: 1 };

        const { get, data } = useResourceEndpointGet({
            endpoint: endpoint1,
            type: 'FOO',
            requestKey: 'someKey',
        });
        // Prewarm cache.
        await get(params);

        expect(data.value).toEqual(entity1);

        const { get: getAgain } = useResourceEndpointGet({
            endpoint: endpoint2,
            type: 'FOO',
            requestKey: 'someKey2',
        });

        await getAgain(params);

        // Resource is updated as soon as the fresh data is loaded.
        expect(data.value).toEqual(entity2);
    });

    test('It should debounce requests.', async () => {
        const endpoint = jest.fn().mockResolvedValue({ data: {} });
        const { get } = useResourceEndpointGet({ endpoint, type: 'FOO' });

        get();
        get();
        jest.advanceTimersByTime(2000);
        get();

        expect(endpoint).toBeCalledTimes(2);
    });

    test('It should catch errors and make them available as ref.', async () => {
        const errorInstance = new Error();
        const endpoint = async () => { throw errorInstance; };
        const { get, error } = useResourceEndpointGet({ endpoint, type: 'FOO' });

        get();

        await flushPromises();

        expect(error.value).toBe(errorInstance);
    });
});

describe('useResourceEndpointGetList()', () => {
    test('It should call the given `endpoint` with the given `params`.', () => {
        const endpoint = jest.fn().mockReturnValue([{ data: {} }]);
        const params = { foo: 'foo' };

        const { getList } = useResourceEndpointGetList({ endpoint, type: 'FOO' });
        getList(params);

        expect(endpoint).toBeCalledWith(params);
    });

    test('It should return a `data` ref that is updated when one of the the cached entities is updated.', async () => {
        const entities = [{ id: 1, foo: 'foo', bar: 'bar' }, { id: 2, foo: 'bar' }];
        const entity = { id: 1, foo: 'baz' };
        const endpoint1 = async () => ({ data: entities });
        const endpoint2 = async () => ({ data: entity });

        const { getList, data } = useResourceEndpointGetList({
            endpoint: endpoint1,
            type: 'FOO',
            requestKey: 'someKey1',
        });
        // Prewarm cache.
        await getList();
        expect(data.value[0]).toEqual(entities[0]);

        const { get } = useResourceEndpointGet({
            endpoint: endpoint2,
            type: 'FOO',
            requestKey: 'someKey2',
        });

        await get();

        // Data is replaced with new value when result of the ednpoint is in.
        expect(data.value[0]).toEqual({
            ...entities[0],
            ...entity,
        });
    });

    test('It should update the cached data after the request succeeds.', async () => {
        const endpoint = jest.fn().mockReturnValue({ data: [{ foo: 'bar' }] });
        const params = { foo: 'foo' };

        const { getList, data } = useResourceEndpointGetList({ endpoint, type: 'FOO' });
        await getList(params);
        expect(data.value[0].foo).toBe('bar');

        jest.advanceTimersByTime(2000);
        endpoint.mockReturnValue({ data: [{ foo: 'baz' }] });
        const requestPromise = getList({ bar: 'bar' });
        expect(data.value[0].foo).toBe('bar');

        await requestPromise;
        expect(data.value[0].foo).toBe('baz');
    });

    test('It should not overwrite undefined properties in resource cache.', async () => {
        const { set } = useResourceCache();
        set({ data: { id: 1, foo: 'foo', baz: [] }, id: 1, type: 'FOO' });
        const endpoint = jest.fn().mockReturnValue({ data: [{ id: 1, foo: 'bar', baz: undefined }] });
        const params = { foo: 'foo' };

        const { getList, data } = useResourceEndpointGetList({ endpoint, type: 'FOO' });
        await getList(params);

        expect(data.value[0]).toEqual({ id: 1, foo: 'bar', baz: [] });
    });
});

describe('useResourceEndpointPersist()', () => {
    test('It should call the given `endpoint` with the given `params`.', () => {
        const endpoint = jest.fn().mockReturnValue([{ data: {} }]);
        const params = { foo: 'foo' };

        const { persist } = useResourceEndpointPersist({ endpoint, type: 'FOO' });
        persist(params);

        expect(endpoint).toBeCalledWith(params);
    });

    test('It should return a `data` ref that is updated when one of the the cached entities is updated.', async () => {
        const entities = [{ id: 1, foo: 'foo', bar: 'bar' }, { id: 2, foo: 'bar' }];
        const entity = { id: 1, foo: 'baz' };
        const endpoint1 = async () => ({ data: entities });
        const endpoint2 = async () => ({ data: entity });

        const { getList, data } = useResourceEndpointGetList({ endpoint: endpoint1, type: 'FOO' });
        // Prewarm cache.
        await getList();
        expect(data.value[0]).toEqual(entities[0]);

        const { persist: patch } = useResourceEndpointPersist({ endpoint: endpoint2, type: 'FOO' });

        patch({ id: entity.id, data: entity });

        // Data is updated immediately.
        expect(data.value[0]).toEqual({
            ...entities[0],
            ...entity,
        });

        await flushPromises();

        // Data is replaced with new value when result of the endpoint is in.
        expect(data.value[0]).toEqual({
            ...entities[0],
            ...entity,
        });
    });

    test('It should return static data when an entity is updated and optimistic updates are disabled.', async () => {
        const entities = [{ id: 1, foo: 'foo', bar: 'bar' }, { id: 2, foo: 'bar' }];
        const entity = { id: 1, foo: 'baz' };
        const endpoint1 = async () => ({ data: entities });
        const endpoint2 = async () => ({ data: entity });

        const { getList, data } = useResourceEndpointGetList({ endpoint: endpoint1, type: 'FOO' });
        // Prewarm cache.
        await getList();
        expect(data.value[0]).toEqual(entities[0]);

        const { persist: patch } = useResourceEndpointPersist({ endpoint: endpoint2, type: 'FOO' });

        patch({ id: entity.id, data: entity }, { isOptimistic: false });

        // Data is not updated immediately.
        expect(data.value[0]).toEqual(entities[0]);

        await flushPromises();

        // Data is not replaced with new value when result of the endpoint is in.
        expect(data.value[0]).not.toEqual(entity);
    });
});
