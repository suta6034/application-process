import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    enableScrollLock,
} from '../../../utils/scroll-lock';
import FormTextareaLimited from './FormTextareaLimited';

jest.mock('../../../utils/scroll-lock');

let wrapper;

const helpers = {
    setValue(value) {
        const textarea = wrapper.find('textarea');
        textarea.element.value = value;
        textarea.trigger('input');
    },
    makeBlur() {
        wrapper.find('textarea').trigger('blur');
    },
};

function wrapperFactory({ propsData } = {}) {
    return mount(FormTextareaLimited, {
        propsData: {
            ...propsData,
            maxlength: 50,
        },
    });
}

beforeEach(() => {
    wrapper = wrapperFactory();
});

describe('FormTextareaLimited', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render a `textarea`.', () => {
        expect(wrapper.find('textarea').exists()).toBe(true);
    });

    test('It should emit an `input` event.', () => {
        helpers.setValue('Some text');

        expect(wrapper.emitted().input[0][0]).toBe('Some text');
    });

    describe('character count', () => {
        test('It should render correct remaining characters when limit is set', () => {
            const initialText = 'Lorem ipsum dolor sit ametores';

            wrapper = wrapperFactory({
                propsData: {
                    value: initialText,
                },
            });

            expect(wrapper.find('[data-qa="character counter"').text()).toBe('20');
        });

        test('It should render the progress indicator.', () => {
            const initialText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor';

            wrapper = wrapperFactory({
                propsData: {
                    value: initialText,
                },
            });

            expect(wrapper.find('[data-qa="character counter"').exists()).toBe(true);
        });

        test('It should be set to green on indicator color when the content is within the limit.', () => {
            const initialText = 'Lorem ipsum consectetur adipiscing elit, sed eiusmod tempor';

            wrapper = wrapperFactory({
                propsData: {
                    value: initialText,
                },
            });

            const colorIndicator = wrapper.find('[data-qa="colored indicator"]');
            expect(colorIndicator.classes('k-c-circularProgressIndicator__circle--yellow')).toBe(true);
        });

        test('It should be set to yellow on indicator color when the content is within the warning boundaries.', () => {
            const initialText = 'Lorem ipsum dolor sit amet, consectetur adiping';

            wrapper = wrapperFactory({
                propsData: {
                    value: initialText,
                },
            });
            const colorIndicator = wrapper.find('[data-qa="colored indicator"]');
            expect(colorIndicator.classes('k-c-circularProgressIndicator__circle--yellow')).toBe(true);
        });
    });

    test('It should initially lock scrolling on the textarea.', async () => {
        const initialText = 'Lorem ipsum dolor sit amet, consectetur adiping';

        wrapperFactory({
            propsData: {
                value: initialText,
            },
        });

        helpers.setValue('Some text');
        helpers.makeBlur();

        expect(enableScrollLock).toBeCalled();
    });

    describe('trim', () => {
        test('It should trim empty spaces when trimming is enabled and the textarea is blurred.', async () => {
            const initialText = 'Some text     ';

            wrapper = wrapperFactory({
                propsData: {
                    value: initialText,
                },
            });

            helpers.makeBlur();

            expect(wrapper.emitted().blur).toBeDefined();
            expect(wrapper.emitted().input[0][0]).toBe('Some text');
        });

        test('It should not trim empty spaces when trimming is disabled and the textarea is blurred.', async () => {
            const initialText = 'Some text     ';

            wrapper = wrapperFactory({
                propsData: {
                    value: initialText,
                    trim: false,
                },
            });

            helpers.makeBlur();

            expect(wrapper.emitted().blur).toBeDefined();
            expect(wrapper.emitted().input[0][0]).toBe('Some text     ');
        });
    });
});
