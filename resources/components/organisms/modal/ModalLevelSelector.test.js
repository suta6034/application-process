import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    createAdaptedOption,
} from '../../../utils/AdaptedOption';

import ModalLevelSelector from './ModalLevelSelector';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalLevelSelector, {
        store: storeMocks.store,
        propsData: {
            adaptedOption: createAdaptedOption({
                id: 10,
                label: 'Foo',
                value: {
                    level: {
                        id: 10,
                        label: 'Bar',
                    },
                },
            }),
            levels: [{ id: 20, label: 'Baz' }],
            mutation: 'foo/bar/baz',
        },
    });
});

describe('ModalLevelSelector', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should hide itself when a level is selected is clicked.', () => {
        wrapper.find('[data-qa="levels"] input').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should hide itself after the given level is updated when clicking a pill.', () => {
        storeMocks.store.commit = jest.fn();

        wrapper.vm.updateLevel({ id: 10 });

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
