<script setup>
import {
    computed, nextTick, ref,
} from 'vue';

import AppIcon from '../../atoms/app/AppIcon';
import FormCheckbox from '../../atoms/form/FormCheckbox';
import FormRadio from '../../atoms/form/FormRadio';

import '../../../directives/click-outside';
import {
    formOptionSelectEvents,
    formOptionSelectProps, useFormOptionSelect,
} from '../../../composables/form-option-select';

const props = defineProps({
    ...formOptionSelectProps,
    value: {
        type: [Array, Object],
        default: () => [],
    },
    name: {
        type: String,
    },
    status: {
        type: String,
    },
    allowMultiple: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
    },
    isDockedLeft: {
        type: Boolean,
        default: false,
    },
    white: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    small: {
        type: Boolean,
        default: false,
    },
    preventScroll: {
        type: Boolean,
        default: false,
    },
    isCondensed: {
        type: Boolean,
        default: false,
    },
    iconSize: {
        type: String,
        default: 's',
        validator(value) {
            return ['l', 'm', 's'].includes(value);
        },
    },
});
const emit = defineEmits(['open', 'blur', 'change', ...formOptionSelectEvents]);
const root = ref(null);
const button = ref(null);
const dropdown = ref(null);
const options = ref(null);
const {
    adaptedOptions,
    updateValue,
    adaptedValue,
    hasMultipleValues,
} = useFormOptionSelect(props, emit);

const isOpen = ref(false);
const highlightedIndex = ref(0);
const selectedValues = computed(() => (hasMultipleValues.value
    ? adaptedValue.value.map(x => x.label).join(', ')
    : adaptedValue.value.label));

async function open() {
    isOpen.value = true;
    emit('open');
    await nextTick();

    const selectedOptionIndex = adaptedOptions.value.findIndex(option => option.id === props.value.id);
    if (selectedOptionIndex !== -1) highlight(selectedOptionIndex);

    dropdown.value.focus({ preventScroll: props.preventScroll });
}

async function close() {
    isOpen.value = false;
    emit('blur');
    button.value.focus({ preventScroll: props.preventScroll });
}

function toggleDropdown() {
    if (isOpen.value) close();
    else open();
}

function clickOutside() {
    if (!isOpen.value) return;
    close();
}

function remove(adaptedOption) {
    const newAdaptedValue = adaptedValue.value.filter(({ id }) => id !== adaptedOption.id);

    emit('change', newAdaptedValue.map(x => x.value));
}

function select(adaptedOption) {
    if (hasMultipleValues.value && adaptedValue.value.find(x => x.id === adaptedOption.id)) {
        remove(adaptedOption);
        return;
    }

    updateValue({ value: adaptedOption.value });

    if (!hasMultipleValues.value) close();
}

function isChecked(option) {
    return hasMultipleValues.value
        ? adaptedValue.value.find(x => x.id === option.id) !== undefined
        : adaptedValue.value.id === option.id;
}

function handleSelect() {
    // Dispatching this native event is necessary to make sure the form can also be marked as dirty when
    // selecting a value by keyboard navigation. It is not sufficient to emit a Vue event as only native events
    // can be captured (see: LayoutForm).
    root.value.dispatchEvent(new Event('change'));
    select(adaptedOptions.value[highlightedIndex.value]);
}

function highlight(index) {
    highlightedIndex.value = index;

    if (highlightedIndex.value < 0) {
        highlightedIndex.value = adaptedOptions.value.length - 1;
    }

    if (highlightedIndex.value > adaptedOptions.value.length - 1) {
        highlightedIndex.value = 0;
    }

    if (props.preventScroll) return;
    const $option = options.value[highlightedIndex.value];
    if ($option.scrollIntoViewIfNeeded) $option.scrollIntoViewIfNeeded(false);
    else if ($option.scrollIntoView) $option.scrollIntoView({ block: 'nearest' });
}

function highlightPrev() {
    highlight(highlightedIndex.value - 1);
}

function highlightNext() {
    highlight(highlightedIndex.value + 1);
}

// Expose for unit tests
defineExpose({ open, isOpen });
</script>

