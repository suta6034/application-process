import Vuex from 'vuex';
import {
    localVue,
    mount,
} from '../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    SHOW_POPUP,
} from '../../../store/mutation-types';

import AppApplicationTimeline from './AppApplicationTimeline';

localVue.use(Vuex);

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();
});

function makeWrapper(options) {
    return mount(AppApplicationTimeline, {
        store: storeMocks.store,
        localVue,
        ...options,
    });
}

describe('AppApplicationTimeline', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = makeWrapper({
            propsData: {
                application: {
                    id: '1',
                    status: 'applied',
                    statusDate: null,
                },
            },
        });

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should open the application status modal when clicking the edit status button.', async () => {
        const application = { status: 'rejected' };
        const wrapper = makeWrapper({
            propsData: {
                application,
            },
        });
        await wrapper.find('[data-qa="edit status button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations[SHOW_POPUP]).toBeCalledWith(expect.any(Object), {
            componentName: 'ModalApplicationsItemStatus',
            componentProps: {
                applicationId: application.id,
                status: application.status,
                statusDate: application.statusDate,
                gaPrefix: 'AP_D',
            },
        });
    });
});
