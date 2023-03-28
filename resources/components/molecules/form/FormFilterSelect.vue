<script setup>
import {
    computed, nextTick, ref, watchEffect, inject,
} from 'vue';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';

import {
    autocomplete,
} from '../../../services/autocomplete';
import {
    commitAndShowModal,
} from '../../../utils/error';
import FormElement from './FormElement';
import FormInput from '../../atoms/form/FormInput';
import FormMessage from '../../atoms/form/FormMessage';
import AppIcon from '../../atoms/app/AppIcon';

import {
    strings,
} from '../../../lang/notification';
import '../../../lang/validation';

import '../../../directives/click-outside';
import {
    formOptionSelectEvents,
    formOptionSelectProps, useFormOptionSelect,
} from '../../../composables/form-option-select';

const FETCH_TIMEOUT_IN_MS = 200;
const INPUT_SEPARATORS = [',', ';', '|'];

const props = defineProps({
    ...formOptionSelectProps,
    allowDigitsOnly: {
        default: false,
        type: Boolean,
    },
    allowNew: {
        default: false,
        type: Boolean,
    },
    allowReset: {
        default: false,
        type: Boolean,
    },
    autocompleteAdapter: {
        type: Function,
    },
    autoSelectOnFocusLost: {
        default: true,
        type: Boolean,
    },
    autoSelectOnlyOptionOnBlur: {
        default: false,
        type: Boolean,
    },
    autoSelectOnSeparator: {
        default: false,
        type: Boolean,
    },
    defaultAutoCompleteIcon: {
        default: null,
        type: String,
    },
    disableDropdown: {
        default: false,
        type: Boolean,
    },
    endpoint: {
        type: String,
    },
    fetchThreshold: {
        default: 1,
        type: Number,
    },
    filters: {
        default: () => ({}),
        type: Object,
    },
    hasClearButton: {
        default: 'never',
        type: String,
        validator(value) {
            return ['never', 'always', 'auto'].includes(value);
        },
    },
    highlightedIndexDefault: {
        default: 0,
        type: Number,
    },
    inputLimit: {
        default: 100,
        type: Number,
    },
    inputName: {
        default: null,
        type: String,
    },
    invalid: {
        default: false,
        type: Boolean,
    },
    isDockedRight: {
        default: false,
        type: Boolean,
    },
    maxCharactersAllowed: {
        default: 0,
        type: Number,
    },
    maxOptions: {
        default: 0,
        type: Number,
    },
    maxDropdownItems: {
        default: null,
        type: Number,
    },
    noResultMessage: {
        default: strings.notification.noResult,
        type: String,
    },
    optionPrefix: {
        default: '',
        type: String,
    },
    options: {
        default: () => [],
        type: Array,
    },
    optionsStatic: {
        default: () => [],
        type: Array,
    },
    resultsAdaptiveWidth: {
        default: false,
        type: Boolean,
    },
    small: {
        default: false,
        type: Boolean,
    },
    status: {
        type: String,
    },
    white: {
        default: false,
        type: Boolean,
    },
    ariaLabel: {
        type: String,
    },
});

const emit = defineEmits(['search', 'clear', 'blur', ...formOptionSelectEvents]);

const {
    adaptedOptions,
    updateValue,
    adaptedValue,
    isValidAdaptedOption,
} = useFormOptionSelect(props, emit);

const fetchedAdaptedOptions = ref([]);
const fetching = ref(false);
const highlightedIndex = ref(props.highlightedIndexDefault);
const isOpen = ref(false);
const limitReached = ref(false);
const search = ref('');

const trimmedSearch = computed(() => {
    let trimmedSearch = search.value;
    if (trimmedSearch && typeof trimmedSearch === 'string') {
        trimmedSearch = trimmedSearch.trim();
    }

    if (props.autoSelectOnSeparator) {
        INPUT_SEPARATORS.forEach((separator) => {
            trimmedSearch = trimmedSearch.replace(separator, '');
        });
    }

    return trimmedSearch;
});

const fetchThresholdReached = computed(() => search.value.length >= props.fetchThreshold);

