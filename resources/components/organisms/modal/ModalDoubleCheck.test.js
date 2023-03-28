import {
    mount,
} from '../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import ModalDoubleCheck from './ModalDoubleCheck';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;
let callbackApprove;
let callbackDecline;
let headline;
let text;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;
    callbackApprove = jest.fn();
    callbackDecline = jest.fn();

    wrapper = mount(ModalDoubleCheck, {
        store: storeMocks.store,
        propsData: {
            callbackApprove,
            callbackDecline,
            headline,
            text,
        },
    });
});

describe('ModalDoubleCheck', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render the given headline.', () => {
        expect(wrapper.find('[data-qa="headline"]').text()).toBe('Bist du dir sicher?');
    });

    test('It should render the given text.', () => {
        expect(wrapper.find('[data-qa="text"]').text()).toBe('Möchtest du diesen Eintrag wirklich löschen?');
    });

    test('It should call back decline function and hide the modal when the cancel button is clicked.', () => {
        wrapper.find('[data-qa="decline link"]').trigger('click');

        expect(callbackDecline).toBeCalled();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should call back approve function and hide the modal when remove button is clicked.', async () => {
        await wrapper.find('[data-qa="approve button"]').trigger('click');

        expect(callbackApprove).toBeCalled();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
