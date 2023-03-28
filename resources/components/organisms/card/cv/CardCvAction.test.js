import {
    shallowMount,
} from '../../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store/index';
import * as CvFileService from '../../../../services/cv-file';
import {
    commitAndShowModal,
} from '../../../../utils/error';

import CardCvAction from './CardCvAction';
import {
    SHOW_POPUP,
} from '../../../../store/mutation-types';

jest.mock('../../../../services/cv-file', () => ({
    fetchAvailability: jest.fn(),
    getTemplateSettings: jest.fn(),
}));
jest.mock('../../../../store');
jest.mock('../../../../store/modules/components/popup');
jest.mock('../../../../utils/error');

let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();

    CvFileService.getTemplateSettings.mockResolvedValue({ data: { data: {} } });
});

describe('CardCvAction', () => {
    function wrapperFactory({ propsData } = {}) {
        return shallowMount(CardCvAction, {
            propsData: {
                settings: {
                    template: null,
                    color: null,
                },
                ...propsData,
            },
            store: storeMocks.store,
        });
    }

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the visibility badge.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.contains('[data-qa="visibility badge"]')).toBe(true);
    });

    test('It should render the completeness bar.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.contains('[data-qa="completeness area"]')).toBe(true);
    });

    describe('Action Links', () => {
        test('It should render cv the preview link.', () => {
            const wrapper = wrapperFactory();

            expect(wrapper.contains('[data-qa="preview link"]')).toBe(true);
        });

        test('It should render the edit design link.', () => {
            const wrapper = wrapperFactory();

            expect(wrapper.contains('[data-qa="edit design link"]')).toBe(true);
        });

        test('It should render the cv download link.', () => {
            const wrapper = wrapperFactory();

            expect(wrapper.contains('[data-qa="download link"]')).toBe(true);
        });

        test('It should render visibility link.', () => {
            const wrapper = wrapperFactory();

            expect(wrapper.contains('[data-qa="visibility link"]')).toBe(true);
        });
    });

    describe('Template preview', () => {
        test('It should render the cv preview skeleton.', () => {
            const wrapper = wrapperFactory();

            expect(wrapper.contains('[data-qa="cv preview skeleton"]')).toBe(true);
        });

        test('It should provide the given CV template settings.', async () => {
            wrapperFactory();

            expect(CvFileService.getTemplateSettings).toBeCalled();
        });
    });

    describe('CV File', () => {
        test('It should display the download link disabled state.', async () => {
            const wrapper = wrapperFactory();

            await wrapper.find('[data-qa="download link"]').trigger('click');

            expect(wrapper.contains('[data-qa="download link"][disabled]')).toBe(true);
        });

        test('It should open the error modal if the cv file pdf can not be displayed.', async () => {
            const wrapper = wrapperFactory();

            await wrapper.find('[data-qa="download link"]').trigger('click');
            expect(wrapper.contains('[data-qa="download link"][disabled]')).toBe(true);

            await CvFileService.fetchAvailability.mockResolvedValue(false);

            expect(commitAndShowModal).toBeCalled();
            expect(wrapper.contains('[data-qa="download link"][disabled]')).toBe(false);
        });
    });
});
