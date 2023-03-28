import {
    mount,
} from '../../../../tests/app/vue/utils';

import FormTelephone from './FormTelephone';

let wrapper;

beforeEach(() => {
    wrapper = mount(FormTelephone);
});

describe('FormTelephone', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should create empty default.', () => {
        expect(wrapper.find('.c-formTelephone__prefix input').element.value).toBe('');
        expect(wrapper.find('.c-formTelephone__number input').element.value).toBe('');
    });

    test('It should pre-select prefix.', () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: '+49 12 3456789',
            },
        });

        expect(formTelephone.find('.c-formTelephone__prefix input').element.value).toBe('49');
    });

    test('It should pre-select default prefix.', () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: 'Meh! 12 3456789',
            },
        });

        expect(formTelephone.find('.c-formTelephone__prefix input').element.value).toBe('43');
        expect(formTelephone.find('.c-formTelephone__number input').element.value).toBe(' 12 3456789');
    });

    test('It should format phone number.', () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: '+49 12 FOOOO 3456789',
            },
        });

        expect(formTelephone.find('.c-formTelephone__prefix input').element.value).toBe('49');
        expect(formTelephone.find('.c-formTelephone__number input').element.value).toBe('12 3456789');
    });

    test('It should remove leading zero and (0) from phone number.', () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: '+49 12 FOOOO 3456789',
            },
        });

        expect(formTelephone.find('.c-formTelephone__number input').element.value).toBe('12 3456789');
        expect(formTelephone.find('.c-formTelephone__prefix input').element.value).toBe('49');
    });

    test('It should fail if phone number is too long.', async () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: '+49 1234531231233123 123123123 1233123123',
            },
            data: {
                phoneNumber: '21312 31231233 333333312333333 33333333',
                phoneCountryPrefix: {
                    prefix: '',
                    label: '',
                },
                phoneNumberHasInvalidValue: false,
                phoneCountryPrefixHasInvalidValue: false,
                phoneNumberTooShort: false,

            },
        });
        const input = formTelephone.find('#phoneNumber');
        input.trigger('blur');
        await wrapper.vm.$nextTick();

        expect(input.classes()).toContain('has-status-error');
    });

    test('It should show the error message if phone number too short.', async () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: '123',
            },
            data: {
                phoneNumber: '123',
            },
        });
        const input = formTelephone.find('#phoneNumber');

        input.trigger('blur');
        await wrapper.vm.$nextTick();

        expect(input.classes()).toContain('has-status-error');
    });

    test('It should only allow digits and spaces as phone number.', () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: '+4312345',
            },
            data: {
                phoneNumber: '12345',
            },
        });
        const input = formTelephone.find('#phoneNumber');
        input.trigger('keypress', {
            key: 'a',
        });
        input.trigger('blur');

        expect(input.element.value).toBe('12345');
    });

    test('It should set phone prefix after selected.', () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: '+4312345',
            },
        });
        formTelephone.vm.setPhonePrefixAfterSelect({
            prefix: '43',
            label: 'Österreich',
        });

        expect(formTelephone.vm.phoneCountryPrefix.prefix).toBe('43');
    });

    test('It should set phone prefix to empty.', () => {
        const formTelephone = mount(FormTelephone, {
            propsData: {
                value: '+4312345',
            },
        });
        formTelephone.vm.setPhonePrefixAfterSelect({
            prefix: '',
            label: '',
        });

        expect(formTelephone.vm.phoneCountryPrefix.prefix).toBe('');
    });
});
