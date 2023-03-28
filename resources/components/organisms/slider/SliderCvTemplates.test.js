import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';
// eslint-disable-next-line
import { __createMocks as createStoreMocks } from '../../../store';
import {
    FETCH_TEMPLATE_SETTINGS,
} from '../../../store/action-types';
import {
    SET_TEMPLATE_SETTINGS,
    SET_TEMPLATE_SETTINGS_BY_KEY,
} from '../../../store/mutation-types';
import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import SliderCvTemplates from './SliderCvTemplates';

jest.mock('../../../store');
jest.mock('../../../store/modules/template-settings');

let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

describe('SliderCvTemplates', () => {
    function wrapperFactory({ propsData } = {}) {
        storeMocks = createStoreMocks();

        return shallowMount(SliderCvTemplates, {
            localVue,
            store: storeMocks.store,
            propsData: {
                querySettings: {
                    template: 'vegan',
                    color: 'win',
                    font: 'not-not',
                },
                ...propsData,
            },
        });
    }

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should fetch and set the template settings.', async () => {
        wrapperFactory();
        expect(storeMocks.store.state.templateSettings.settings.template).toBe('vegan');
        expect(storeMocks.modules.templateSettings.actions[FETCH_TEMPLATE_SETTINGS]).toBeCalled();
        expect(storeMocks.modules.templateSettings.mutations[SET_TEMPLATE_SETTINGS]).toBeCalled();
    });

    test('It should set the given query settings.', async () => {
        const wrapper = wrapperFactory({
            propsData: {
                querySettings: {
                    template: 'ladder',
                    color: 'gre',
                    font: 'not-not',
                },
            },
            methods: {
                validateTemplateSettings() {
                    return true;
                },
            },
        });
        await wrapper.vm.$nextTick();

        expect(storeMocks.modules.templateSettings.mutations[SET_TEMPLATE_SETTINGS]).toBeCalled();
    });

    describe('Apply Template Defaults', () => {
        test('It should set the default settings for the selected template.', async () => {
            const wrapper = wrapperFactory();
            const settings = { key: 'template', value: 'vegan' };

            wrapper.vm.applySelectedTemplateDefaults(settings);

            expect(storeMocks.modules.templateSettings.mutations[SET_TEMPLATE_SETTINGS_BY_KEY]).toBeCalled();
            expect(storeMocks.modules.templateSettings.mutations[SET_TEMPLATE_SETTINGS_BY_KEY]).toBeCalled();
            expect(storeMocks.modules.templateSettings.mutations[SET_TEMPLATE_SETTINGS_BY_KEY]).toBeCalled();
        });
        test('It should set the template value if template is a number.', async () => {
            const wrapper = wrapperFactory();

            const settings = {
                key: 'template',
                value: 0,
            };

            await wrapper.vm.$nextTick();
            wrapper.vm.applySelectedTemplateDefaults(settings);

            expect(storeMocks.modules.templateSettings.mutations[SET_TEMPLATE_SETTINGS_BY_KEY]).toBeCalledTimes(6);
        });
    });
});
