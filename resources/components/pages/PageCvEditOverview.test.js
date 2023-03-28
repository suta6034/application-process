import {
    mount,
} from '../../../tests/app/vue/utils';

import PageCvEditOverview from './PageCvEditOverview';

describe('PageCvEditOverview', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(PageCvEditOverview);
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
