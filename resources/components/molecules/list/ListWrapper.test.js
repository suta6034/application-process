import {
    mount,
} from '../../../../tests/app/vue/utils';

import ListWrapper from './ListWrapper';

let wrapper;

beforeEach(() => {
    wrapper = mount(ListWrapper, {
        slots: {
            default: '<li></li>',
        },
    });
});

describe('ListWrapper', () => {
    test('It should render a `<ul>`.', () => {
        expect(wrapper.is('ul')).toBe(true);
    });

    test('It should display the given content.', () => {
        expect(wrapper.contains('li')).toBe(true);
    });
});
