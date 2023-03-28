import Vuex from 'vuex';
import {
    createLocalVue,
    mount,
} from '@vue/test-utils';
import FormProfileCreateSkills from './FormProfileCreateSkills';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile-create');
jest.mock('../../../../services/auth');
jest.mock('../../../../services/skill-recommender');

let wrapper;
let storeMocks;
let mockRouter;
let mockValidator;
const localVue = createLocalVue();

localVue.use(Vuex);

jest.mock('../../../../router', () => ({
    push: jest.fn(),
    resolve: jest.fn().mockReturnValue({ href: '/resolved/href' }),
}));

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profileCreate.forceValidation = { key: '', time: 0 };
    mockRouter = {
        push: jest.fn(),
        resolve: jest.fn().mockReturnValue({ href: '/resolved/href' }),
    };
    mockValidator = {
        $touch: jest.fn(),
        skills: {
            $error: false,
        },
    };

    wrapper = mount(FormProfileCreateSkills, {
        localVue,
        store: storeMocks.store,
        mocks: {
            $v: mockValidator,
            $t: () => '',
            $router: mockRouter,
        },
    });
});

describe('FormProfileCreateSkills', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });
});