const filteredAdaptedOptions = computed(() => {
    let filteredAdaptedOptions = adaptedOptions.value;

    if (props.allowNew && trimmedSearch.value.length) {
        const newOption = {
            id: trimmedSearch.value,
            label: trimmedSearch.value,
            value: props.valueAdapter(trimmedSearch.value),
        };
        filteredAdaptedOptions = [newOption, ...filteredAdaptedOptions];
    }

    filteredAdaptedOptions = filteredAdaptedOptions.filter(
        ({ label }) => label.toLowerCase().startsWith(trimmedSearch.value.toLowerCase()),
    );

    if (props.maxOptions) { // e.g.: reduce last searches (options) to 3 items
        filteredAdaptedOptions = filteredAdaptedOptions.slice(0, props.maxOptions);
    }

    let result = uniqBy(filteredAdaptedOptions.concat(fetchedAdaptedOptions.value), 'label');

    if (props.maxDropdownItems) result = result.slice(0, props.maxDropdownItems);

    return result;
});

const hasResults = computed(() => filteredAdaptedOptions.value.length > 0);

const showDropdown = computed(() => !props.disableDropdown
    && isOpen.value && (hasResults.value || showNoResultsMessage.value));

const showNoResultsMessage = computed(() => {
    if (props.highlightedIndexDefault < 0) return false;
    if (props.endpoint && !fetchThresholdReached.value) return false;

    return !hasResults.value && !fetching.value;
});

const fallbackAdapter = ({ label }) => props.valueAdapter(label);
const autocompleteAdapterWithFallback = props.autocompleteAdapter ?? fallbackAdapter;

function handleInput(value, event) {
    // Ignore custom events, to avoid endless loops and race conditions.
    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    if (event && event.detail === 'custom') return;

    // Don't allow separators as first character, comma as only char will break the autocomplete request
    if (INPUT_SEPARATORS.includes(search.value)) {
        search.value = '';
        return;
    }

    if (!isOpen.value) open();

    if (props.autoSelectOnSeparator && typeof value === 'string') {
        // This input event also triggers a reset in the parent `FormSuggestionSelect` component.
        // This is important if the previous selection triggered a validation error or warning.
        // We wait until possible resets were executed and handle the input afterwards.
        nextTick(() => handleSeparator(value));
    }

    if (props.endpoint) {
        fetching.value = true;
        debouncedFetchOptions();
    }

    emit('search', { value });
}

function handleTab() {
    if (props.autoSelectOnFocusLost) {
        selectExactMatch();
    } else {
        close();
    }
}

function handleSeparator(value) {
    const containsSeparator = INPUT_SEPARATORS.some((separator) => {
        if (value.replace(separator, '') === '') return false;
        return value.includes(separator);
    });

    if (containsSeparator) selectExactMatch();
}

const formInput = ref(null);
function handleClear() {
    search.value = '';
    emit('clear');
    formInput.value.inputField.focus();
}

function handleLimit(reached) {
    limitReached.value = reached;
}

function handleEnter(e) {
    if (!isOpen.value || highlightedIndex.value < 0) return;
    if (showDropdown.value) e.preventDefault();
    selectHighlighted();
}

function open() {
    isOpen.value = true;
}

function close() {
    isOpen.value = false;
    emit('blur');
}

function clickOutside() {
    if (!isOpen.value) return;

    const searchMatchesCurrentValue = adaptedValue.value.label
        ? adaptedValue.value.label.toLowerCase() === trimmedSearch.value.toLowerCase()
        : false;

    if (props.autoSelectOnFocusLost && !searchMatchesCurrentValue) {
        selectExactMatch();
    } else {
        close();
    }
}

const root = ref(null);
function select(adaptedOption) {
    const isInvalid = !isValidAdaptedOption(adaptedOption) && trimmedSearch.value.length > 0;
    let option = checkSelectedOption(adaptedOption)
        ? checkSelectedOption(adaptedOption) : adaptedOption;

    highlightedIndex.value = props.highlightedIndexDefault;
    /* istanbul ignore next: Hard to test – tested in acceptance tests. */
    if (props.allowReset && search.value.length === 0 && adaptedValue.value.label === option.label) {
        /* istanbul ignore next: Hard to test – tested in acceptance tests. */
        option = { id: '', label: '', value: '' };
    }
    updateValue(option, isInvalid);
    // Emit a native change event to make it possible to listen for changes with a native capture event handler.
    root.value.querySelector('input').dispatchEvent(new CustomEvent('change', { detail: 'custom' }));
    close();
}

function selectHighlighted() {
    select(filteredAdaptedOptions.value[highlightedIndex.value]);
}