<script>
export default {
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
            'is-condensed': isCondensed,
            'is-open': isOpen,
            'is-empty': !selectedValues,
            'is-docked-left': isDockedLeft,
            'is-disabled': disabled,
            'is-small': small,
            [`has-status-${status}`]: status,
            'c-formSelect--multiple': allowMultiple,
        }"
        class="c-formSelect"
    >
        <button
            ref="button"
            :class="{
                ['c-formSelect__button--white']: white,
            }"
            :disabled="disabled"
            class="c-formSelect__button"
            type="button"
            aria-haspopup="true"
            :aria-expanded="isOpen"
            data-qa="button"
            @keydown.up.prevent="open"
            @keydown.down.prevent="open"
            @click="toggleDropdown"
        >
            <span class="c-formSelect__text u-ellipsis">
                {{ selectedValues || placeholder }}
            </span>
            <AppIcon
                name="arrow-down"
                class="c-formSelect__toggle"
                :class="{
                    'is-disabled': disabled,
                    'c-formSelect__icon--s': iconSize === 's' // 1
                }"
                :size="iconSize"
            />
        </button>
        <div
            v-if="isOpen"
            class="c-formSelect__dropdown"
        >
            <ul
                :id="`results-${_uid}`"
                ref="dropdown"
                :aria-expanded="isOpen"
                role="listbox"
                tabindex="0"
                data-qa="options"
                @keydown.tab.prevent
                @keydown.up.prevent="highlightPrev"
                @keydown.down.prevent="highlightNext"
                @keydown.enter.prevent="handleSelect"
                @keydown.space.prevent="handleSelect"
                @keydown.esc="close"
            >
                <li
                    v-for="(adaptedOption, index) in adaptedOptions"
                    :id="`${index === highlightedIndex ? `selected-option-${_uid}` : ''}`"
                    :key="adaptedOption.id"
                    ref="options"
                    :aria-selected="index === highlightedIndex"
                    :class="{ 'is-highlighted': index === highlightedIndex }"
                    class="c-formSelect__option"
                >
                    <Component
                        :is="allowMultiple ? FormCheckbox : FormRadio"
                        :data-qa="`option ${index + 1}`"
                        :value="adaptedOption.id"
                        :name="name"
                        :checked="isChecked(adaptedOption) ? adaptedOption.id : false"
                        :true-value="adaptedOption.id"
                        variant="list"
                        class="c-formSelect__optionInput"
                        @change="select(adaptedOption)"
                    >
                        {{ adaptedOption.label }}
                    </Component>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/input/settings';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/z-index';
@import '../../../assets/scss/components/dropdown';
@import '../../../assets/scss/components/input';

// 1. Because the icon is not perfectly vertically centered
//    out of the box, an optical fix is needed to make Dani happy.
.c-formSelect {
    $root: &;

    position: relative;

    &__button {
        @include input;

        display: flex;
        align-items: flex-end;
        text-align: left;
        background-color: $k-color-white;

        .is-docked-left & {
            border-left-color: $k-color-gray--300;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .is-open & {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }

        .has-status-error & {
            border-color: $k-color-error--border;
        }

        .is-small & {
            padding: $k-spacing--s;
        }

        .is-condensed & {
            padding-right: $k-spacing--m;
            padding-left: $k-spacing--m;
        }
    }

    &__icon--s {
        margin-bottom: $k-spacing--2xs; // 1
    }

    &__text {
        flex-grow: 1;
        padding-right: $k-spacing--s;
    }

    &__toggle {
        flex-shrink: 0;
        color: $k-color-gray--500;
        transition: transform 0.2s;

        .is-open & {
            transform: rotate(180deg);
        }
    }

    &__dropdown {
        @include dropdown;

        #{$root}--multiple & {
            padding: $k-spacing--s 0;
        }
    }

    &__option {
        > * {
            padding: $k-spacing--m $k-spacing--s;

            #{$root}--multiple & {
                padding: $k-spacing--s $k-spacing--m;
            }
        }

        &:hover,
        &:focus,
        &:focus-within,
        &.is-highlighted,
        label:focus {
            outline: none;
            background: $k-color-gray--50;
        }
    }

    &__optionInput {
        align-items: center;
    }
}
</style>
