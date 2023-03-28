import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    mount,
} from '../../../../tests/app/vue/utils';
import MinitaskImage from './MinitaskImage';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

describe('MinitaskImage', () => {
    beforeEach(() => {
        storeMocks = createStoreMocks();
        storeMocks.modules.popup.mutations.SHOW_POPUP.mockReset();

        wrapper = mount(MinitaskImage, {
            localVue,
            store: storeMocks.store,
            mocks: {
                $t: jest.fn(),
            },
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit a skip event when the skip-button is clicked.', () => {
        wrapper.find('[data-qa="skip button"]').trigger('click');
        expect(wrapper.emitted().skipped).toBeDefined();
    });

    test('It should render a save button.', () => {
        expect(wrapper.contains('[data-qa="save button"]')).toBe(true);
    });

    test('It should show the image editor overlay when a new image is selected.', () => {
        // Calling the method directly because simulating a file upload is tricky / impossible.
        wrapper.vm.openImageEditor({ target: { files: [new File(['foo'], 'foo')] } });
        expect(storeMocks.modules.popup.mutations.SHOW_POPUP).toBeCalled();
    });

    test('It should show the file upload when the upload button gets clicked.', () => {
        // Calling the method directly because simulating a file upload is tricky / impossible.
        wrapper.vm.openImageEditor({ target: {} });
        expect(storeMocks.modules.popup.mutations.SHOW_POPUP).toBeCalled();
    });
});
