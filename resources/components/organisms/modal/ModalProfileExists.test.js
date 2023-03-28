import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalProfileExists from './ModalProfileExists';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import mitt from '../../../utils/mitt';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');
jest.mock('../../../utils/mitt', () => ({ emit: jest.fn() }));

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalProfileExists, {
        mocks: {
            $router: { resolve: () => ({ href: '' }) },
        },
        store: storeMocks.store,
        propsData: { email: 'foo@bar.com' },
    });
});

describe('ModalProfileExists', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should emit an event when clicking the decline button.', () => {
        wrapper.find('[data-qa="decline button"]').trigger('click');

        expect(mitt.emit).toBeCalledWith('modal-profile-exists-decline');
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
