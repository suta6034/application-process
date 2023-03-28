import flushPromises from 'flush-promises';
import {
    mount,
} from '../../../../tests/app/vue/utils';

import {
    autocomplete,
} from '../../../services/autocomplete';
import {
    commitAndShowModal,
} from '../../../utils/error';
import i18n from '../../../utils/i18n';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import FormFilterSelect from './FormFilterSelect';

jest.mock('lodash/debounce', () => callback => callback);
jest.mock('../../../services/autocomplete');
jest.mock('../../../utils/error');
jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let wrapper;
let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
    wrapper = mount(FormFilterSelect, { store: storeMocks.store });
    // This should be mocked in all other tests, unless you have reasons not to!
    wrapper.vm.$t = i18n;
    autocomplete.mockReset();
    autocomplete.mockReturnValue(Promise.resolve([{ label: 'FooBar', id: 1 }]));
});

const helpers = {
    clickOutside() {
        document.body.click();
    },
    clickOption(optionSelector) {
        const search = wrapper.find(optionSelector).text();

        this.hoverOption(optionSelector);
        wrapper.find(optionSelector).trigger('click');
        // Simulate model change.
        wrapper.setData({ search });
    },
    hoverOption(optionSelector) {
        wrapper.find('input').trigger('focus');
        wrapper.find(optionSelector).trigger('mouseover');
    },
    async enterValue(value) {
        wrapper.find('input').trigger('focus');
        await wrapper.vm.$nextTick();
        wrapper.find('input').element.value = value;
        wrapper.find('input').trigger('input');
        // Simulate model change.
        wrapper.setData({ search: value });
    },
};

