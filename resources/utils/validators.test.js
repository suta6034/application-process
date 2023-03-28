import {
    dateRange,
    fileSize,
    fileType,
    isoDate,
    maxDate,
    minDate,
    validateEmoji,
    validateIf,
} from './validators';

const fooValidate = () => {};

describe('dateRange()', () => {
    test('It should return `true` if the value is undefined or null.', () => {
        expect(dateRange().$validator()).toBe(true);
        expect(dateRange().$validator(null)).toBe(true);
    });

    test('It should return `true` if the start date is equal to the end date.', () => {
        expect(dateRange('2017-10-12 12:00:00', '2017-10-12 12:00:00').$validator('2017-10-12 12:00:00')).toBe(true);
    });

    test('It should return `true` if the start date is lower than the end date.', () => {
        expect(dateRange('2016-10-12 12:00:00', '2017-10-12 12:00:00').$validator('2017-10-12 12:00:00')).toBe(true);
    });

    test('It should return `false` if the start date is higher than the end date.', () => {
        expect(dateRange('2018-10-12 12:00:00', '2017-10-12 12:00:00').$validator('2018-10-12 12:00:00')).toBe(false);
    });
});

describe('fileSize()', () => {
    test('It should return `true` if the value is undefined or null or empty.', () => {
        expect(fileSize().$validator()).toBe(true);
        expect(fileSize().$validator(null)).toBe(true);
    });

    test('It should return `true` if the size is smaller or equal to the max size than.', () => {
        expect(fileSize(1000).$validator({ size: 900 })).toBe(true);
        expect(fileSize(1000).$validator({ size: 1000 })).toBe(true);
    });

    test('It should return `false` if the size larger than the max size.', () => {
        expect(fileSize(1000).$validator({ size: 1001 })).toBe(false);
    });
});

describe('fileType()', () => {
    test('It should return `true` if the value is undefined or null or empty.', () => {
        expect(fileType().$validator()).toBe(true);
        expect(fileType().$validator(null)).toBe(true);
    });

    test('It should return `true` if no type property is given (for IE compatibility).', () => {
        expect(fileType().$validator({})).toBe(true);
    });

    test('It should return `true` if the accepted types include the file type.', () => {
        expect(fileType(['image/jpeg']).$validator({ type: 'image/jpeg' })).toBe(true);
    });

    test('It should return `false` if the accepted types do not include the file type.', () => {
        expect(fileType(['document/pdf']).$validator({ type: 'image/jpeg' })).toBe(false);
    });
});

describe('maxDate()', () => {
    test('It should return `true` if the value is undefined or null.', () => {
        expect(maxDate().$validator()).toBe(true);
        expect(maxDate().$validator(null)).toBe(true);
    });

    test('It should return `true` if the given date is smaller than the max date.', () => {
        expect(maxDate(new Date('2018-10-20')).$validator('2017-11-13')).toBe(true);
    });

    test('It should return `true` if the given date is equal to the max date.', () => {
        expect(maxDate(new Date('2017-11-11')).$validator('2017-11-11')).toBe(true);
    });

    test('It should return `false` if the given date is bigger than the max date.', () => {
        expect(maxDate(new Date('2018-12-23')).$validator('2070-10-10')).toBe(false);
    });
});

describe('minDate()', () => {
    test('It should return `true` if the value is undefined or null.', () => {
        expect(minDate().$validator()).toBe(true);
        expect(minDate().$validator(null)).toBe(true);
    });

    test('It should return `true` if the given date is larger than the min date.', () => {
        expect(minDate(new Date('1900-10-10')).$validator('1901-01-01')).toBe(true);
    });

    test('It should return `true` if the given date is equal to the min date.', () => {
        expect(minDate(new Date('2017-01-03')).$validator('2017-01-03')).toBe(true);
    });

    test('It should return `false` if the given date is smaller than the max date.', () => {
        expect(minDate(new Date('2000-05-06')).$validator('1999-02-03')).toBe(false);
    });
});

describe('isoDate()', () => {
    test('It should return `true` if the value is undefined or null.', () => {
        expect(isoDate().$validator()).toBe(true);
        expect(isoDate().$validator(null)).toBe(true);
    });

    test('It should return `true` if all parts of the date are valid.', () => {
        expect(isoDate().$validator('0000-01-01T00:00:00+00:00')).toBe(true);
    });

    test('It should return `false` if the year is invalid.', () => {
        expect(isoDate().$validator('aaaa-01-01T00:00:00+00:00')).toBe(false);
    });

    test('It should return `true` if the year is invalid but disabled.', () => {
        expect(isoDate(false).$validator('aaaa-01-01T00:00:00+00:00')).toBe(true);
    });

    test('It should return `false` if the month is invalid.', () => {
        expect(isoDate().$validator('0000-00-01T00:00:00+00:00')).toBe(false);
        expect(isoDate().$validator('0000-13-01T00:00:00+00:00')).toBe(false);
        expect(isoDate().$validator('0000-1a-01T00:00:00+00:00')).toBe(false);
    });

    test('It should return `true` if the month is invalid but disabled.', () => {
        expect(isoDate(true, false).$validator('0000-0a-01T00:00:00+00:00')).toBe(true);
    });

    test('It should return `false` if the day is invalid.', () => {
        expect(isoDate().$validator('0000-01-00T00:00:00+00:00')).toBe(false);
        expect(isoDate().$validator('0000-01-32T00:00:00+00:00')).toBe(false);
        expect(isoDate().$validator('0000-01-1aT00:00:00+00:00')).toBe(false);
    });

    test('It should return `true` if the day is invalid but disabled.', () => {
        expect(isoDate(true, true, false).$validator('0000-01-0aT00:00:00+00:00')).toBe(true);
    });
});

describe('validateIf()', () => {
    test('It should return a ValidationRuleWithParams if the condition is `true`.', () => {
        const condition = true;
        const result = validateIf(condition, fooValidate);
        expect(result).toEqual({
            $validator: expect.any(Function),
            $params: expect.anything(),
        });
    });

    test('It should return a ValidationRuleWithParams if the condition is `false`.', () => {
        const condition = false;
        const result = validateIf(condition, fooValidate);
        expect(result).toEqual({
            $validator: expect.any(Function),
            $params: expect.anything(),
        });
    });
});

describe('validateEmoji()', () => {
    test('It should return `false` if the value contains an emoji character.', () => {
        const text = 'Lorem 😄 ipsum';
        const result = validateEmoji(text);
        expect(result).toBe(false);
    });

    test('It should return `true` if the value contains no emoji character.', () => {
        const text = 'Lorem ipsum';
        const result = validateEmoji(text);
        expect(result).toBe(true);
    });
});
