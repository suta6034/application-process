import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';
import store from '../../../../store';
import FormCvTraining from './FormCvTraining';
import {
    mount,
} from '../../../../../tests/app/vue/utils';
import {
    DEFAULT_ROW,
} from '../../../../store/modules/forms/training';

jest.mock('../../../../store');

let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

const mockRouter = {
    push: jest.fn(),
};

beforeEach(() => {
    wrapper = mount(FormCvTraining, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
        },
    });
});

describe('FormCvTraining', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe(('Adding a new training'), () => {
        test('It should clear the form on initial load.', () => {
            store.state.profile.training.rows[0].title = 'Foo';

            wrapper = mount(FormCvTraining, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
            });

            expect(store.state.profile.training.rows[0].title).toBe('');
        });

        test('It should provide an empty training if no training is loaded.', () => {
            expect(wrapper.vm.trainings[0]).toEqual(DEFAULT_ROW);
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

            wrapper = mount(FormCvTraining, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
            });

            expect(wrapper.vm.trainings[wrapper.vm.trainings.length - 1]).toEqual(DEFAULT_ROW);
            expect(wrapper.vm.title).toBe(DEFAULT_ROW.title);
        });
    });

    describe(('Editing an existing training'), () => {
        test('It shouldn\'t clear the form on initial load.', () => {
            store.state.profile.training.rows[0].title = 'Foo';

            wrapper = mount(FormCvTraining, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 1 },
            });

            expect(store.state.profile.training.rows[0].title).toBe('Foo');
        });

        test('It should provide the data of the given training for editing.', () => {
            store.state.profile.training.rows = [{
                ...DEFAULT_ROW,
                title: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvTraining, {
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

            expect(wrapper.vm.title).toEqual('something');
        });

        test('It should mark the form as dirty after the form was edited.', () => {
            expect(wrapper.vm.dirty).toBe(false);
            const title = wrapper.find('[data-qa="title"]');

            title.element.value = 'fooBarBaz';
            title.trigger('input');
            title.trigger('blur');

            expect(wrapper.vm.dirty).toBe(true);
        });

        test('It should write the data of the given training to the store.', () => {
            store.state.profile.training.rows = [{
                ...DEFAULT_ROW,
                title: 'something',
                id: 123,
            }, {
                ...DEFAULT_ROW,
            }];
            wrapper = mount(FormCvTraining, {
                localVue,
                store,
                mocks: {
                    $router: mockRouter,
                    $t: jest.fn(),
                },
                propsData: { id: 123 },
            });

            expect(wrapper.vm.title).toEqual('something');
            const title = wrapper.find('[data-qa="title"]');

            title.element.value = 'fooBar';
            title.trigger('input');
            title.trigger('blur');
            expect(wrapper.vm.title).toEqual('fooBar');
            expect(store.state.profile.training.rows[0].title).toEqual('fooBar');
        });
    });
});
