import {
    mount,
} from '../../../../tests/app/vue/utils';

import FormDateInput from './FormDateInput';

let wrapper;

const helpers = {
    findField(fieldType) {
        return wrapper.find(`[data-qa="${fieldType} field"]`);
    },
    async setFieldValueWithoutKeyboard({ field, value }) {
        field.trigger('focus');
        await wrapper.vm.$nextTick();
        field.setValue(value);
    },
    async setFieldValue({ field, value }) {
        await this.setFieldValueWithoutKeyboard({ field, value });

        field.trigger('keyup');
    },
};

beforeEach(() => {
    wrapper = mount(FormDateInput);
});

describe('FormDateInput', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName === 'DIV').toBe(true);
    });

    describe('Limit characters', () => {
        test('It shouldn\'t be possible to enter a day with more than 2 digits.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('day'), value: '311' });

            await wrapper.vm.$nextTick();

            expect(helpers.findField('day').element.value).toBe('31');
        });

        test('It shouldn\'t be possible to enter a month with more than 2 digits.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('month'), value: '122' });

            await wrapper.vm.$nextTick();

            expect(helpers.findField('month').element.value).toBe('12');
        });

        test('It shouldn\'t be possible to enter a year with more than 4 digits.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('year'), value: '20188' });

            await wrapper.vm.$nextTick();

            expect(helpers.findField('year').element.value).toBe('2018');
        });
    });

    describe('Auto focus fields', () => {
        test('It should focus the month field if a day > 3 is entered.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('day'), value: '4' });

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="month field"]:focus').exists()).toBe(true);
        });

        test('It should focus the month field if a day with two digits was entered.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('day'), value: '01' });

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="month field"]:focus').exists()).toBe(true);
        });

        test('It should focus the year field if a day > 3 is entered and the month is disabled.', async () => {
            wrapper.setProps({ showMonth: false });

            await wrapper.vm.$nextTick();

            await helpers.setFieldValue({ field: helpers.findField('day'), value: '4' });

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="year field"]:focus').exists()).toBe(true);
        });

        test('It should keep the focus in the day field if it is cleared.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('day'), value: '' });

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="day field"]:focus').exists()).toBe(true);
        });

        test('It should focus the year field if a month > 1 is entered.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('month'), value: '2' });

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="year field"]:focus').exists()).toBe(true);
        });

        test('It should focus the year field if a month with two digits was entered.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('month'), value: '01' });

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="year field"]:focus').exists()).toBe(true);
        });

        test('It should keep the focus in the month field if it is cleared.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('month'), value: '' });

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="month field"]:focus').exists()).toBe(true);
        });

        test(
            'It should keep the focus in the month field if a month > 1 is entered and the year is disabled.',
            async () => {
                wrapper.setProps({ showYear: false });
                await wrapper.vm.$nextTick();
                await helpers.setFieldValue({ field: helpers.findField('month'), value: '2' });

                await wrapper.vm.$nextTick();

                expect(wrapper.find('[data-qa="month field"]:focus').exists()).toBe(true);
            },
        );
    });

    describe('Pad fields', () => {
        test('It should pad the day field if a single digit value is entered.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('day'), value: '9' });
            helpers.findField('day').trigger('blur');

            await wrapper.vm.$nextTick();

            expect(helpers.findField('day').element.value).toBe('09');
        });

        test('It should pad the month field if a single digit value is entered.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('month'), value: '9' });
            helpers.findField('month').trigger('blur');

            await wrapper.vm.$nextTick();

            expect(helpers.findField('month').element.value).toBe('09');
        });

        test('It should pad the year field if a three digit value is entered.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('year'), value: '999' });
            helpers.findField('year').trigger('blur');

            await wrapper.vm.$nextTick();

            expect(helpers.findField('year').element.value).toBe('0999');
        });
    });

    describe('Entering data', () => {
        test('It should emit a valid ISO 8601 date.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('day'), value: '1' });
            await helpers.setFieldValue({ field: helpers.findField('month'), value: '1' });
            await helpers.setFieldValue({ field: helpers.findField('year'), value: '2017' });

            expect(wrapper.emitted().input[0]).toEqual(['0000-01-01T00:00:00+00:00']);
            expect(wrapper.emitted().input[1]).toEqual(['0000-01-01T00:00:00+00:00']);
            expect(wrapper.emitted().input[4]).toEqual(['2017-01-01T00:00:00+00:00']);
        });

        test('It should emit a valid ISO 8601 date if only the year is given.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('year'), value: '2017' });

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0]).toEqual(['2017-01-01T00:00:00+00:00']);
        });

        test('It should update the value when a field changes without keyboard input.', async () => {
            await helpers.setFieldValueWithoutKeyboard({ field: helpers.findField('day'), value: '10' });

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0]).toEqual(['0000-01-10T00:00:00+00:00']);
        });

        test('It should reset the value if all fields are empty.', async () => {
            await helpers.setFieldValue({ field: helpers.findField('day'), value: '1' });
            await helpers.setFieldValue({ field: helpers.findField('day'), value: '' });
            await helpers.setFieldValue({ field: helpers.findField('month'), value: '' });
            await helpers.setFieldValue({ field: helpers.findField('year'), value: '' });

            expect(wrapper.emitted().input[1]).toEqual([null]);
        });
    });

    describe('Input loses focus', () => {
        test('It should emit a `blurLastField` event if all fields were focused.', () => {
            helpers.findField('day').trigger('focus');
            helpers.findField('month').trigger('focus');
            helpers.findField('month').trigger('blur');

            expect(wrapper.emitted().blurLastField).toBeUndefined();

            helpers.findField('year').trigger('focus');
            helpers.findField('year').trigger('blur');

            expect(wrapper.emitted().blurLastField).toBeDefined();
        });

        test(
            'It should emit a `blurLastField` event if one field does not exist and the others were focused.',
            async () => {
                wrapper.setProps({ showYear: false });
                await wrapper.vm.$nextTick();
                helpers.findField('day').trigger('focus');
                helpers.findField('month').trigger('focus');
                helpers.findField('month').trigger('blur');

                expect(wrapper.emitted().blurLastField).toBeDefined();
            },
        );

        test(
            'It should emit a `blurLastField` event if two fields do not exist and the last was focused.',
            async () => {
                wrapper.setProps({ showDay: false, showMonth: false });
                await wrapper.vm.$nextTick();
                helpers.findField('year').trigger('focus');
                helpers.findField('year').trigger('blur');

                expect(wrapper.emitted().blurLastField).toBeDefined();
            },
        );

        test('It should emit a `blurLastField` event if all fields have a value.', () => {
            wrapper = mount(FormDateInput, {
                propsData: { value: '1988-09-07' },
            });
            helpers.findField('year').trigger('blur');

            expect(wrapper.emitted().blurLastField).toBeDefined();
        });
    });
});
