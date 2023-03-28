import routerNextFactory from './router-next-factory';

describe('routerNextFactory()', () => {
    test('It should be a function.', () => {
        expect(typeof routerNextFactory).toBe('function');
    });

    test('It should return the given `next()` function if there is no subsequent middleware.', () => {
        const next = jest.fn();

        expect(routerNextFactory({ next }, [], 1)).toBe(next);
    });

    test('It should return a new function if there is a subsequent middleware.', () => {
        const next = jest.fn();
        const result = routerNextFactory({ next }, [jest.fn(), jest.fn()], 1);

        expect(result).not.toBe(next);
        expect(typeof result).toBe('function');
    });

    test('It should call the subsequent middleware when executing the new function.', () => {
        const next = jest.fn();
        const subsequentMiddleware = jest.fn();
        const result = routerNextFactory({ next }, [jest.fn(), subsequentMiddleware], 1);

        result();

        expect(subsequentMiddleware).toBeCalled();
    });
});
