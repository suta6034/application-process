import {
    mount,
} from '../../../../tests/app/vue/utils';

import FormDatePicker from './FormDatePicker';

jest.useFakeTimers();

function wrapperFactory(options) {
    return mount(FormDatePicker, {
        ...options,
    });
}

describe('FormDatePicker', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();
        expect(wrapper.vm.$el.tagName).toBe('DIV');
    });

    test('It should return the selected date with the correct timezone.', () => {
        jest.setSystemTime(new Date('1986-04-25T00:00:00'));
        const wrapper = wrapperFactory();

        // Summer
        wrapper.find('[data-qa="date"]').setValue('1988-09-07');
        wrapper.find('[data-qa="date"]').trigger('blur');
        expect(wrapper.emitted('input')[0][0]).toBe('1988-09-07T00:00:00+02:00');

        // Winter
        wrapper.find('[data-qa="date"]').setValue('1988-12-24');
        wrapper.find('[data-qa="date"]').trigger('blur');
        expect(wrapper.emitted('input')[1][0]).toBe('1988-12-24T00:00:00+01:00');
    });

    test('It should return the selected date and time.', async () => {
        jest.setSystemTime(new Date('1986-04-25T00:00:00'));
        const wrapper = wrapperFactory({ propsData: { hasTime: true } });
        wrapper.find('[data-qa="time"]').setValue('13:37');
        wrapper.find('[data-qa="time"]').trigger('blur');

        expect(wrapper.emitted('input')[0][0]).toBe('1986-04-25T13:37:00+02:00');
    });

    test('It should update the date input when changing the time in the flatpickr.', async () => {
        const wrapper = wrapperFactory({ propsData: { hasTime: true, value: '1986-04-25T00:00:00+02:00' } });
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        const flatpickrHour = document.querySelector('.flatpickr-hour');
        flatpickrHour.value = '09';
        flatpickrHour.dispatchEvent(event);

        const flatpickrMinute = document.querySelector('.flatpickr-minute');
        flatpickrMinute.value = '37';
        flatpickrMinute.dispatchEvent(event);

        expect(wrapper.emitted('input')[0][0]).toBe('1986-04-25T09:00:00+02:00');
        expect(wrapper.emitted('input')[1][0]).toBe('1986-04-25T00:37:00+02:00');
    });
});
