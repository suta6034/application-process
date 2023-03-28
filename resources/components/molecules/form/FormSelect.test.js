import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    mount,
} from '../../../../tests/app/vue/utils';

import FormSelect from './FormSelect';

jest.mock('../../../store');

let wrapper;
let storeMocks;

const helpers = {
    clickOutside() {
        document.body.click();
    },
};

describe('FormSelect', () => {
    beforeEach(() => {
        storeMocks = createStoreMocks();
        wrapper = mount(FormSelect, {
            mocks: { $t: jest.fn() },
            propsData: {
                options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
                allowMultiple: true,
            },
            store: storeMocks.store,
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render a list of options with checkboxes when clicked.', async () => {
        expect(wrapper.contains('ul')).toBe(false);

        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="option 1"]').text()).toBe('Foo');
        expect(wrapper.contains('[data-qa="option 1"] input[type="checkbox"]')).toBe(true);
        expect(wrapper.find('[data-qa="option 2"]').text()).toBe('Bar');
        expect(wrapper.contains('[data-qa="option 2"] input[type="checkbox"]')).toBe(true);
    });

    test('It should toggle the list of options when clicking the dropdown button.', async () => {
        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="options"]')).toBe(true);

        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="options"]')).toBe(false);
    });

    test('It should toggle the list of options when clicking the button.', async () => {
        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="options"]')).toBe(true);
    });

    test('It should select option when already open and pressing enter.', async () => {
        await wrapper.vm.open();
        expect(wrapper.vm.isOpen).toBe(true);
        wrapper.find('[data-qa="button"]').trigger('keydown.enter');
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="options"]')).toBe(true);
    });

    test('It should hide the list of options when pressing ESC.', () => {
        wrapper.find('[data-qa="button"]').trigger('focus');
        wrapper.find('[data-qa="button"]').trigger('keydown.esc');

        expect(wrapper.contains('[data-qa="results"]')).toBe(false);
    });

    test('It shouldn\'t render the options list when clicked outside.', () => {
        wrapper.find('[data-qa="button"]').trigger('focus');
        helpers.clickOutside();

        expect(wrapper.contains('[data-qa="options"]')).toBe(false);
    });

    test('It should set options as checked if they match with a value.', async () => {
        wrapper.setProps({
            value: [{ label: 'Foo', id: 1 }],
            options: [{ label: 'Foo', id: 1 }, { label: 'NotBar', id: 999 }],
        });

        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="option 1"] .is-checked')).toBe(true);
        expect(wrapper.contains('[data-qa="option 2"] .is-checked')).toBe(false);
        expect(wrapper.find('[data-qa="button"]').text()).toBe('Foo');
    });

    test('It should set the label of the selected options as input value.', async () => {
        await wrapper.setProps({
            value: [
                { label: 'Foo', id: 1 },
                { label: 'Bar', id: 2 },
                { label: 'Baz', id: 3 },
            ],
        });

        expect(wrapper.find('[data-qa="button"]').text()).toBe('Foo, Bar, Baz');
    });

    test('It should add the label to the input value if an option is checked.', async () => {
        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="option 1"] input[type="checkbox"]').trigger('click');
        expect(wrapper.emitted().change).toEqual([[[{ id: 1, label: 'Foo' }]]]);
    });

    test('It should remove the label from the input value if an option is unchecked.', async () => {
        wrapper.setProps({
            value: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });

        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="option 2"] input[type="checkbox"]').trigger('click');
        expect(wrapper.emitted().change).toEqual([[[{ id: 1, label: 'Foo' }]]]);
    });

    test('It should hide the options when clicking an option.', async () => {
        wrapper.setProps({
            value: { label: 'Foo', id: 1 },
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
            allowMultiple: false,
        });

        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="option 2"] input[type="radio"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="options"]')).toBe(false);
    });

    test('It should not hide the options when clicking an option and multiple selections are allowed.', async () => {
        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="option 1"] input[type="checkbox"]').trigger('click');

        expect(wrapper.contains('[data-qa="options"]')).toBe(true);
    });

    test('It should emit the value of the clicked option.', async () => {
        wrapper.find('[data-qa="button"]').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="option 1"] input[type="checkbox"]').trigger('click');

        expect(wrapper.emitted().change).toEqual([[[{ id: 1, label: 'Foo' }]]]);
    });

    test('It should highlight the currently selected option when opening the dropdown.', async () => {
        await wrapper.setProps({
            allowMultiple: false,
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }, { label: 'Lorem', id: 3 }],
            value: { label: 'Lorem', id: 3 },
        });
        await wrapper.find('button').trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('.is-highlighted').element.innerHTML).not.toContain('Foo');
        expect(wrapper.find('.is-highlighted').element.innerHTML).toContain('Lorem');
    });

    describe('Component loses focus', () => {
        test('It should highlight the first value by default.', async () => {
            wrapper.setProps({
                value: [
                    { label: 'Foo', id: 1 },
                    { label: 'Bar', id: 2 },
                    { label: 'Baz', id: 3 },
                ],
            });
            wrapper.find('button').trigger('click');
            await wrapper.vm.$nextTick();

            expect(wrapper.contains('li:nth-child(1).is-highlighted')).toBe(true);
            expect(wrapper.contains('li:nth-child(2).is-highlighted')).toBe(false);
        });

        test('It should highlight the first value by default and set the focus on the first element.', async () => {
            await wrapper.setProps({
                value: [
                    { label: 'Foo', id: 1 },
                    { label: 'Bar', id: 2 },
                    { label: 'Baz', id: 3 },
                ],
            });
            wrapper.find('button').trigger('click');

            await wrapper.vm.$nextTick();

            expect(wrapper.contains('li:nth-child(1).is-highlighted')).toBe(true);
        });

        test('It should highlight the previous value when pressing arrow up.', async () => {
            wrapper.setProps({
                value: [
                    { label: 'Foo', id: 1 },
                    { label: 'Bar', id: 2 },
                    { label: 'Baz', id: 3 },
                ],
            });
            wrapper.find('button').trigger('click');
            await wrapper.vm.$nextTick();
            wrapper.find('input').trigger('keydown.down');
            wrapper.find('input').trigger('keydown.up');

            expect(wrapper.contains('li:nth-child(1).is-highlighted')).toBe(true);
        });

        test('It should highlight the last value when pressing arrow up at the start of options.', async () => {
            wrapper.setProps({
                value: [
                    { label: 'Foo', id: 1 },
                    { label: 'Bar', id: 2 },
                ],
            });
            wrapper.find('button').trigger('click');
            await wrapper.vm.$nextTick();
            wrapper.find('[data-qa="options"]').trigger('keydown.up');
            await wrapper.vm.$nextTick();

            expect(wrapper.contains('li:nth-child(2).is-highlighted')).toBe(true);
        });

        test('It should highlight the first value when pressing arrow down at the end of options.', async () => {
            await wrapper.setProps({
                value: [
                    { label: 'Foo', id: 1 },
                    { label: 'Bar', id: 2 },
                    { label: 'Baz', id: 3 },
                ],
            });
            wrapper.find('button').trigger('click');
            await wrapper.vm.$nextTick();

            wrapper.find('input').trigger('keydown.down');
            wrapper.find('input').trigger('keydown.down');

            expect(wrapper.contains('li:nth-child(1).is-highlighted')).toBe(true);
        });

        test('It shouldn\'t emit a new value if the results are not opened.', () => {
            helpers.clickOutside();

            expect(wrapper.emitted().change).toBeUndefined();
        });
    });
});
