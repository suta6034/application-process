import flushPromises from 'flush-promises';

import {
    nextTick,
} from 'vue';
import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import * as applicationStatusService from '../../../services/application-status';

import ModalApplicationsItemStatus from './ModalApplicationsItemStatus';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');
jest.mock('../../../services/application-status');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;
    // eslint-disable-next-line no-import-assign
    applicationStatusService.patch = jest.fn();

    wrapper = mount(ModalApplicationsItemStatus, {
        store: storeMocks.store,
        propsData: {
            applicationId: '1',
            status: 'INVITED',
            statusDate: '2021-05-31T14:07:19+0000',
        },
    });
});

describe('ModalApplicationsItemStatus', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should update the status to `rejected` when clicking the rejected pill.', async () => {
        await wrapper.find('[data-qa="change status rejected button"]').trigger('click');

        expect(applicationStatusService.patch).toBeCalledWith({
            id: '1',
            data: {
                status: 'REJECTED',
            },
        });
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should update the status to `applied` when clicking the applied pill.', async () => {
        await wrapper.find('[data-qa="change-status-applied button"]').trigger('click');

        expect(applicationStatusService.patch).toBeCalledWith({
            id: '1',
            data: {
                status: 'APPLIED',
            },
        });
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should update the status to `invited` when clicking the invited pill.', async () => {
        await wrapper.find('[data-qa="change-status-invited button"]').trigger('click');
        await wrapper.find('[data-qa="save button"]').trigger('click');

        expect(applicationStatusService.patch).toBeCalledWith({
            id: '1',
            data: {
                status: 'INVITED',
                statusDate: '2021-05-31T14:07:19+0000',
            },
        });
        await flushPromises();
        await nextTick();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should update the status to `confirmed` when clicking the confirmed pill.', async () => {
        await wrapper.find('[data-qa="change-status-confirmed button"]').trigger('click');

        expect(applicationStatusService.patch).toBeCalledWith({
            id: '1',
            data: {
                status: 'CONFIRMED',
            },
        });
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should update the status to `archived` when clicking the archived pill.', async () => {
        await wrapper.find('[data-qa="change-status-archived button"]').trigger('click');

        expect(applicationStatusService.patch).toBeCalledWith({
            id: '1',
            data: {
                status: 'ARCHIVED',
            },
        });
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
