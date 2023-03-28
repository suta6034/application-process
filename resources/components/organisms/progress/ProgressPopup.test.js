import {
    mount,
} from '@vue/test-utils';

import ProgressPopup from './ProgressPopup';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

jest.mock('../../../store');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ProgressPopup, {
        store: storeMocks.store,
    });
});

describe('ProgressPopup', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });
});
