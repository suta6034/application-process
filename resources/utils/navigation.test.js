import {
    redirect,
} from './navigation';

const oldWindowLocation = window.location;

beforeEach(() => {
    delete window.location;
    window.location = {
        assign: jest.fn(),
        pathname: '/',
        search: '',
    };
});
afterAll(() => {
    window.location = oldWindowLocation;
});

describe('redirect()', () => {
    test('It should change the location on redirect.', () => {
        redirect('/jobs');

        expect(window.location.assign).toHaveBeenCalledWith('/jobs');
    });

    test('It should not change the location if the URL is the same.', () => {
        redirect('/');
        expect(window.location.assign).not.toHaveBeenCalled();
    });
});
