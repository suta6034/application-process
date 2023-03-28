import FormProfileCreateOnePage from './FormProfileCreateOnePage';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';
import {
    shallowMount,
} from '../../../../../tests/app/vue/utils';

jest.mock('../../../../store');

let wrapper;
const storeMocks = createStoreMocks();

function wrapperFactory() {
    return shallowMount(FormProfileCreateOnePage, {
        store: storeMocks.store,
        stubs: {
            LayoutForm: '<div><slot/><slot name="actions"/></div>',
        },
    });
}

beforeEach(() => {
    wrapper = wrapperFactory();
});

describe('FormProfileCreateOnePage', () => {
    test('It should successfully mount.', () => {
        expect(wrapper.element.tagName).toBe('ANONYMOUS-STUB');
    });

    test('It should render the FormProfileCreatePersonal component.', () => {
        expect(wrapper.contains('[data-qa="personal form"]')).toBe(true);
    });

    test('It should render the FormProfileCreateSkill component.', () => {
        expect(wrapper.contains('[data-qa="skills form"]')).toBe(true);
    });

    test('It should render the `add education tile`.', () => {
        expect(wrapper.contains('[data-qa="education empty tile"]')).toBe(true);
    });

    test('It should render the `add work experience tile`.', () => {
        expect(wrapper.contains('[data-qa="work empty tile"]')).toBe(true);
    });

    test('It should render the FormProfileCreateDesiredJob component.', () => {
        expect(wrapper.contains('[data-qa="desired job form"]')).toBe(true);
    });
});
