import {
    nextTick,
} from 'vue';
import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    commitAndShowModal,
} from '../../../utils/error';
import * as gdpr from '../../../services/gdpr';
import mitt from '../../../utils/mitt';

import ModalGdpr from './ModalGdpr';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');
jest.mock('../../../utils/error');
jest.mock('../../../utils/mitt', () => ({ emit: jest.fn() }));

let storeMocks;
let wrapper;

function wrapperFactory(propsData = {}) {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    // eslint-disable-next-line no-import-assign
    gdpr.approve = jest.fn().mockResolvedValue();

    return shallowMount(ModalGdpr, {
        propsData: {
            consentType: 'consent_type_foo',
            ...propsData,
        },
        stubs: {
            AppButton: '<button @click="$emit(\'click\')"/>',
            LayoutDynamicModal: '<div><slot/></div>',
        },
        store: storeMocks.store,
    });
}

beforeEach(() => {
    wrapper = wrapperFactory();
});

describe('ModalGdpr', () => {
    test('It should successfully mount.', () => {
        expect(wrapper.element.tagName).toBe('ANONYMOUS-STUB');
    });

    test('It should render specific infos if at least one is given.', () => {
        wrapper = wrapperFactory({
            specificInfos: [
                {
                    headline: 'foo',
                    text: 'bar',
                },
            ],
        });

        expect(wrapper.contains('[data-qa="specific infos"]')).toBe(true);
    });

    test('It should render the general info if one is given.', () => {
        wrapper = wrapperFactory({
            generalInfo: 'foo',
        });

        expect(wrapper.contains('[data-qa="general info"]')).toBe(true);
    });

    test('It should open an error modal if the consent approve request is not successful.', async () => {
        gdpr.approve.mockRejectedValue();
        wrapper.vm.accept();

        // Wait for API request.
        await nextTick();
        // Wait for re-render after hiding the popup.
        await nextTick();
        await nextTick();

        expect(commitAndShowModal).toBeCalled();
    });

    test('It should trigger an API request to update the consent when accepting.', () => {
        wrapper.vm.accept();

        expect(gdpr.approve).toBeCalledWith('consent_type_foo');
    });

    test('It should emit a `consent-accepted` event when the API request is successful.', async () => {
        wrapper.vm.accept();

        // Wait for API request.
        await nextTick();
        await nextTick();

        expect(mitt.emit).toBeCalledWith('consent-accepted', 'consent_type_foo');
    });
});
