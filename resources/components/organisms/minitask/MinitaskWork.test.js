import Router from 'vue-router';
import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    nextTick,
} from 'vue';
import {
    mount,
} from '../../../../tests/app/vue/utils';

import MinitaskWork from './MinitaskWork';
import store from '../../../store';

jest.mock('../../../store');

let wrapper;
const localVue = createLocalVue();

const router = new Router({
    routes: [
        {
            path: '/foo/bar',
        },
    ],
});

router.push = jest.fn();

localVue.use(Router);
localVue.use(Vuex);

describe('MinitaskWork', () => {
    beforeEach(() => {
        wrapper = mount(MinitaskWork, {
            localVue,
            store,
            router,
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit a skip event when the skip-button is clicked.', () => {
        wrapper.find('[data-qa="skip button"]').trigger('click');
        expect(wrapper.emitted().skipped).toBeDefined();
    });

    test('It should update work experience flag when clicking the skip button.', async () => {
        store.dispatch = jest.fn();
        wrapper.find('[data-qa="skip button"]').trigger('click');
        await nextTick();
        expect(store.dispatch).toBeCalledWith('profile/UPDATE_HAS_WORK_EXPERIENCE_STATUS', false);
    });

    test('It should emit a updated event when the save-button is clicked.', () => {
        wrapper.find('[data-qa="add button"]').trigger('click');
        expect(wrapper.emitted().updated).toBeDefined();
    });
});
