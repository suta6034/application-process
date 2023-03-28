import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    mount,
} from '../../../../tests/app/vue/utils';

import FormAttachmentList from './FormAttachmentList';

jest.mock('../../../store');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

const fileNameTests = [
    {
        file: 'foo.pdf',
        fileName: 'foo',
        fileEnding: '.pdf',
    },
    {
        file: 'foo.bar.pdf',
        fileName: 'foo.bar',
        fileEnding: '.pdf',
    },
];

beforeEach(() => {
    storeMocks = createStoreMocks();

    wrapper = mount(FormAttachmentList, {
        localVue,
        store: storeMocks.store,
        propsData: {
            files: [
                {
                    deletable: false,
                    icon: 'file-image',
                    name: 'foo.jpg',
                    progress: null,
                    ribbon: 'Lebenslauf',
                    url: '/foo.jpg',
                    uuid: 'foo-1',
                    size: 342,
                },
                {
                    deletable: true,
                    icon: 'file-pdf',
                    name: 'bar.pdf',
                    progress: null,
                    url: '/bar.pdf',
                    uuid: 'bar-1',
                    size: 342,
                },
                {
                    deletable: true,
                    icon: 'file-doc',
                    name: 'baz.docx',
                    progress: 15,
                    url: null,
                    uuid: null,
                    size: 342,
                },
            ],
        },
        stubs: {
            AppButtonIconOnly: '<div @click="emit(\'click\', $event)"/>',
        },
    });
});

describe('FormAttachmentList', () => {
    test('It should render a `<ul>`.', () => {
        expect(wrapper.is('ul')).toBe(true);
    });

    test('It should render the given list of files.', () => {
        expect(wrapper.findAll('[data-qa="file"]').length).toBe(3);
    });

    test('It should emit a delete event when the delete link is clicked.', async () => {
        wrapper.find('[data-qa="file"]:nth-child(1) [data-qa="delete link"]').trigger('click');

        expect(wrapper.emitted('delete')).toEqual([['bar-1']]);
    });

    test('It should only render the wrapper if the no files are given.', () => {
        wrapper = mount(FormAttachmentList, {
            store: storeMocks.store,
        });

        expect(wrapper.find('[data-qa="file"]').exists()).toBe(false);
    });

    test('It should correctly split file names', () => {
        fileNameTests.forEach((file) => {
            expect(wrapper.vm.fileName(file.file)).toEqual(file.fileName);
            expect(wrapper.vm.fileEnding(file.file)).toEqual(file.fileEnding);
        });
    });
});
