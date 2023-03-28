import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppJobAlarmItem from './AppJobAlarmItem';

describe('AppJobAlarmItem', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppJobAlarmItem);

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render a skeleton view if the loading property is set.', () => {
        const wrapper = shallowMount(AppJobAlarmItem, { propsData: { loading: true } });

        expect(wrapper.contains('[data-qa="skeleton box"]')).toBe(true);
    });
});
