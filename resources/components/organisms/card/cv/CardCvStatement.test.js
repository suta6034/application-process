import CardCvStatement from './CardCvStatement';

import {
    mount,
} from '../../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');

const storeMocks = createStoreMocks();

storeMocks.store.state.profile.statement = {
    statement: 'Ich bin eine kreative Person.',
};

describe('CardCvStatement', () => {
    function wrapperFactory() {
        return mount(CardCvStatement, {
            store: storeMocks.store,
        });
    }

    test('It should render an app card.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.find('[data-qa="statement card"]').exists()).toBe(true);
    });

    test('It should render the statement text.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.contains('[data-qa="statement"]')).toBe(true);
    });

    test('It should render the empty state.', async () => {
        const wrapper = wrapperFactory();
        storeMocks.store.state.profile.statement = {
            statement: '',
        };

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="statement"]')).toBe(false);
        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });
});
