import {
    getCookie,
    setCookie,
    eraseCookie,
} from './cookie';

beforeEach(() => {
    // Erase cookies.
    document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0];
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
});

describe('getCookie()', () => {
    test('Trying to get a cookie which doesn\'t exist should return null.', () => {
        document.cookie = 'Loremipsumdolorsit=oberlehner';
        document.cookie = 'Loremipsumdol=';
        document.cookie = 'orsit=';

        expect(getCookie('oberlehner')).toBeNull();
    });

    test('Trying to get a cookie which exists should return the value.', () => {
        document.cookie = 'Loremipsumdolorsit=2';
        document.cookie = 'oberlehner=super';
        document.cookie = 'asdfjkl=jk';

        expect(getCookie('oberlehner')).toBe('super');
    });
});

describe('setCookie()', () => {
    test('It sould set a valid cookie with the given name and value.', () => {
        setCookie({ name: 'foo', value: 'bar' });

        expect(document.cookie).toBe('foo=bar');
    });

    test('It sould set a valid cookie with the given name, value and expiration date.', () => {
        const cookieSetter = jest.spyOn(Object.getPrototypeOf(document), 'cookie', 'set');
        jest.spyOn(window.Date, 'now').mockImplementation(() => 1520947948898); // 13.03.2018
        setCookie({ name: 'foo', value: 'bar', expires: 3600 });

        expect(cookieSetter).toBeCalledWith('foo=bar;expires=Tue, 13 Mar 2018 14:32:28 GMT;path=/');
    });
});

describe('eraseCookie()', () => {
    test('Trying to delete a cookie which doesn\'t exist should return null.', () => {
        document.cookie = 'Loremipsumdolorsit=triepl';
        document.cookie = 'Loremipsumdol=';

        expect(eraseCookie('triepl')).toBeUndefined();
    });

    test('Trying to delte a cookie which exists.', () => {
        document.cookie = 'masterCookie=2';
        document.cookie = 'triepl=super';

        expect(getCookie('triepl')).toBe('super');
        eraseCookie('triepl');
        expect(getCookie('triepl')).toBe('');
    });
});
