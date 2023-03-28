import {
    mount,
} from '../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import ModalMotivationLetterForbiddenDelete from './ModalMotivationLetterForbiddenDelete';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalMotivationLetterForbiddenDelete, {
        store: storeMocks.store,
        propsData: { mutation: 'foo/bar', id: '1' },
    });
});

describe('ModalMotivationLetterForbiddenDelete', () => {
    test('It should render a `<LAYOUTMODAL>`.', () => {
        expect(wrapper.element.tagName).toBe('LAYOUTMODAL');
    });

    test('It should render the default body.', () => {
        expect(wrapper.find('[data-qa="text default"]').exists()).toBe(true);
    });

    test('It should hide the modal when the cancel button is clicked.', () => {
        wrapper.vm.hide();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
