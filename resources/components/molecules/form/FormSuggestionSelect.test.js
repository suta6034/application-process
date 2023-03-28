import {
    mount,
} from '../../../../tests/app/vue/utils';

import FormSuggestionSelect from './FormSuggestionSelect';

jest.mock('../../../store');

let wrapper;

beforeEach(() => {
    wrapper = mount(FormSuggestionSelect, {
        propsData: {
            fetchService: jest.fn(),
            value: [],
            options: [],
            allowNew: true,
        },
        mocks: { $t: jest.fn() },
    });
});

describe('FormSuggestionSelect', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit the new value when an unselected option is clicked.', async () => {
        await wrapper.setProps({
            options: [
                {
                    id: 'Foo',
                    label: 'Foo',
                },
            ],
        });

        const firstSuggestionPill = wrapper.find('[data-qa="suggested options"] > :first-child input');
        firstSuggestionPill.element.checked = true;
        firstSuggestionPill.trigger('change');

        expect(wrapper.emitted().change).toEqual([[[{ id: 'Foo', label: 'Foo' }]]]);
    });

    test(
        'It should remove the pill and emit the new value when the secondaryAction of the pill is clicked.',
        async () => {
            await wrapper.setProps({
                value: [{ id: 'foo', label: 'Foo' }],
                options: [
                    {
                        id: 'foo',
                        label: 'Foo',
                    },
                ],
            });

            const secondaryAction = wrapper
                .find('[data-qa="selected options"] > :first-child [data-qa="secondary action"]');
            secondaryAction.trigger('click');

            expect(wrapper.emitted().change).toEqual([[[]]]);
        },
    );

    test('It should emit the new value and clear the input field when a new value is entered.', async () => {
        wrapper.setProps({
            value: [],
        });

        const newValueField = wrapper.find('[data-qa="new value"]');

        newValueField.element.value = 'Foo';
        newValueField.trigger('input');
        newValueField.trigger('keydown.enter');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().change).toEqual([[[{ id: null, label: 'Foo' }]]]);
        expect(newValueField.element.value).toBe('');
    });

    test('It should disable the input field if the given max is reached.', async () => {
        await wrapper.setData({
            warning: { max: true },
        });

        expect(wrapper.find('[data-qa="new value"]').is('[disabled]')).toBe(true);
    });

    test('It shouldn\'t be possible to add the same value twice.', async () => {
        wrapper = mount(FormSuggestionSelect, {
            propsData: {
                fetchService: jest.fn(),
                value: [{ id: 'Foo', label: 'Foo' }],
                options: [],
                allowNew: true,
            },
            mocks: { $t: jest.fn() },
        });

        const newValueField = wrapper.find('[data-qa="new value"]');

        newValueField.element.value = 'Foo';
        newValueField.trigger('input');
        newValueField.trigger('keydown.enter');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().change).toBeUndefined();
    });

    test('It shouldn\'t be possible to add the same value twice, even one word is written in lower case.', async () => {
        wrapper = mount(FormSuggestionSelect, {
            propsData: {
                fetchService: jest.fn(),
                value: [{ id: 'Foo', label: 'Foo' }],
                options: [],
                allowNew: true,
            },
            mocks: { $t: jest.fn() },
        });

        const newValueField = wrapper.find('[data-qa="new value"]');

        newValueField.element.value = 'foo';
        newValueField.trigger('input');
        newValueField.trigger('keydown.enter');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().change).toBeUndefined();
    });

    test('It shouldn\'t be possible to add the same value twice, even with trailing spaces.', async () => {
        wrapper = mount(FormSuggestionSelect, {
            propsData: {
                fetchService: jest.fn(),
                value: [{ id: 'Foo', label: 'Foo' }],
                options: [],
                allowNew: true,
            },
            mocks: { $t: jest.fn() },
        });

        const newValueField = wrapper.find('[data-qa="new value"]');

        newValueField.element.value = ' Foo ';
        newValueField.trigger('input');
        newValueField.trigger('keydown.enter');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().change).toBeUndefined();
    });

    test('It shouldn\'t suggest an already selected value.', () => {
        wrapper.setProps({
            options: [{ id: 'Foo', label: 'Foo' }],
            value: [{ id: 1, label: 'Foo' }],
        });

        wrapper.vm.$forceUpdate();

        expect(wrapper.contains('[data-qa="suggested options"] [data-qa="pill"]')).toBe(false);
    });

    test('It shouldn\'t suggest an already removed value.', async () => {
        await wrapper.setProps({
            options: [{ id: 'Foo', label: 'Foo' }],
            value: [{ id: 1, label: 'Foo' }],
        });

        const secondaryAction = wrapper
            .find('[data-qa="selected options"] > :first-child [data-qa="secondary action"]');
        secondaryAction.trigger('click');

        expect(wrapper.contains('[data-qa="suggested options"] [data-qa="pill"]')).toBe(false);
    });

    test('It shouldn\'t be possible to add more than max values.', async () => {
        wrapper.setProps({
            max: 1,
            value: [{ id: 'Bar', label: 'Bar' }],
        });

        const newValueField = wrapper.find('[data-qa="new value"]');

        newValueField.element.value = 'Foo';
        newValueField.trigger('input');
        await wrapper.vm.$nextTick();
        newValueField.trigger('keydown.enter');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().change).toBeUndefined();
    });

    test('It should remove the max values warning if there are less then max values selected.', async () => {
        wrapper.setProps({
            max: 3,
            value: [{ id: 'Bar', label: 'Bar' }, { id: 'Foo', label: 'Foo' }],
        });

        const newValueField = wrapper.find('[data-qa="new value"]');

        newValueField.element.value = 'Baz';
        newValueField.trigger('input');
        newValueField.trigger('keydown.enter');

        // Simulate v-model update.
        wrapper.setProps({
            value: [{ id: 'Bar', label: 'Bar' }, { id: 'Foo', label: 'Foo' }, { id: 'Baz', label: 'Baz' }],
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="warning max"]')).toBe(true);

        const secondaryAction = wrapper
            .find('[data-qa="selected options"] > :first-child [data-qa="secondary action"]');

        // Simulate v-model update.
        wrapper.setProps({
            value: [{ id: 'Bar', label: 'Bar' }, { id: 'Foo', label: 'Foo' }],
        });

        secondaryAction.trigger('click');

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="warning max"]')).toBe(false);
    });

    test('It shouldn\'t be possible to add an empty value.', async () => {
        const newValueField = wrapper.find('[data-qa="new value"]');

        newValueField.element.value = '';
        newValueField.trigger('input');
        newValueField.trigger('keydown.enter');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().change).toBeUndefined();
    });

    test('It shouldn\'t be possible to add a spaces only value.', async () => {
        const newValueField = wrapper.find('[data-qa="new value"]');

        newValueField.element.value = '  ';
        newValueField.trigger('input');
        newValueField.trigger('keydown.enter');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().change).toBeUndefined();
    });
});
