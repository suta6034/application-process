import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import LayoutDynamicModal from './LayoutDynamicModal';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';

jest.mock('../../store');
jest.mock('../../store/modules/components/popup');

let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;
    storeMocks.store.state.popup.showCloseButton = true;
});

function wrapperFactory({ propsData } = {}) {
    return shallowMount(LayoutDynamicModal, {
        propsData: {
            ...propsData,
        },
        store: storeMocks.store,
    });
}

describe('LayoutDynamicModal', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should close the modal when clicking the close button.', () => {
        const wrapper = wrapperFactory();
        wrapper.find('[data-qa="close button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It shouldn\'t close the modal when clicking the background and ignorable is false.', () => {
        const wrapper = wrapperFactory({
            propsData: {
                ignorable: false,
            },
        });

        wrapper.find('[data-qa="content"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).not.toBeCalled();
    });

    test('It should close the modal when clicking the background and ignorable is true.', () => {
        const wrapper = wrapperFactory({
            propsData: {
                ignorable: true,
            },
        });

        wrapper.find('[data-qa="content"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
