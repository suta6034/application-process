import {
    mount,
} from '../../../tests/app/vue/utils';

import LayoutModal from './LayoutModal';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';

jest.mock('../../store');
jest.mock('../../store/modules/components/popup');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;
    storeMocks.store.state.popup.showCloseButton = true;

    wrapper = mount(LayoutModal, {
        store: storeMocks.store,
    });
});

describe('LayoutModal', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should hide the modal when clicking the content background.', () => {
        wrapper.find('[data-qa="content"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It shouldn\'t hide the modal when clicking the content background if close button disabled.', () => {
        storeMocks.store.state.popup.showCloseButton = false;
        wrapper.find('[data-qa="content"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).not.toBeCalled();
    });

    test('It should hide the modal when clicking the close button.', () => {
        wrapper.find('[data-qa="close button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should render a headline if the slot `headline` is given.', () => {
        wrapper = mount(LayoutModal, {
            store: storeMocks.store,
            slots: {
                headline: '<p>foo bar</p>',
            },
        });

        expect(wrapper.contains('[data-qa="headline"]')).toBe(true);
    });

    test('It should render the actions if the slot `actions` is given.', () => {
        wrapper = mount(LayoutModal, {
            store: storeMocks.store,
            slots: {
                actions: '<button></button>',
            },
        });

        expect(wrapper.contains('[data-qa="actions"]')).toBe(true);
    });

    test('It should render the actions if the default slot and `actions` are given.', () => {
        wrapper = mount(LayoutModal, {
            store: storeMocks.store,
            slots: {
                default: '<div></div>',
                actions: '<button></button>',
            },
        });

        expect(wrapper.contains('[data-qa="actions"]')).toBe(true);
    });

    test('It should render the actions if the slots `breakout` and `actions` are given.', () => {
        wrapper = mount(LayoutModal, {
            store: storeMocks.store,
            slots: {
                breakout: '<div></div>',
                actions: '<button></button>',
            },
        });

        expect(wrapper.contains('[data-qa="actions"]')).toBe(true);
    });
});
