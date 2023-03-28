import {
    localVue,
    shallowMount,
} from '../../../tests/app/vue/utils';

import PageApplicationForm from './PageApplicationForm';
import LayoutFullscreen from '../layouts/LayoutFullscreen';

jest.mock('../../store');
jest.mock('../../services/application', () => ({
    getEmpty: () => ({
        data: [],
    }),
}));
const wrapper = shallowMount(PageApplicationForm, { localVue });

describe('PageApplicationForm', () => {
    test('It should render `<LayoutFullscreen>`.', () => {
        expect(wrapper.find(LayoutFullscreen).exists()).toBe(true);
    });
});
