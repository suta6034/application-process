import PageProfileCreateOnePageWork from './PageProfileCreateOnePageWork';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    shallowMount,
} from '../../../tests/app/vue/utils';

jest.mock('../../store');

let wrapper;
const storeMocks = createStoreMocks();

function wrapperFactory() {
    return shallowMount(PageProfileCreateOnePageWork, {
        store: storeMocks.store,
        stubs: {
            LayoutMinimal: '<div><main><slot/></main></div>',
        },
    });
}

beforeEach(() => {
    wrapper = wrapperFactory();
});

describe('PageProfileCreateOnePageWork', () => {
    test('It should successfully mount.', () => {
        expect(wrapper.element.tagName).toBe('ANONYMOUS-STUB');
    });

    test('It should render the formProfileCreatePersonal component.', () => {
        expect(wrapper.contains('[data-qa="personal form"]')).toBe(true);
    });

    test('It should render the formProfileCreateSkill component.', () => {
        expect(wrapper.contains('[data-qa="skills form"]')).toBe(true);
    });

    test('It should render the formProfileCreateDesiredJob component.', () => {
        expect(wrapper.contains('[data-qa="desired job form"]')).toBe(true);
    });
});
