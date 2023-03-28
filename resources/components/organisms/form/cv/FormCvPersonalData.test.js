import Vuex from 'vuex';

import store from '../../../../store';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';

import FormCvPersonalData from './FormCvPersonalData';

jest.mock('../../../../store');

let wrapper;

localVue.use(Vuex);

const mockRouter = {
    push: jest.fn(),
};

beforeEach(() => {
    store.state.profile.basics.country.id = 2420;

    wrapper = mount(FormCvPersonalData, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
            $randomFieldId: jest.fn(),
        },
    });
});

describe('FormCvPersonalData', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should disable the email field and a link to the settings should be shown.', () => {
        expect(wrapper.contains('[data-qa="email"][disabled]')).toBe(true);
        expect(wrapper.contains('[data-qa="settings link"]')).toBe(true);
    });

    test('It should show the DACH countries by default when selecting a country.', async () => {
        wrapper.find('[data-qa="country"]').trigger('focus');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="option 1"]').text()).toBe('Österreich');
        expect(wrapper.find('[data-qa="option 2"]').text()).toBe('Deutschland');
        expect(wrapper.find('[data-qa="option 3"]').text()).toBe('Schweiz');
    });

    test('It should show the states from a DACH country, when a DACH country is selected.', async () => {
        store.state.profile.basics.country = { id: 2420, label: 'Österreich' };

        wrapper.find('[data-qa="state"]').trigger('focus');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="option 1"]').text()).toBe('Wien');
        expect(wrapper.find('[data-qa="option 2"]').text()).toBe('Niederösterreich');
        expect(wrapper.find('[data-qa="option 3"]').text()).toBe('Burgenland');
    });

    test('It should show the states from Austria, when a Austria is selected.', async () => {
        store.state.profile.basics.country = { id: 3757, label: 'Österreich' };

        wrapper.find('[data-qa="state"]').trigger('focus');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="option 1"]').text()).toBe('Wien');
        expect(wrapper.find('[data-qa="option 2"]').text()).toBe('Niederösterreich');
        expect(wrapper.find('[data-qa="option 3"]').text()).toBe('Burgenland');
    });

    test('It should show the states from Switzerland, when Switzerland is selected.', async () => {
        store.state.profile.basics.country = { id: 3253, label: 'Schweiz' };

        wrapper.find('[data-qa="state"]').trigger('focus');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="option 1"]').text()).toBe('St. Gallen');
        expect(wrapper.find('[data-qa="option 2"]').text()).toBe('Zürich');
        expect(wrapper.find('[data-qa="option 3"]').text()).toBe('Aargau');
    });

    test('It should not show the state field, if the country is not a DACH country.', async () => {
        store.state.profile.basics.country = { id: 999999, label: 'foo' };
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="state"]')).toBe(false);
    });

    test('It should show the states from Germany, when Germany is selected.', async () => {
        store.state.profile.basics.country = { id: 3185, label: 'Deutschland' };

        wrapper.find('[data-qa="state"]').trigger('focus');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="option 1"]').text()).toBe('Baden-Württemberg');
        expect(wrapper.find('[data-qa="option 2"]').text()).toBe('Bayern');
        expect(wrapper.find('[data-qa="option 3"]').text()).toBe('Berlin');
    });
});
