import Vuex from 'vuex';
import store from '../../../../store';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';

import FormCvDesiredJob from './FormCvDesiredJob';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');

let wrapper;

localVue.use(Vuex);

beforeEach(() => {
    wrapper = mount(FormCvDesiredJob, {
        localVue,
        store,
        mocks: {
            $t: jest.fn(),
        },
    });
});

describe('FormCvDesiredJob', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should show options when clicking on the employments dropdown.', async () => {
        wrapper.find('[data-qa="employments dropdown"] [data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="option 1"]').text()).toBe('Vollzeit');
    });

    test('It should show selected options in the employments dropdown.', async () => {
        wrapper.find('[data-qa="employments dropdown"] button').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="option 1"] input').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="employments dropdown"] [data-qa="button"]').text()).toBe('Vollzeit');
    });
});
