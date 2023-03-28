import Vuex from 'vuex';

import {
    createLocalVue,
} from '@vue/test-utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    mount,
} from '../../../tests/app/vue/utils';
import {
    patchTemplateSettings,
} from '../../services/cv-file';

import PageCvFilePreview from './PageCvFilePreview';

jest.mock('../../services/cv-file');
jest.mock('../../store');
jest.mock('../../store/modules/template-settings');

patchTemplateSettings.mockResolvedValue();

let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

describe('PageCvFilePreview', () => {
    let wrapper;
    const router = {
        push: jest.fn(),
    };

    beforeEach(() => {
        // eslint-disable-next-line prefer-destructuring
        storeMocks = createStoreMocks();
        storeMocks.modules.templateSettings.mutations.SET_MODIFIED.mockReset();

        wrapper = mount(PageCvFilePreview, {
            localVue,
            store: storeMocks.store,
            mocks: {
                $router: router,
            },
            computed: {
                templateSettings() {
                    return {
                        template: 'One',
                        color: 'Two',
                        font: 'Three',
                        educationFirst: true,
                    };
                },
            },
            provide: {
                router,
            },
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render an `<iframe>`.', () => {
        expect(wrapper.contains('iframe')).toBe(true);
    });

    test('It should read default template settings from store', () => {
        expect(storeMocks.store.state.templateSettings.settings.template).toBe('vegan');
        expect(storeMocks.store.state.templateSettings.settings.color).toBe('blu-gre');
        expect(storeMocks.store.state.templateSettings.settings.font).toBe('not-not');
    });

    test('It should load Kickresume’s render preview.', () => {
        const iframe = wrapper.find('iframe').element;
        expect(iframe.getAttribute('src')).toBe('https://api.kickresume.com/render-preview/karriere-at/');
    });

    test('It should resize Kickresume’s render preview.', async () => {
        const iframe = wrapper.find('iframe').element;
        wrapper.vm.resizePreview();
        expect(iframe.getAttribute('style')).toMatch(/transform: scale\(.*?\);/);
    });

    test('It should patch the template settings.', async () => {
        storeMocks.store.state.templateSettings.settings.template = 'One';
        storeMocks.store.state.templateSettings.settings.color = 'Two';
        storeMocks.store.state.templateSettings.settings.font = 'Three';
        storeMocks.store.state.templateSettings.settings.educationFirst = true;

        const button = wrapper.find('[data-qa="save button"]');
        await button.trigger('click');

        expect(wrapper.vm.buttonDisabled).toBe(true);

        await wrapper.vm.$nextTick();

        expect(patchTemplateSettings).toBeCalledWith({
            template: 'One',
            color: 'Two',
            font: 'Three',
            educationFirst: true,
        });
        expect(router.push).toBeCalledWith({ name: 'page-cv' });
    });

    test('It should post the template settings.', async () => {
        storeMocks.store.state.templateSettings.settings = null;

        wrapper = mount(PageCvFilePreview, {
            localVue,
            store: storeMocks.store,
            provide: {
                router,
            },
        });
        const button = wrapper.find('[data-qa="save button"]');
        await button.trigger('click');

        expect(wrapper.vm.buttonDisabled).toBe(true);

        await wrapper.vm.$nextTick();

        expect(storeMocks.modules.templateSettings.actions.CREATE_TEMPLATE_SETTINGS).toBeCalled();
        expect(storeMocks.modules.templateSettings.mutations.SET_MODIFIED).not.toBeCalled();
    });
});
