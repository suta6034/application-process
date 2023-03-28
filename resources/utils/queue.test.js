import flushPromises from 'flush-promises';
import {
    makeQueue,
} from './queue';

describe('queue', () => {
    test('It should immediately run a newly added callback if the queue is idle.', () => {
        const queue = makeQueue();
        const callback = jest.fn();
        queue.add(callback);

        expect(callback).toBeCalled();
    });

    test('It should run subsequent async jobs one after each other.', async () => {
        jest.useFakeTimers();
        const callback1 = jest.fn().mockImplementation(() => new Promise((resolve) => {
            setTimeout(() => resolve(), 20);
        }));
        const callback2 = jest.fn();
        const queue = makeQueue();
        queue.add(callback1);
        queue.add(callback2);

        expect(callback1).toBeCalled();
        expect(callback2).not.toBeCalled();
        jest.advanceTimersByTime(20);
        await flushPromises();
        expect(callback2).toHaveBeenCalled();

        jest.useRealTimers();
    });

    test('It should run subsequent jobs if a job throws an error.', async () => {
        const callback1 = jest.fn().mockRejectedValue(new Error());
        const callback2 = jest.fn();
        const queue = makeQueue();
        queue.add(callback1);
        queue.add(callback2);

        await flushPromises();
        expect(callback2).toHaveBeenCalled();
    });
});
