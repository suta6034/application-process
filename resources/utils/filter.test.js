import fakeTimers from '@sinonjs/fake-timers';
import {
    formatDate,
    formatFileSize,
    formatUrl,
    parseDate,
    sanitizeUrl,
    truncate,
    yearsSince,
} from './filter';

describe('filter', () => {
    describe('url', () => {
        describe('formatUrl()', () => {
            test('It should be a function.', () => {
                expect(typeof formatUrl).toBe('function');
            });

            test('It should return a clean version of the url, without https.', () => {
                expect(formatUrl('https://www.foobar.com')).toBe('www.foobar.com');
            });

            test('It should return a clean version of the url, without http.', () => {
                expect(formatUrl('http://www.foobar.com')).toBe('www.foobar.com');
            });

            test('It should return a sanitized version of the url, with a lowercase protocol and host.', () => {
                expect(sanitizeUrl('HTTPs://wWw.fooBAR.coM')).toBe('https://www.foobar.com/');
            });
        });
    });

    describe('date', () => {
        describe('parseDate()', () => {
            test('It should be a function.', () => {
                expect(typeof parseDate).toBe('function');
            });

            test('It should return an empty object if the given value is falsy.', () => {
                expect(parseDate(null)).toEqual({});
            });

            test('It should parse a date with positive time zone.', () => {
                expect(parseDate('1986-04-17T22:00:00+0100')).toEqual({
                    year: '1986',
                    month: '04',
                    day: '17',
                    time: '22:00:00',
                    timeZone: '+0100',
                });
            });

            test('It should parse a date with negative time zone.', () => {
                expect(parseDate('1986-04-17T22:00:00-0100')).toEqual({
                    year: '1986',
                    month: '04',
                    day: '17',
                    time: '22:00:00',
                    timeZone: '-0100',
                });
            });
        });

        describe('formatDate()', () => {
            test('It should be a function.', () => {
                expect(typeof formatDate).toBe('function');
            });

            test('It should return a short textual representation of a month, three letters.', () => {
                expect(formatDate({ format: 'M', date: '1988-09-07T22:00:00+0100' })).toBe('Sep');
            });

            test('It should return a full numeric representation of a year, 4 digits.', () => {
                expect(formatDate({ format: 'Y', date: '1988-09-07T22:00:00+0100' })).toBe('1988');
            });

            test('It should return a combination of short month and 4 digits year.', () => {
                expect(formatDate({ format: 'M Y', date: '1988-09-07T22:00:00+0100' })).toBe('Sep 1988');
            });

            test('It should return a combination of short month and 4 digits.', () => {
                expect(formatDate({ format: 'M Y', date: '1988-05-07T22:00:00+0100' })).toBe('Mai 1988');
            });

            test('It should handle invalid months gracefully.', () => {
                expect(formatDate({ format: 'F Y', date: '0000-00-00T22:00:00+0100' })).toBe('Jänner 0000');
                expect(formatDate({ format: 'M Y', date: '0000-00-00T22:00:00+0100' })).toBe('Jän 0000');
            });
        });

        describe('yearsSince()', () => {
            test('It should be a function.', () => {
                expect(typeof yearsSince).toBe('function');
            });

            test('It should return null if no data is given.', () => {
                expect(yearsSince(undefined)).toBe(null);
            });

            test('It should return the number of years which have passed since the given date.', () => {
                const clock = fakeTimers.install({ now: 1487076708000 }); // 14.02.2017

                expect(yearsSince('1988-09-07T22:00:00+0100')).toBe(28);
                expect(yearsSince('1992-10-08T22:00:00+0100')).toBe(24);
                expect(yearsSince('1995-12-12T22:00:00+0100')).toBe(21);
                expect(yearsSince('1995-01-12T22:00:00+0100')).toBe(22);
                expect(yearsSince('1995-02-12T22:00:00+0100')).toBe(22);

                clock.uninstall();
            });
        });

        describe('string', () => {
            describe('truncate()', () => {
                test('It should be a function.', () => {
                    expect(typeof truncate).toBe('function');
                });

                test('It should return the given string if the string is shorter or equal the given length.', () => {
                    expect(truncate('test', 5)).toBe('test');
                });

                // eslint-disable-next-line max-len
                test('It should return the shorted string with ellipsis if the string is longer than the given length.', () => {
                    expect(truncate('longWordWithoutSpace', 5)).toBe('longW...');
                });
            });
        });

        describe('file', () => {
            describe('formatFileSize()', () => {
                test('It should be a function.', () => {
                    expect(typeof formatFileSize).toBe('function');
                });

                test('It should return `O Byte` if file size is 0.', () => {
                    expect(formatFileSize(0)).toBe('0 Byte');
                });

                test('It should return `43 Bytes` if file size is 43.', () => {
                    const size = 43;
                    expect(formatFileSize(size)).toBe('43 Bytes');
                });

                test('It should return `1 KB` if file size is 1024.', () => {
                    expect(formatFileSize(1024)).toBe('1 KB');
                });

                test('It should return `2.49 KB` if file size is 2548.', () => {
                    expect(formatFileSize(2548)).toBe('2.49 KB');
                });

                test('It should return `1 MB` if file size is 1048576.', () => {
                    expect(formatFileSize(1048576)).toBe('1 MB');
                });
            });
        });
    });
});
