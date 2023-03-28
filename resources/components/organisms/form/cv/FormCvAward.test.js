import Vuex from 'vuex';

import store from '../../../../store';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';

import FormCvAward from './FormCvAward';
import {
    DEFAULT_ROW,
} from '../../../../store/modules/forms/award';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');

let wrapper;

localVue.use(Vuex);

const mockRouter = {
    push: jest.fn(),
};

beforeEach(() => {
    wrapper = mount(FormCvAward, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
        },
    });
});

describe('FormCvAward', () => {
    test('It should render a `<div`.', () => {
        expect(wrapper.contains('div')).toBe(true);
    });

    describe(('Adding a new award'), () => {
        test('It should clear the form on initial load.', () => {
            store.state.profile.award.rows[0].name = 'Foo';

            wrapper = mount(FormCvAward, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
            });

            expect(store.state.profile.award.rows[0].name).toBe('');
        });

        test('It should provide an empty award if no award is loaded.', () => {
            expect(wrapper.vm.awards[0]).toEqual(DEFAULT_ROW);
            expect(wrapper.vm.name).toEqual(DEFAULT_ROW.name);
        });

        test('It should provide the last (empty) row for editing.', () => {
            store.state.profile.award.rows = [
                {
                    ...DEFAULT_ROW,
                    name: 'something',
                },
                {
                    ...DEFAULT_ROW,
                },
            ];

            wrapper = mount(FormCvAward, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
            });

            expect(wrapper.vm.name).toEqual('');
        });
    });

    describe(('Editing an existing award'), () => {
        test('It shouldn\'t clear the form on initial load.', () => {
            store.state.profile.award.rows[0].name = 'Foo';

            wrapper = mount(FormCvAward, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 1 },
            });

            expect(store.state.profile.award.rows[0].name).toBe('Foo');
        });

        test('It should provide the data of the given award for editing.', () => {
            store.state.profile.award.rows = [{
                ...DEFAULT_ROW,
                name: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvAward, {
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

        test('It should write the data of the given award to the store.', () => {
            store.state.profile.award.rows = [{
                ...DEFAULT_ROW,
                name: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvAward, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 123 },
            });

            expect(wrapper.vm.name).toEqual('something');
            const name = wrapper.find('[data-qa="name"]');

            name.element.value = 'fooBar';
            name.trigger('input');
            name.trigger('blur');
            expect(wrapper.vm.name).toEqual('fooBar');
            expect(store.state.profile.award.rows[0].name).toEqual('fooBar');
        });

        test('It should mark the form as dirty after the form was edited.', () => {
            const name = wrapper.find('[data-qa="name"]');

            name.element.value = 'fooBar';
            name.trigger('input');
            name.trigger('blur');

            expect(wrapper.vm.dirty).toBe(true);
        });
    });
});
