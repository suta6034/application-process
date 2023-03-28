import {
    createLocalVue,
} from '@vue/test-utils';
import Vuex from 'vuex';
import {
    mount,
    shallowMount,
} from '../../../../../tests/app/vue/utils';
import {
    downloadZip,
} from '../../../../utils/download';

import CardCvDocuments from './CardCvDocuments';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');
jest.mock('../../../../utils/download');
jest.mock('../../../../router', () => ({
    resolve: '',
}));

const storeMocks = createStoreMocks();
let wrapper;
const localVue = createLocalVue();
localVue.use(Vuex);

beforeEach(() => {
    wrapper = shallowMount(CardCvDocuments, {
        store: storeMocks.store,
    });
});

describe('CardCvDocuments', () => {
    test('It should render an app card.', () => {
        expect(wrapper.find('[data-qa="documents card"]').exists()).toBe(true);
    });

    test('It should show a loading animation while the documents are downloaded.', async () => {
        let finishDownloadZip;
        const downloadZipPromise = new Promise((resolve) => {
            finishDownloadZip = resolve;
        });
        downloadZip.mockReturnValue(downloadZipPromise);
        storeMocks.store.state.profile.attachment = {
            rows: [{
                'create-date': '2018-08-02T12:00:31+0200',
                mimetype: 'image/jpeg',
                name: 'file-1.jpg',
                size: 1348798,
                url: '/user/199d367f-d66a-57ec-ba26-7b4642a6e0fb/file/0e17c482-b951-581f-8e64-1ad3a311cf51',
                uuid: '0e17c482-b951-581f-8e64-1ad3a311cf51',
                version: null,
            },
            ],
        };
        wrapper = mount(CardCvDocuments, {
            localVue,
            store: storeMocks.store,
        });
        wrapper.find('[data-qa="all download button"]').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-qa="progress backdrop"]').exists()).toBe(true);
        finishDownloadZip();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-qa="progress backdrop"]').exists()).toBe(false);
    });
});
