import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import LayoutSplitView from './LayoutSplitView';

jest.mock('../../store');

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(LayoutSplitView, {
        propsData: {
            stickyColumn: 'list',
        },
    });
});

describe('LayoutSplitView', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });
});
