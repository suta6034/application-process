import CardCvLanguage from './CardCvLanguage';

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

storeMocks.store.state.profile.language.rows = [
    { id: 23, label: 'Foo', languageId: 234, level: { id: 10, label: 'Bar' } },
    { id: 24, label: 'Foo', languageId: 232, level: { id: 11, label: 'Bar' } },
    { id: 25, label: 'Foo', languageId: 237, level: { id: 12, label: 'Bar' } },
    { id: 26, label: 'Foo', languageId: 233, level: { id: 13, label: 'Bar' } },
    { id: 27, label: 'Foo', languageId: 236, level: { id: 14, label: 'Bar' } },
    { id: 28, label: 'Foo', languageId: 235, level: { id: 15, label: 'Bar' } },
];

describe('CardCvLanguage', () => {
    function wrapperFactory() {
        return shallowMount(CardCvLanguage, {
            store: storeMocks.store,
        });
    }

    test('It should render a `<appcard-stub>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.find('[data-qa="language card"]').exists()).toBe(true);
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
        storeMocks.store.state.profile.language.rows = [];

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="language pills"]')).toBe(false);
        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });
});
