import CardCvInterests from './CardCvInterests';

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

storeMocks.store.state.profile.interest.rows = [
    { id: 23, label: 'Foo' },
    { id: 24, label: 'Foo' },
    { id: 25, label: 'Foo' },
    { id: 26, label: 'Foo' },
    { id: 27, label: 'Foo' },
    { id: 28, label: 'Foo' },
];

describe('CardCvInterests', () => {
    function wrapperFactory() {
        return shallowMount(CardCvInterests, {
            store: storeMocks.store,
        });
    }

    test('It should render an app card.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.find('[data-qa="interests card"]').exists()).toBe(true);
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
        storeMocks.store.state.profile.interest.rows = [];

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="interests pills"]')).toBe(false);
        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });
});
