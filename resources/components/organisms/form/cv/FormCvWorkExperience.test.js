import Vuex from 'vuex';

import {
    nextTick,
} from 'vue';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';
import store from '../../../../store';

import FormCvWorkExperience from './FormCvWorkExperience';
import {
    DEFAULT_ROW,
} from '../../../../store/modules/forms/work';

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
    window.scrollTo = jest.fn();

    store.state.profile.hasWorkExperience = true;

    wrapper = mount(FormCvWorkExperience, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
            $randomFieldId: jest.fn(),
        },
    });
});

describe('FormCvWorkExperience', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    describe('Date input', () => {
        test('It should focus the end date after entering the start date year.', () => {
            const startYearField = wrapper.find('[data-qa="start"] [data-qa="year field"]');
            startYearField.element.value = '1988';
            startYearField.trigger('input');

            jest.runOnlyPendingTimers();

            expect(wrapper.find('[data-qa="end"] [data-qa="month field"]:focus').exists()).toBe(true);
        });
    });

    describe(('Adding a new work experience'), () => {
        test('It should clear the form on initial load.', async () => {
            store.state.profile.work.rows[0].title = 'foo';

            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
            });

            expect(store.state.profile.work.rows[0].title).toEqual('');
        });

        test('It should provide an empty work experience if no experience is loaded.', () => {
            expect(wrapper.vm.workRows.length).toBe(1);
            expect(wrapper.vm.workRows[0]).toEqual(DEFAULT_ROW);
        });

        test('It should provide the last (empty) row for editing.', () => {
            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
                computed: {
                    work() {
                        return {
                            id: null,
                            title: 'Bar',
                            category: { id: 1, label: 'Berufserfahrung' },
                        };
                    },
                },
            });

            expect(wrapper.vm.work).toEqual({
                id: null,
                title: 'Bar',
                category: { id: 1, label: 'Berufserfahrung' },
            });
        });

        test('It should provide the category `Berufserfahrung` as default', async () => {
            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
            });

            expect(wrapper.find('.k-c-pill--active').element.innerHTML).toContain('Berufserfahrung');
        });

        test('It should have 5 selectable category pills', async () => {
            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
            });
            const workCategorySelect = wrapper.find('[data-qa="work category select"]');

            expect(workCategorySelect.exists()).toBe(true);
            expect(workCategorySelect.findAll('[data-qa="pill"]').length).toBe(5);
        });
    });

    describe(('Editing an existing work experience'), () => {
        test('It shouldn\'t clear the form on initial load.', () => {
            store.state.profile.work.rows[0].title = 'foo';

            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
                propsData: { id: 1 },
                computed: {
                    work() {
                        return {
                            id: null,
                            title: 'Bar',
                            category: { id: 1, label: 'Berufserfahrung' },
                        };
                    },
                },
            });

            expect(store.state.profile.work.rows[0].title).toBe('foo');
        });

        test('It should show work experience category pills to select', () => {
            store.state.profile.work.rows[0].title = 'foo';

            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
                propsData: { id: 1 },
                computed: {
                    work() {
                        return {
                            id: null,
                            title: 'Bar',
                            category: { id: 1, label: 'Berufserfahrung' },
                        };
                    },
                },
            });

            expect(wrapper.find('[data-qa="work category select"]').exists()).toBe(true);
        });

        test('It should provide the data of the given work for editing.', () => {
            store.state.profile.work.rows = [{
                ...DEFAULT_ROW,
                title: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
                propsData: { id: 123 },
            });

            expect(wrapper.vm.title).toBe('something');
        });

        test('It should write the data of the given work to the store.', () => {
            store.state.profile.work.rows = [{
                ...DEFAULT_ROW,
                description: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
                propsData: { id: 123 },
            });
            const description = wrapper.find('[data-qa="description"]');
            description.element.value = 'fooBar';
            description.trigger('input');
            description.trigger('blur');
            expect(wrapper.vm.description).toEqual('fooBar');
            expect(store.state.profile.work.rows[0].description).toEqual('fooBar');
        });

        test('It should reset the end date, if a user clicks on the checkbox.', async () => {
            store.state.profile.work.rows = [{
                ...DEFAULT_ROW,
                title: 'something',
                end: '0000-01-10T00:00:00+00:00',
                id: 123,
            }];
            store.state.profile.work.rows[0].end = '0000-01-10T00:00:00+00:00';
            wrapper = mount(FormCvWorkExperience, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                    $randomFieldId: jest.fn(),
                },
                propsData: { id: 123 },
            });
            expect(wrapper.vm.end).toBe('0000-01-10T00:00:00+00:00');
            wrapper.find('[data-qa="current checkbox"]').trigger('click');

            // Wait for update of date field value.
            await nextTick();
            expect(wrapper.vm.end).toBe(null);
        });
    });
});
