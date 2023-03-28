import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import PageCvFileEdit from './PageCvFileEdit';

describe('PageCvFileEdit', () => {
    let wrapper;
    let mockRouter;

    beforeEach(() => {
        mockRouter = {
            push: jest.fn(),
        };
        wrapper = shallowMount(PageCvFileEdit, {
            mocks: {
                $router: mockRouter,
            },
            stubs: {
                LayoutFullscreen: '<div><slot/><slot name="footer"></slot></div>',
            },
            provide: {
                router: mockRouter,
            },
        });
    });

    test('Its class should be c-pageCvFileEdit.', () => {
        expect(wrapper.element.classList).toContain('c-pageCvFileEdit');
    });

    test('It should redirect to preview page when the next button is clicked.', async () => {
        // not possible with our old version of test-utils 1.3.0
        // wrapper.find('[data-qa="next button"]').trigger('click');
        await wrapper.vm.onNextClick();
        expect(mockRouter.push).toBeCalledWith({ name: 'page-cv-file-preview' });
    });
});