function selectExactMatch() {
    if (!isOpen.value) return;

    const hasNoHighlightedOption = highlightedIndex.value === -1;
    if (hasNoHighlightedOption) {
        close();
        return;
    }

    const highlightedOption = filteredAdaptedOptions.value[highlightedIndex.value];
    let searchMatchesHighlightedOption = highlightedOption
        && trimmedSearch.value.toLowerCase() === highlightedOption.label.toLowerCase();
    if (props.autoSelectOnlyOptionOnBlur && filteredAdaptedOptions.value.length === 1) {
        searchMatchesHighlightedOption = highlightedOption;
    }
    if (searchMatchesHighlightedOption || props.allowNew) {
        selectHighlighted();
    } else {
        select();
    }
}

function selectSearch() {
    select(filteredAdaptedOptions.value[0]);
}

function highlight(index) {
    highlightedIndex.value = index;

    if (highlightedIndex.value < 0) {
        highlightedIndex.value = filteredAdaptedOptions.value.length - 1;
    }

    if (highlightedIndex.value > filteredAdaptedOptions.value.length - 1) {
        highlightedIndex.value = 0;
    }
}

function highlightPrev() {
    highlight(highlightedIndex.value - 1);
}

function highlightNext() {
    highlight(highlightedIndex.value + 1);
}

function checkSelectedOption(option) {
    if (fetchedAdaptedOptions.value && fetchedAdaptedOptions.value.length > 0 && option) {
        const matchedOption = fetchedAdaptedOptions.value
            .filter(item => item.label.toLocaleLowerCase() === option.label.toLocaleLowerCase());
        if (matchedOption.length > 0) return matchedOption[0];
    }
    return false;
}

function checkKeyInput(evt) {
    if (typeof evt === 'undefined' || typeof evt.key === 'undefined') return;

    const keyCode = evt.key.charCodeAt(0);
    const isCharacterSelected = (root.value.querySelector('input').selectionEnd
        - root.value.querySelector('input').selectionStart) > 0;

    if (isCharacterSelected) return;

    const maximumIsReached = search.value.length >= props.maxCharactersAllowed;

    if (props.maxCharactersAllowed > 0 && keyCode !== 66 && keyCode !== 84 && maximumIsReached) {
        evt.preventDefault();
        return;
    }

    const targetKey = keyCode > 31 && (keyCode < 48 || keyCode > 57) && keyCode !== 66 && keyCode !== 84;

    if (props.allowDigitsOnly && targetKey) {
        evt.preventDefault();
    }
}

const store = inject('store');
async function fetchOptions() {
    try {
        if (fetchThresholdReached.value) {
            if (!search.value || search.value.trim().length === 0) return;
            const autocompleteResult = await autocomplete({
                filters: { ...props.filters, prefix: search.value },
                type: props.endpoint,
            });
            fetchedAdaptedOptions.value = autocompleteResult.map(item => ({
                id: item.id,
                label: item.label,
                value: autocompleteAdapterWithFallback(item),
                icon: props.defaultAutoCompleteIcon,
            }));
        } else {
            fetchedAdaptedOptions.value = [];
        }
        fetching.value = false;
    } catch (error) {
        commitAndShowModal(store.commit, error);
        // Prevent triggering fetching immediately again after closing the modal.
        search.value = '';
    }
}
const debouncedFetchOptions = debounce(fetchOptions, FETCH_TIMEOUT_IN_MS, { leading: true });

watchEffect(() => {
    search.value = adaptedValue.value && adaptedValue.value.label ? adaptedValue.value.label : '';
});

defineExpose({ search, filteredAdaptedOptions, fetchedAdaptedOptions, isOpen });
</script>

<script>
export default {
    inheritAttrs: false,
    model: {
        event: 'change',
    },
};
</script>

