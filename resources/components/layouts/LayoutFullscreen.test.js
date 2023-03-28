import Router from 'vue-router';

import {
    mount,
} from '../../../tests/app/vue/utils';

import LayoutFullscreen from './LayoutFullscreen';

let wrapper;
const mockRouter = new Router({
    routes: [
        {
            path: '/foo',
            name: 'page-cv-file-edit',
        },
    ],
});

beforeEach(() => {
    mockRouter.push = jest.fn();
    wrapper = mount(LayoutFullscreen, {
        mocks: {
            $router: mockRouter,
        },
    });
});

describe('LayoutFullscreen', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit an `close` event when clicking the close button on the edit step.', async () => {
        const button = wrapper.find('[data-qa="close button"]');
        button.trigger('click');

        expect(wrapper.emitted().close).toBeDefined();
    });
});
