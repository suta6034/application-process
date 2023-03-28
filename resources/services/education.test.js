import {
    educationCategoriesGet,
    educationTypesGet,
} from './education';

jest.mock('../data/education-types.json', () => ({
    'Education Category 1': [
        {
            id: 1,
            label: 'Education Type 1',
        },
        {
            id: 2,
            label: 'Education Type 2',
        },
    ],
    'Education Category 2': [
        {
            id: 3,
            label: 'Education Type 3',
        },
        {
            id: 4,
            label: 'Education Type 4',
        },
    ],
}));

describe('educationCategoriesGet()', () => {
    test('It should be a function.', () => {
        expect(typeof educationCategoriesGet).toBe('function');
    });

    test('It should return an array of education categories.', async () => {
        const expectedResult = [
            {
                id: 'Education Category 1',
                label: 'Education Category 1',
            },
            {
                id: 'Education Category 2',
                label: 'Education Category 2',
            },
        ];

        expect(await educationCategoriesGet()).toEqual(expectedResult);
    });
});

describe('educationTypesGet()', () => {
    test('It should be a function.', () => {
        expect(typeof educationTypesGet).toBe('function');
    });

    test('It should return an array of education types.', async () => {
        const expectedResult = [
            {
                id: 1,
                label: 'Education Type 1',
                parentId: 'Education Category 1',
            },
            {
                id: 2,
                label: 'Education Type 2',
                parentId: 'Education Category 1',
            },
            {
                id: 3,
                label: 'Education Type 3',
                parentId: 'Education Category 2',
            },
            {
                id: 4,
                label: 'Education Type 4',
                parentId: 'Education Category 2',
            },
        ];

        expect(await educationTypesGet()).toEqual(expectedResult);
    });
});