describe('FormFilterSelect', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should disable the native autocomplete.', () => {
        expect(wrapper.find('input').element.getAttribute('autocomplete')).toBe('off');
    });

    test('It should render a list of options when focused.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });

        expect(wrapper.find('ul').exists()).toBe(false);

        wrapper.find('input').trigger('focus');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('li:nth-child(1)').text()).toBe('Foo');
        expect(wrapper.find('li:nth-child(2)').text()).toBe('Bar');
    });

    test('It should hide the list of options when pressing TAB.', () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        wrapper.find('input').trigger('focus');
        wrapper.find('input').trigger('keydown.tab');

        expect(wrapper.find('[data-qa="results"]').exists()).toBe(false);
    });

    test('It should hide the list of options when pressing ESC.', () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        wrapper.find('input').trigger('focus');
        wrapper.find('input').trigger('keydown.esc');

        expect(wrapper.find('[data-qa="results"]').exists()).toBe(false);
    });

    test('It shouldn\'t render the options list if options are empty.', () => {
        expect(wrapper.find('ul').exists()).toBe(false);

        wrapper.find('input').trigger('focus');

        expect(wrapper.find('ul').exists()).toBe(false);
    });

    test('It shouldn\'t render the options list when clicked outside.', () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }],
        });

        wrapper.find('input').trigger('focus');
        helpers.clickOutside();

        expect(wrapper.find('ul').exists()).toBe(false);
    });

    test('It should highlight the first value by default.', async () => {
        wrapper = mount(FormFilterSelect, {
            propsData: {
                options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
            },
            mocks: { $t: jest.fn() },
        });
        wrapper.find('input').trigger('focus');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('li:nth-child(1).is-highlighted').exists()).toBe(true);
        expect(wrapper.find('li:nth-child(2).is-highlighted').exists()).toBe(false);
    });

    test('It should set the label of the currently selected option as input value.', () => {
        wrapper = mount(FormFilterSelect, {
            propsData: {
                value: { label: 'Foo', id: 1 },
                options: [{ label: 'Foo', id: 1 }],
            },
            mocks: { $t: jest.fn() },
        });

        expect(wrapper.vm.search).toBe('Foo');
    });

    test('It should set the label of the value as input value even when it\'s not in the options.', () => {
        wrapper = mount(FormFilterSelect, {
            propsData: {
                value: { label: 'Foo', id: 1 },
                options: [{ label: 'Bar', value: 'Bar' }],
            },
            mocks: { $t: jest.fn() },
        });

        expect(wrapper.vm.search).toBe('Foo');
    });

    test('It should set the search value when the value changes.', async () => {
        wrapper.setProps({
            value: { label: 'Foo', id: 1 },
            options: [{ label: 'Foo', id: 1 }],
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.search).toBe('Foo');
    });

    test('It should filter the options by the given input value (case-insensitive).', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        await helpers.enterValue('bar');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('li:nth-child(1)').text()).toBe('Bar');
    });

    test('It should highlight the first matching value.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        await helpers.enterValue('bar');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('li:nth-child(1).is-highlighted').exists()).toBe(true);
    });

    test('It should highlight the next value when pressing arrow down.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        wrapper.find('input').trigger('focus');
        await wrapper.vm.$nextTick();
        wrapper.find('input').trigger('keydown.down');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('li:nth-child(2).is-highlighted').exists()).toBe(true);
    });

    test('It should highlight the first value when pressing arrow down at the end of options.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        wrapper.find('input').trigger('focus');
        wrapper.find('input').trigger('keydown.down');
        wrapper.find('input').trigger('keydown.down');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('li:nth-child(1).is-highlighted').exists()).toBe(true);
    });

    test('It should highlight the previous value when pressing arrow up.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        wrapper.find('input').trigger('focus');
        await wrapper.vm.$nextTick();
        wrapper.find('input').trigger('keydown.down');
        wrapper.find('input').trigger('keydown.up');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('li:nth-child(1).is-highlighted').exists()).toBe(true);
    });

    test('It should highlight the last value when pressing arrow up at the start of options.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        wrapper.find('input').trigger('focus');
        await wrapper.vm.$nextTick();
        wrapper.find('input').trigger('keydown.up');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('li:nth-child(2).is-highlighted').exists()).toBe(true);
    });

    test('It should be possible to disable the input field', () => {
        wrapper = mount(FormFilterSelect, {
            store: storeMocks.store,
            attrs: {
                disabled: true,
            },
            mocks: { $t: jest.fn() },
        });

        expect(wrapper.find('input').is('[disabled]')).toBe(true);
    });

    test('It should hide the options when clicking an option.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }],
        });
        wrapper.find('input').trigger('focus');
        await wrapper.vm.$nextTick();
        helpers.clickOption('li');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('ul').exists()).toBe(false);
    });

    test('It should emit a native change event when clicking an option.', async () => {
        const mockCallback = jest.fn();
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }],
        });
        wrapper.vm.$el.querySelector('input').addEventListener('change', mockCallback);
        wrapper.find('input').trigger('focus');
        await wrapper.vm.$nextTick();
        helpers.clickOption('li');

        expect(mockCallback).toBeCalled();
    });

    test('It should emit the value of the clicked option.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }],
        });
        wrapper.find('input').trigger('focus');
        await wrapper.vm.$nextTick();

        helpers.clickOption('li');

        expect(wrapper.emitted().change).toEqual([[{ label: 'Foo', id: 1 }]]);
    });

    test('It should update the invalid state and reset the value when an invalid value is entered.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
        });
        await helpers.enterValue('Baz');
        wrapper.find('input').trigger('keydown.enter');

        expect(wrapper.emitted()['update:invalid']).toEqual([[true]]);
        expect(wrapper.emitted().change).toEqual([[{}]]);
    });

    test('It should reset the invalid state when a new value is set.', async () => {
        wrapper.setProps({
            options: [{ label: 'Foo', id: 1 }],
        });
        wrapper.find('input').trigger('focus');
        await wrapper.vm.$nextTick();

        helpers.clickOption('li');

        expect(wrapper.emitted()['update:invalid']).toEqual([[false]]);
    });

    test('It should emit the current highlighted option value when `ENTER` is pressed.', () => {
        wrapper = mount(FormFilterSelect, {
            propsData: {
                options: [{ label: 'Foo', id: 1 }],
            },
            mocks: { $t: jest.fn() },
        });
        wrapper.find('input').trigger('focus');
        wrapper.find('input').trigger('keydown.enter');

        expect(wrapper.emitted().change).toEqual([[{ label: 'Foo', id: 1 }]]);
    });

    test('It should act like a default form element if no element is highligthed.', () => {
        wrapper = mount(FormFilterSelect, {
            propsData: {
                options: [{ label: 'Foo', id: 1 }],
                highlightedIndexDefault: -1,
            },
            mocks: { $t: jest.fn() },
        });
        wrapper.find('input').trigger('focus');
        wrapper.find('input').trigger('keydown.enter');

        expect(wrapper.emitted().change).toBeFalsy();
    });

    test('It should fetch options if long enough text is entered.', async () => {
        wrapper.setProps({ endpoint: 'foo' });
        await helpers.enterValue('foobar');

        expect(autocomplete).toHaveBeenLastCalledWith({
            filters: { prefix: 'foobar' },
            type: 'foo',
        });
    });

    test('It should render fetched options.', async () => {
        wrapper.setProps({ endpoint: 'foo' });
        await helpers.enterValue('foobar');

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(wrapper.find('li').exists()).toBe(true);
    });

    test('It should allow input digits only.', async () => {
        wrapper.setProps({ endpoint: 'foo', allowDigitsOnly: true });
        const input = wrapper.find('input');
        input.trigger('keypress', {
            key: 'f',
        });

        await wrapper.vm.$nextTick();

        expect(input.element.value).toBe('');
    });

    test('It should not allow more than max characters allowed.', async () => {
        wrapper.setProps({
            endpoint: 'foo',
            maxCharactersAllowed: 3,
        });
        await helpers.enterValue('123');
        const input = wrapper.find('input');
        input.trigger('keypress', {
            key: '4',
        });

        await wrapper.vm.$nextTick();

        expect(input.element.value.length).toBe(3);
    });

    describe('Error while fetching options', () => {
        test('It should open a modal.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            autocomplete.mockReturnValue(Promise.reject(new Error()));

            await helpers.enterValue('foobar');
            await wrapper.vm.$nextTick();

            expect(commitAndShowModal).toBeCalled();
        });
    });

    describe('Clearing the input value', () => {
        test('It should clear the fetched options.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('foobar');

            // Wait for autocomplete.
            await wrapper.vm.$nextTick();

            await helpers.enterValue('');

            expect(wrapper.vm.fetchedAdaptedOptions).toEqual([]);
        });

        test('It shouldn\'t show the options.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('foo');

            // Wait for autocomplete.
            await flushPromises();

            helpers.clickOption('li');
            autocomplete.mockReturnValue(Promise.resolve([]));
            await helpers.enterValue('');

            // Wait for autocomplete.
            await flushPromises();

            expect(wrapper.find('li').exists()).toBe(false);
        });
    });

    describe('Add button icon provided', () => {
        beforeEach(() => {
            wrapper = mount(FormFilterSelect, {
                propsData: {
                    allowNew: true,
                },
                slots: { icon: '<span></span>' },
                mocks: { $t: jest.fn() },
            });
        });

        test('It should show the add button if the search field is not empty.', async () => {
            await helpers.enterValue('Ba');
            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="add button"]').exists()).toBe(true);
        });

        test('It should hide the add button if the search field is empty.', () => {
            expect(wrapper.find('[data-qa="add button"]').exists()).toBe(false);
        });

        test('It should emit the value of the search input when clicking the add button.', async () => {
            await helpers.enterValue('Ba');
            await wrapper.vm.$nextTick();
            wrapper.find('[data-qa="add button"]').trigger('click');

            expect(wrapper.emitted().change).toEqual([[{ label: 'Ba', id: null }]]);
        });
    });

    describe('New values are allowed', () => {
        test('It should add the input value as first option and highlight it if new values are allowed.', async () => {
            wrapper.setProps({
                options: [{ label: 'Foo', id: 1 }],
                allowNew: true,
            });
            await helpers.enterValue('Fo');

            expect(wrapper.find('li:nth-child(1).is-highlighted').text()).toBe('Fo');
        });

        test('It shouldn\'t render an option with the same label as current search.', async () => {
            wrapper.setProps({
                options: [{ label: 'Foo', id: 'Foo' }, { label: 'Bar', id: 'Bar' }],
                allowNew: true,
            });
            await helpers.enterValue('Foo');

            expect(wrapper.find('li:nth-child(2)').exists()).toBe(false);
        });

        test('It should highlight the new value first option if a value was selected previously.', async () => {
            wrapper.setProps({
                options: [{ label: 'Foo', id: 'Foo' }, { label: 'Bar', id: 'Bar' }],
                allowNew: true,
            });
            await wrapper.find('input').trigger('focus');

            helpers.clickOption('li');
            await helpers.enterValue('Fo');

            expect(wrapper.find('li:nth-child(1).is-highlighted').text()).toBe('Fo');
        });

        test(
            'It should emit the current highlighted value when `ENTER` is pressed and new values are allowed.',
            async () => {
                wrapper.setProps({
                    allowNew: true,
                });
                await helpers.enterValue('Foo');
                wrapper.find('input').trigger('keydown.enter');

                expect(wrapper.emitted().change).toEqual([[{ label: 'Foo', id: null }]]);
            },
        );

        test('It should be deactivated when a new value was added.', () => {
            wrapper.setProps({
                allowNew: true,
            });
            wrapper.find('input').trigger('focus');
            wrapper.find('input').trigger('keydown.enter');

            expect(wrapper.vm.isOpen).toBe(false);
        });

        test('It should render the options again when starting to type after adding a new value.', async () => {
            wrapper.setProps({
                allowNew: true,
            });
            await helpers.enterValue('Foo');
            wrapper.find('input').trigger('keydown.enter');
            await helpers.enterValue('Foo');

            expect(wrapper.find('ul').exists()).toBe(true);
        });
    });

    describe('Separators are activated', () => {
        test('It should emit the existing value if a separator value is inserted.', async () => {
            wrapper.setProps({
                allowNew: true,
                autoSelectOnSeparator: true,
            });
            await helpers.enterValue('MySQL,');

            expect(wrapper.emitted().change).toEqual([[{ label: 'MySQL', id: null }]]);
        });

        test('It shouldn\'t emit a new value if a normal character is inserted.', async () => {
            wrapper.setProps({
                autoSelectOnSeparator: true,
            });
            await helpers.enterValue('Abc');

            expect(wrapper.emitted().change).toBeUndefined();
        });

        test('It shouldn\'t emit a new value if a separator is inserted at the beginning.', async () => {
            wrapper.setProps({
                autoSelectOnSeparator: true,
            });
            await helpers.enterValue(',');

            expect(wrapper.emitted().change).toBeUndefined();
        });
    });

    describe('Component loses focus', () => {
        test('It shouldn\'t emit a new value if the results are not opened.', () => {
            helpers.clickOutside();

            expect(wrapper.emitted().change).toBeUndefined();
        });

        test('It shouldn\'t emit a new value if the current search matches the current value.', async () => {
            wrapper.setProps({
                options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
                value: { label: 'Foo', id: 1 },
            });
            await helpers.enterValue('Foo');
            helpers.clickOutside();

            expect(wrapper.emitted().change).toBeUndefined();
        });

        test('It should emit the current highlighted value if it matches the search and it is open.', async () => {
            wrapper.setProps({
                options: [{ label: 'Foo (foo)', id: 1 }, { label: 'Foo', id: 2 }],
            });
            await helpers.enterValue('Foo');
            wrapper.find('input').trigger('keydown.down');
            wrapper.find('input').trigger('keydown.enter');

            expect(wrapper.emitted('change')[0]).toEqual([{ label: 'Foo', id: 2 }]);

            wrapper.find('input').trigger('keydown.tab');

            expect(wrapper.emitted('change')[1]).toBeUndefined();
        });

        test('It should emit the current highlighted value if it matches the search (case-insensitive).', async () => {
            wrapper.setProps({
                options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
            });
            await helpers.enterValue('bar');
            helpers.clickOutside();

            expect(wrapper.emitted().change).toEqual([[{ label: 'Bar', id: 2 }]]);
        });

        test('It should emit the current highlighted value if it matches the search (trailing spaces).', async () => {
            wrapper.setProps({
                options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
            });
            await helpers.enterValue(' Bar  ');
            helpers.clickOutside();

            expect(wrapper.emitted().change).toEqual([[{ label: 'Bar', id: 2 }]]);
        });

        test(
            'It should update the invalid state and reset the value if new value does not match a result.',
            async () => {
                wrapper.setProps({
                    options: [{ label: 'Foo', id: 1 }, { label: 'Bar', id: 2 }],
                });
                await helpers.enterValue('Ba');
                helpers.clickOutside();

                expect(wrapper.emitted()['update:invalid']).toEqual([[true]]);
                expect(wrapper.emitted().change).toEqual([[{}]]);
            },
        );

        test('It should emit an empty value if the new value is empty.', async () => {
            await helpers.enterValue('');
            helpers.clickOutside();

            expect(wrapper.emitted().change).toEqual([[{}]]);
        });

        describe('New values are allowed', () => {
            test('It should emit the current highlighted new value.', async () => {
                wrapper.setProps({ allowNew: true });
                await helpers.enterValue('Ba');
                helpers.clickOutside();

                expect(wrapper.emitted().change).toEqual([[{ label: 'Ba', id: null }]]);
            });
        });
    });

    describe('User clicks outside and auto adding on focus lost is disabled', () => {
        test('It shouldn\'t emit a new value.', async () => {
            wrapper.setProps({
                autoSelectOnFocusLost: false,
            });
            await helpers.enterValue('Ba');
            helpers.clickOutside();

            expect(wrapper.emitted().change).toBeUndefined();
        });

        test('It shouldn\'t show the options.', async () => {
            wrapper.setProps({
                endpoint: 'foo',
                autoSelectOnFocusLost: false,
            });
            await helpers.enterValue('foo');

            // Wait for autocomplete.
            await flushPromises();

            helpers.clickOutside();

            // Wait for autocomplete.
            await flushPromises();

            expect(wrapper.find('li').exists()).toBe(false);
        });
    });

    describe('No results message', () => {
        test('It should show a `no results` message if no results are found.', async () => {
            await helpers.enterValue('Baz');

            expect(wrapper.find('[data-qa="no results"]').exists()).toBe(true);
        });

        test('It shouldn\'t show a `no results` message if results are found.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('foobar');

            expect(wrapper.find('[data-qa="no results"]').exists()).toBe(false);
        });

        test('It shouldn\'t show a `no results` message if fetch threshold is not reached.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('');

            expect(wrapper.find('[data-qa="no results"]').exists()).toBe(false);
        });

        test('It shouldn\'t show a `no results` message if results are currently being fetched.', async () => {
            let resolveAutocomplete;
            autocomplete.mockReturnValue(new Promise((resolve) => {
                resolveAutocomplete = resolve;
            }));

            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('baz');

            expect(wrapper.find('[data-qa="no results"]').exists()).toBe(false);
            resolveAutocomplete([]);

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="no results"]').exists()).toBe(true);
        });

        test('It shouldn\'t show a `no results` message if it is not active.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('foobar');
            await wrapper.vm.$nextTick();
            await helpers.enterValue('baz');

            helpers.clickOutside();

            expect(wrapper.find('[data-qa="no results"]').exists()).toBe(false);
        });

        test('It shouldn\'t show a `no results` message if it is reactivated again.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('foobar');
            await wrapper.vm.$nextTick();
            await helpers.enterValue('baz');

            helpers.clickOutside();
            wrapper.find('input').trigger('focus');

            expect(wrapper.find('[data-qa="no results"]').exists()).toBe(false);
        });
    });

    describe('Input limit message (with dropdown)', () => {
        test('It should show a `limit reached` message if the input value is too long.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('Foo Bar Baz'.repeat(10));

            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="limit reached"]').exists()).toBe(true);
            expect(wrapper.find('[data-qa="limit reached"]').text()).toMatch(/100/);
        });

        test('It shouldn\'t show a `limit reached` message if the input value is below the threshold.', async () => {
            wrapper.setProps({ endpoint: 'foo' });
            await helpers.enterValue('Foo Bar Baz');

            expect(wrapper.find('[data-qa="limit reached"]').exists()).toBe(false);
        });
    });

    describe('Input limit message (without dropdown)', () => {
        test('It should show a `limit reached` message if the input value is too long.', async () => {
            wrapper.setProps({ disableDropdown: true });
            await helpers.enterValue('Foo Bar Baz'.repeat(10));

            expect(wrapper.find('[data-qa="form message"]').exists()).toBe(true);
            expect(wrapper.find('[data-qa="form message"]').text()).toMatch(/100/);
        });

        test('It shouldn\'t show a `limit reached` message if the input value is below the threshold.', async () => {
            wrapper.setProps({ disableDropdown: true });
            await helpers.enterValue('Foo Bar Baz');

            expect(wrapper.find('[data-qa="form message"]').exists()).toBe(false);
        });
    });
});
