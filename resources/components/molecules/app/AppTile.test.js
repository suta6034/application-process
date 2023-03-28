import Router from 'vue-router';
import {
    createLocalVue,
    mount,
} from '@vue/test-utils';

import AppTile from './AppTile';

let wrapper;
const localVue = createLocalVue();
const router = new Router({
    routes: [
        {
            path: '/foo-bar',
            name: 'foo-bar',
        },
    ],
    mode: 'history',
});

localVue.use(Router);

beforeEach(() => {
    wrapper = mount(AppTile, { localVue, router });
});

describe('AppTile', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render an `<a>` if `to` is specified.', async () => {
        wrapper.setProps({ to: { name: 'foo-bar' } });

        await wrapper.vm.$nextTick();

        expect(wrapper.is('a')).toBe(true);
    });

    test('It should set the tile as highlighted if the property is set.', async () => {
        wrapper.setProps({ highlighted: true });

        await wrapper.vm.$nextTick();

        expect(wrapper.is('.is-highlighted')).toBe(true);
    });
});
