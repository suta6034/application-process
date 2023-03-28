import CardCvSkills from './CardCvSkills';

import {
    shallowMount,
} from '../../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');

const storeMocks = createStoreMocks();

storeMocks.store.state.profile.skill.rows = [
    { id: 23, label: 'Foo', level: { id: 10, label: 'Bar' } },
    { id: 24, label: 'Foo', level: { id: 11, label: 'Bar' } },
    { id: 25, label: 'Foo', level: { id: 12, label: 'Bar' } },
    { id: 26, label: 'Foo', level: { id: 13, label: 'Bar' } },
    { id: 27, label: 'Foo', level: { id: 14, label: 'Bar' } },
    { id: 28, label: 'Foo', level: { id: 15, label: 'Bar' } },
];

describe('CardCvSkills', () => {
    function wrapperFactory() {
        return shallowMount(CardCvSkills, {
            store: storeMocks.store,
        });
    }

    test('It should render an app card.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.find('[data-qa="skills card"]').exists()).toBe(true);
    });

    test('It should render a maximum of 5 skill pills.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.findAll('[data-qa="pill"]').length).toBe(5);
    });

    test('It should render one show more pill.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.findAll('[data-qa="more pill"]').length).toBe(1);
    });

    test('It should render an empty state.', async () => {
        const wrapper = wrapperFactory();
        storeMocks.store.state.profile.skill.rows = [];

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="skill pills"]')).toBe(false);
        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });
});
