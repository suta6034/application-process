import {
    createLocalVue,
    shallowMount,
} from '@vue/test-utils';
import Vuex from 'vuex';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import AppProfileImage from './AppProfileImage';

jest.mock('../../../store');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.getters['profile/imageVersion'].mockReset();

    wrapper = shallowMount(AppProfileImage, {
        localVue,
        store: storeMocks.store,
    });
});

describe('AppProfileImage', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the users profile image.', () => {
        storeMocks.store.getters['profile/imageVersion'].mockReturnValue({ url: 'foo.jpg' });
        wrapper = shallowMount(AppProfileImage, {
            localVue,
            store: storeMocks.store,
        });

        expect(wrapper.contains('[data-qa="image"]')).toBe(true);
    });

    test('It should render a placeholder image if the profile image can not be loaded.', async () => {
        storeMocks.store.getters['profile/imageVersion'].mockReturnValue({ url: 'foo.jpg' });
        wrapper = shallowMount(AppProfileImage, {
            localVue,
            store: storeMocks.store,
            propsData: {
                nameInitials: null,
                showOverlay: true,
                showImageFallback: false,
            },
        });

        wrapper.find('[data-qa="image"]').trigger('error');
        await wrapper.vm.$nextTick();

        wrapper = shallowMount(AppProfileImage, {
            localVue,
            store: storeMocks.store,
            propsData: {
                nameInitials: 'placeholder',
            },
        });
        expect(wrapper.contains('[data-qa="placeholder"]')).toBe(true);
    });

    test('It should render a placeholder image if the user has no profile image yet.', () => {
        wrapper = shallowMount(AppProfileImage, {
            localVue,
            store: storeMocks.store,
            propsData: {
                nameInitials: 'placeholder',
            },
        });

        expect(wrapper.contains('[data-qa="placeholder"]')).toBe(true);
    });
});
