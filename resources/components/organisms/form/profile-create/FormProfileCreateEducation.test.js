import Vuex from 'vuex';

import {
    nextTick,
} from 'vue';
import FormProfileCreateEducation from './FormProfileCreateEducation';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';
import {
    EDUCATION_CATEGORY_APPRENTICE,
    EDUCATION_TYPE_OTHER,
} from '../../../../services/education';
import store from '../../../../store';

jest.mock('../../../../store');
jest.useFakeTimers();

let wrapper;

localVue.use(Vuex);

beforeEach(() => {
    store.state.profileCreate.education.rows[0].category = {};
    store.state.profileCreate.education.rows[0].type = {};
    store.state.profileCreate.forceValidation = { key: '', time: 0 };

    wrapper = mount(FormProfileCreateEducation, {
        localVue,
        store,
        mocks: {
            $t: jest.fn(),
        },
    });
});

describe('FormProfileCreateEducation', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should reset the training company, when the category is changed to something else.', async () => {
        store.state.profileCreate.education.rows[0].category = {
            id: EDUCATION_CATEGORY_APPRENTICE,
        };
        await nextTick();
        store.state.profileCreate.education.rows[0].trainingCompany = 'foo';
        store.state.profileCreate.education.rows[0].category.id = 1;

        await nextTick();

        expect(store.state.profileCreate.education.rows[0].trainingCompany).toBe('');
    });

    test('It should reset the custom type, when the type is changed to something else.', async () => {
        store.state.profileCreate.education.rows[0].type = {
            id: EDUCATION_TYPE_OTHER,
        };
        await wrapper.vm.$nextTick();
        store.state.profileCreate.education.rows[0].customType = 'foo';
        store.state.profileCreate.education.rows[0].type.id = 1;

        await wrapper.vm.$nextTick();

        expect(store.state.profileCreate.education.rows[0].customType).toBe('');
    });

    test('It should reset the name, when it is hidden.', async () => {
        store.state.profileCreate.education.rows[0].name = 'foo';
        store.state.profileCreate.education.rows[0].category = {
            id: EDUCATION_CATEGORY_APPRENTICE,
        };

        await wrapper.vm.$nextTick();

        expect(store.state.profileCreate.education.rows[0].name).toBe('');
    });

    describe('Education date input', () => {
        test('It should focus the end date after entering the start date year.', async () => {
            const startYearField = wrapper.find('[data-qa="education start"] [data-qa="year field"]');
            startYearField.element.value = '1988';
            startYearField.trigger('input');

            jest.runOnlyPendingTimers();

            expect(wrapper.contains('[data-qa="education end"] [data-qa="month field"]:focus')).toBe(true);
        });
    });

    describe('computed', () => {
        describe('educationTypesByActiveEducationCategory()', () => {
            test('It should return the education types matching the active education category.', () => {
                store.state.profileCreate.education.rows[0].category = { id: 1 };

                expect(wrapper.vm.educationTypesByActiveEducationCategory).toEqual([
                    {
                        label: 'Foo',
                        parentId: 1,
                    },
                    {
                        label: 'Bar',
                        parentId: 1,
                    },
                ]);
            });

            test('It should return an empty array if no education category is set.', () => {
                expect(wrapper.vm.educationTypesByActiveEducationCategory).toEqual([]);
            });
        });

        describe('educationTypeOtherSelected()', () => {
            test('It should return true if the current education type is `other`.', () => {
                store.state.profileCreate.education.rows[0].type = { id: EDUCATION_TYPE_OTHER };

                expect(wrapper.vm.educationTypeOtherSelected).toBe(true);
            });

            test('It should return false if the current education type is not set.', () => {
                expect(wrapper.vm.educationTypeOtherSelected).toBe(false);
            });
        });
    });
});
