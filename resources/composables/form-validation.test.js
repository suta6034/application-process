import {
    mount,
} from '@vue/test-utils';

import {
    ref, nextTick,
} from 'vue';
import {
    focusFirstStatus,
} from '../utils/form-focus';
import FormInput from '../components/atoms/form/FormInput';
import TextHeadline from '../components/atoms/text/TextHeadline';
import {
    useFormValidation,
} from './form-validation';

jest.mock('../utils/form-focus');

const MockComponent = {
    template: `
        <div ref="root" class="rootNode">
            <form-input data-qa="input"></form-input>
            <form-input></form-input>
            <text-headline :level="1"></text-headline>
        </div>
    `,
    setup() {
        const v$ = null; // After Vuelidate upgrade: const v$ = useVuelidate(rules, state);
        const root = ref(null);
        const { validate } = useFormValidation(v$, root);
        return {
            validate,
            root,
        };
    },
};
let mockValidator;
let wrapper;

beforeEach(() => {
    mockValidator = {
        $error: false,
        $touch: jest.fn(),
    };
    wrapper = mount(MockComponent, {
        mocks: {
            $v: mockValidator,
        },
        stubs: {
            FormInput,
            TextHeadline,
        },
    });
});

describe('useFormValidation', () => {
    test('It should be a function.', () => {
        expect(typeof useFormValidation).toBe('function');
    });

    describe('validate()', () => {
        test('It should trigger validation.', () => {
            wrapper.vm.validate();

            expect(mockValidator.$touch).toBeCalled();
        });

        test('It should focus the first error if validation fails.', async () => {
            mockValidator.$error = true;

            expect(focusFirstStatus).not.toBeCalled();
            wrapper.vm.validate();
            await nextTick();
            expect(focusFirstStatus).toBeCalled();
        });

        test('It should return `true` if there are no validation errors.', () => {
            expect(wrapper.vm.validate()).toBe(true);
        });
    });
});
