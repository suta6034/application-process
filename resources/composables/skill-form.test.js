import {
    mount,
} from '../../tests/app/vue/utils';

import {
    useSkillForm,
} from './skill-form';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../store';
import MockComponent from '../components/__mocks__/SkillForm';

jest.mock('../store');

let wrapper;

let storeMocks;
beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.skill.rows = [{
        id: 1,
        label: 'Foo',
        level: {
            id: 10,
            label: 'Bar',
        },
    }];
    wrapper = mount(MockComponent, {
        store: storeMocks.store,
    });
});

describe('skillForm', () => {
    test('It should be an object.', () => {
        expect(typeof useSkillForm).toBe('function');
    });

    test('It should render the given skills as selected options.', () => {
        expect(wrapper.findAll('[data-qa="selected option"]').length).toBe(1);
        expect(wrapper.find('[data-qa="selected option"]').text().includes('Foo')).toBe(true);
    });

    /*
    test('It should update the skills when the selected options are updated.', async () => {
        wrapper.find('input').setValue('Qux');
        wrapper.find('input').trigger('keydown.enter');

        await nextTick();

        expect(wrapper.find('[data-qa="selected option"]:nth-child(2)').text().includes('Qux')).toBe(true);
    });
     */
});
