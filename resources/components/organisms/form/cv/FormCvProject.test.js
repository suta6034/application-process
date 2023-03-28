import Vuex from 'vuex';

import store from '../../../../store';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';

import FormCvProject from './FormCvProject';
import {
    DEFAULT_ROW,
} from '../../../../store/modules/forms/project';

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
    wrapper = mount(FormCvProject, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
        },
    });
});

describe('FormCvProject', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe('Date input', () => {
        test('It should focus the end date after entering the start date year.', () => {
            const startYearField = wrapper.find('[data-qa="start"] [data-qa="year field"]');
            startYearField.element.value = '1988';
            startYearField.trigger('input');

            jest.runOnlyPendingTimers();

            expect(wrapper.contains('[data-qa="end"] [data-qa="month field"]:focus')).toBe(true);
        });
    });

    describe(('Adding a new project'), () => {
        test('It should clear the form on initial load.', async () => {
            store.state.profile.project.rows[0].name = 'Foo';

            wrapper = mount(FormCvProject, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
            });

            await wrapper.vm.$nextTick();

            expect(store.state.profile.project.rows[0].name).toBe('');
        });

        test('It should provide an empty project if no project is loaded.', () => {
            expect(wrapper.vm.projects[0]).toEqual(DEFAULT_ROW);
        });

        test('It should provide the last (empty) row for editing.', () => {
            store.state.profile.project.rows = [
                {
                    ...DEFAULT_ROW,
                    name: 'something',
                    description: 'a description',
                },
                {
                    ...DEFAULT_ROW,
                },
            ];
            wrapper = mount(FormCvProject, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
            });

            expect(wrapper.vm.projects[wrapper.vm.projects.length - 1]).toEqual(DEFAULT_ROW);
            expect(wrapper.vm.name).toBe(DEFAULT_ROW.name);
        });
    });

    describe(('Editing an existing project'), () => {
        test('It shouldn\'t clear the form on initial load if id is supplied.', () => {
            store.state.profile.project.rows[0].name = 'Foo';

            wrapper = mount(FormCvProject, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 1 },
            });

            expect(store.state.profile.project.rows[0].name).toBe('Foo');
        });

        test('It should provide the data of the given project for editing.', () => {
            store.state.profile.project.rows = [{
                ...DEFAULT_ROW,
                name: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvProject, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 123 },
            });

            expect(wrapper.vm.name).toBe('something');
        });

        test('It should write the data of the given project to the store.', () => {
            store.state.profile.project.rows = [{
                ...DEFAULT_ROW,
                name: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvProject, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 123 },
            });
            const name = wrapper.find('.c-formInput__input');
            name.element.value = 'fooBar';
            name.trigger('input');
            name.trigger('blur');
            expect(wrapper.vm.name).toEqual('fooBar');
            expect(store.state.profile.project.rows[0].name).toEqual('fooBar');
        });

        test('It should mark the form as dirty after the form was edited.', () => {
            expect(wrapper.vm.dirty).toBe(false);
            const name = wrapper.find('[data-qa="name"]');

            name.element.value = 'fooBarBaz';
            name.trigger('input');
            name.trigger('blur');

            expect(wrapper.vm.dirty).toBe(true);
        });
    });
});
