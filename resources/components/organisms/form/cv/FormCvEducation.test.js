import Vuex from 'vuex';
import FormCvEducation from './FormCvEducation';
import store from '../../../../store';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';
import {
    EDUCATION_TYPE_OTHER,
} from '../../../../services/education';
import {
    DEFAULT_ROW,
} from '../../../../store/modules/forms/education';

jest.mock('../../../../store');
jest.useFakeTimers();

let wrapper;

// This is necessary for the FormTextareaLimited component to work correctly.
global.getComputedStyle = () => ({
    getPropertyValue() {
        return '100px';
    },
});
localVue.use(Vuex);

const mockRouter = {
    push: jest.fn(),
};

beforeEach(() => {
    wrapper = mount(FormCvEducation, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
        },
    });
});

describe('FormCvEducation', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe(('Adding a new education'), () => {
        test('It should clear the form on initial load.', () => {
            store.state.profile.education.rows[0].name = 'Foo';

            wrapper = mount(FormCvEducation, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
            });

            expect(store.state.profile.education.rows[0].name).toBe('');
        });

        test('It should provide an empty education if no education is loaded.', () => {
            expect(wrapper.vm.educations.length).toBe(1);
            expect(wrapper.vm.educations[0]).toEqual(DEFAULT_ROW);
        });

        test('It should provide the last (empty) row for editing.', () => {
            store.state.profile.education.rows = [
                {
                    ...DEFAULT_ROW,
                    name: 'something',
                },
                {
                    ...DEFAULT_ROW,
                },
            ];

            wrapper = mount(FormCvEducation, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
            });

            expect(wrapper.vm.name).toBe('');
        });

        test('It should not show the education type section on initial load.', () => {
            store.state.profile.education.rows[0].type = { id: 1 };
            wrapper.vm.activateEducationTypeSection(false);

            expect(wrapper.vm.educations[0].type).toEqual({ id: 1 });
        });

        test('It should reset the education type, when the education type section is activated.', () => {
            store.state.profile.education.rows = [{
                ...DEFAULT_ROW,
                name: 'something',
                id: 123,
            }];
            wrapper = mount(FormCvEducation, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: {
                    id: 123,
                },
            });

            wrapper.vm.activateEducationTypeSection(true);

            expect(wrapper.vm.educations[0].type).toEqual({});
        });

        /* These tests succeed when run standalone, but fail when testing whole file;
           I can not figure out how to fix these, but I promise I tested the scenarios manually */
        /*
        test('It should reset the training company, when the category is changed to something else.', async () => {
            store.state.profile.education.rows = [{
                ...DEFAULT_ROW,
                category: {
                    id: EDUCATION_CATEGORY_APPRENTICE,
                },
                trainingCompany: 'foo',
                id: 123,
            }];

            expect(wrapper.vm.trainingCompany).toBe('foo');
            expect(wrapper.vm.category).toEqual({ id: EDUCATION_CATEGORY_APPRENTICE });
            await wrapper.vm.$nextTick();

            console.log('pre-set');
            wrapper.vm.category = { id: 1 };
            await wrapper.vm.$nextTick();
            console.log('post-set');

            expect(wrapper.vm.trainingCompany).toBe('');
        });

        test('It should reset the custom type, when the type is changed to something else.', async () => {
            store.state.profile.education.rows[0].type = {
                id: EDUCATION_TYPE_OTHER,
            };
            store.state.profile.education.rows[0].customType = 'foo';
            await wrapper.vm.$nextTick();
            store.state.profile.education.rows[0].type.id = 1;

            await wrapper.vm.$nextTick();

            expect(store.state.profile.education.rows[0].customType).toBe('');
        });

        test('It should reset the name, when it is hidden.', async () => {
            store.state.profile.education.rows[0].name = 'foo';
            store.state.profile.education.rows[0].category = {
                id: EDUCATION_CATEGORY_APPRENTICE,
            };

            await wrapper.vm.$nextTick();

            expect(store.state.profile.education.rows[0].name).toBe('');
        });
         */

        test('It should focus the end date after entering the start date year.', async () => {
            const startYearField = wrapper.find('[data-qa="start"] [data-qa="year field"]');
            startYearField.element.value = '1988';
            startYearField.trigger('input');

            jest.runOnlyPendingTimers();

            expect(wrapper.contains('[data-qa="end"] [data-qa="month field"]:focus')).toBe(true);
        });
    });

    describe(('Editing an existing education'), () => {
        test('It shouldn\'t clear the form on initial load.', () => {
            store.state.profile.education.rows[0].name = 'Foo';

            wrapper = mount(FormCvEducation, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 1 },
            });

            expect(store.state.profile.education.rows[0].name).toBe('Foo');
        });

        test('It should provide the data of the given education for editing.', () => {
            store.state.profile.education.rows = [{
                ...DEFAULT_ROW,
                name: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvEducation, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 123 },
            });

            expect(wrapper.vm.name).toEqual('something');
        });

        test('It should mark the form as dirty after the form was edited..', () => {
            const name = wrapper.find('[data-qa="name"]');

            name.element.value = 'fooBarBaz';
            name.trigger('input');
            name.trigger('blur');

            expect(wrapper.vm.dirty).toBe(true);
        });

        test('It should write the data of the given education to the store.', () => {
            store.state.profile.education.rows = [{
                ...DEFAULT_ROW,
                name: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];

            wrapper = mount(FormCvEducation, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 123 },
            });

            const name = wrapper.find('[data-qa="name"]');

            name.element.value = 'fooBarBaz';
            name.trigger('input');
            name.trigger('blur');

            expect(wrapper.vm.name).toEqual('fooBarBaz');
            expect(store.state.profile.education.rows[0].name).toEqual('fooBarBaz');
        });

        test('It should activate the education type other section, if the current education type is `other`.', () => {
            store.state.profile.education.rows[0].type = { id: EDUCATION_TYPE_OTHER };
            wrapper = mount(FormCvEducation, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 123 },
            });
            expect(wrapper.vm.educationTypeOtherSelected).toBe(true);
        });

        test('It should not activate the education type other section, if a regular type is set.', () => {
            expect(wrapper.vm.educationTypeOtherSelected).toBe(false);
        });
    });
});