<template>
    <div
        ref="root"
        v-click-outside="clickOutside"
        :class="{
            'is-open': isOpen,
            'has-icon': $slots.icon && search.length,
        }"
        class="c-formFilterSelect"
    >
        <FormElement>
            <FormInput
                ref="formInput"
                v-model="search"
                :name="inputName"
                :status="status"
                :dropdown="showDropdown"
                :limit="inputLimit"
                :is-docked-right="isDockedRight"
                :has-clear-button="hasClearButton"
                :small="small"
                :aria-label="ariaLabel"
                v-bind="$attrs"
                autocomplete="off"
                aria-autocomplete="both"
                :aria-activedescendant="`${hasResults ? `selected-option-${_uid}` : ''}`"
                :white="white"
                @focus="handleInput(search, $event)"
                @input="handleInput(search, $event)"
                @clear="handleClear"
                @limit-reached="handleLimit"
                @keydown="checkKeyInput"
                @keydown.up.prevent="highlightPrev"
                @keydown.down.prevent="highlightNext"
                @keydown.enter="handleEnter"
                @keydown.tab="handleTab"
                @keydown.esc="close"
            >
                <template #start>
                    <div v-if="$slots.start">
                        <slot name="start"/>
                    </div>
                </template>
                <template #end>
                    <button
                        v-if="$slots.icon && search.length"
                        class="c-formFilterSelect__icon"
                        data-qa="add button"
                        @click="selectSearch"
                    >
                        <slot name="icon"/>
                    </button>
                </template>
            </FormInput>
            <div
                v-if="showDropdown"
                :class="{ 'adaptive-width': resultsAdaptiveWidth}"
                class="c-formFilterSelect__results"
            >
                <ul
                    v-if="hasResults"
                    :id="`results-${_uid}`"
                    :aria-expanded="hasResults"
                    role="listbox"
                    tabindex="0"
                    data-qa="results"
                >
                    <li
                        v-for="(adaptedOption, index) in filteredAdaptedOptions"
                        :id="`${index === highlightedIndex ? `selected-option-${_uid}` : ''}`"
                        :key="adaptedOption.id"
                        :aria-selected="index === highlightedIndex"
                        class="c-formFilterSelect__option u-ellipsis"
                        :class="{
                            'c-formFilterSelect__option--withIcon': adaptedOption.icon,
                            'is-highlighted': index === highlightedIndex,
                        }"
                        :data-qa="`option ${index + 1}`"
                        @click="select(adaptedOption)"
                        @keydown.up.prevent="highlightPrev"
                        @keydown.down.prevent="highlightNext"
                        @keydown.enter.prevent="select(adaptedOption)"
                        @keydown.space.prevent="select(adaptedOption)"
                        @keydown.tab.prevent
                    >
                        <template v-if="adaptedOption.icon">
                            <AppIcon
                                class="c-formFilterSelect__optionIcon"
                                :name="adaptedOption.icon"
                                size="l"
                                :data-qa="`icon ${adaptedOption.icon} ${index + 1}`"
                            />
                            <span class="c-formFilterSelect__optionText">
                                {{ `${optionPrefix}${adaptedOption.label}` }}
                            </span>
                        </template>
                        <template v-else>
                            {{ `${optionPrefix}${adaptedOption.label}` }}
                        </template>
                    </li>
                </ul>
                <div
                    v-if="showNoResultsMessage"
                    class="c-formFilterSelect__noResults"
                    data-qa="no results"
                >
                    {{ noResultMessage }}
                </div>
                <div
                    v-if="limitReached"
                    class="c-formFilterSelect__limitReached"
                    data-qa="limit reached"
                >
                    {{ $t('validation.maxLength', { n: inputLimit }) }}
                </div>
            </div>
            <template #end>
                <FormMessage
                    v-if="!showDropdown && limitReached"
                    type="warning"
                >
                    <li v-if="limitReached">
                        {{ $t('validation.maxLength', { n: inputLimit }) }}
                    </li>
                </FormMessage>
            </template>
        </FormElement>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/z-index';
@import '../../../assets/scss/components/dropdown';

// 1.   proximate as not better solution yet.
// 2.   first entry in dropdown === searchInput;
//      should not be shown when component hideNewOption is set ;

.c-formFilterSelect {
    position: relative;

    &__icon {
        padding: 0;
        width: 1em;
        border: none;
        background: transparent;
        color: $k-color-primary--dark;
        cursor: pointer;
    }

    &__clearBtn {
        position: absolute;
        top: 0;
        right: 0;
    }

    &__results {
        @include dropdown;

        text-align: left;

        &.adaptive-width {
            width: 200%; // 1.

            @media (min-width: $k-breakpoint--s) {
                width: 430%; // 1.
            }

            @media (min-width: $k-breakpoint--m) {
                width: 534%; // 1.
            }
        }
    }

    &__noResults,
    &__limitReached {
        padding: $k-spacing--m $k-spacing--s;
        color: $k-color-gray--400;
    }

    &__option {
        display: block;
        padding: $k-spacing--m $k-spacing--s;

        &--withIcon {
            padding: $k-spacing--m;
        }

        &--hideNewOption {
            display: none; // 2.
        }

        cursor: pointer;

        &:hover,
        &:focus,
        &.is-highlighted {
            outline: none;
            background: $k-color-gray--50;
        }
    }

    &__optionIcon {
        color: $k-color-gray--500;
    }

    &__optionText {
        padding-left: $k-spacing--s;
    }
}
</style>
