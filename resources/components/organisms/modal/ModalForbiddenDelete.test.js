import {
    nextTick,
} from 'vue';
import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalForbiddenDelete from './ModalForbiddenDelete';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;

const mockRouter = {
    push: jest.fn(),
};

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalForbiddenDelete, {
        store: storeMocks.store,
        propsData: { mutation: 'foo/bar', itemId: 3 },
        mocks: {
            $router: mockRouter,
        },
        provide: {
            router: mockRouter,
        },
    });
});

describe('ModalDeleteItem', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe('Default', () => {
        test('It should render the default body.', () => {
            expect(wrapper.contains('[data-qa="text default"]')).toBe(true);
        });

        test('It should hide the modal when the cancel button is clicked.', () => {
            wrapper.find('[data-qa="cancel button"]').trigger('click');

            expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
        });

        test('It should redirect to the edit page.', async () => {
            wrapper.find('[data-qa="edit link"]').trigger('click');

            await nextTick();
            expect(mockRouter.push).toBeCalledWith({
                name: 'page-cv-education-form-edit',
                params: { id: 3 },
            });
        });
    });
});
