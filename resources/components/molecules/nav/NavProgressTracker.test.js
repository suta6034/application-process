import {
    createLocalVue,
} from '@vue/test-utils';
import Router from 'vue-router';
import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import NavProgressTracker from './NavProgressTracker';

let wrapper;
const localVue = createLocalVue();

localVue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/foo/bar',
        },
    ],
});

beforeEach(() => {
    wrapper = shallowMount(NavProgressTracker, {
        localVue,
        router,
        propsData: { steps: [] },
    });
});

describe('NavProgressTracker', () => {
    test('It should render a `<nav>`.', () => {
        expect(wrapper.is('nav')).toBe(true);
    });
});
