<script setup>
import {
    computed, ref, useAttrs,
} from 'vue';
import AppIcon from '../app/AppIcon';

const props = defineProps({
    dropdown: {
        default: false,
        type: Boolean,
    },
    formatAdapter: {
        default: value => value,
        type: Function,
    },
    hasClearButton: {
        default: 'never',
        type: String,
        validator(value) {
            return ['never', 'always', 'auto'].includes(value);
        },
    },
    isDockedRight: {
        default: false,
        type: Boolean,
    },
    limit: {
        type: Number,
    },
    locked: {
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
    value: {
        type: [String, Number],
    },
    valueAdapter: {
        default: value => value,
        type: Function,
    },
    white: {
        default: false,
        type: Boolean,
    },
    ariaLabel: {
        type: String,
    },
});

const attrs = useAttrs();
const emit = defineEmits(['limit-reached', 'input', 'clear']);
const inputField = ref(null);

const updateValue = (e) => {
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1);

    // this saves the cursor position in Safari Browsers
    // the input type 'tel' is excluded because of issues with the thousands delimiter
    let cursorPosition = false;
    if (isSafari && inputField.value.type !== 'tel') cursorPosition = e.target.selectionStart;

    const value = props.limit ? e.target.value.substring(0, props.limit) : e.target.value;

    if (props.limit) emit('limit-reached', value.length >= props.limit);

    e.target.value = props.formatAdapter(props.valueAdapter(value));

    // this explicitly sets the cursor to the saved position after a change
    // which is needed to prevent the cursor from jumping to the end of an input in Safari
    if (cursorPosition) e.target.setSelectionRange(cursorPosition, cursorPosition);

    emit('input', props.valueAdapter(value), e);
};

const updateValueInEdge = (e) => {
    if (e.key === 'Up' || e.key === 'Down') {
        updateValue(e);
    }
};

const showClearButton = computed(() => {
    if (props.hasClearButton === 'always') return true;
    if (props.hasClearButton === 'auto' && props.value.length) return true;
    return false;
});

defineExpose({ inputField });
</script>

<script>
// In case of vue 3 upgrade: https://v3-migration.vuejs.org/breaking-changes/attrs-includes-class-style.html
export default {
    inheritAttrs: false,
};
</script>

<template>
    <div
        :class="{
            'has-dropdown': dropdown,
            'has-start': $slots.start,
            'has-end': $slots.end,
            'has-content': `${value}`.length,
            'is-docked-right': isDockedRight,
            'is-small': small,
        }"
        class="c-formInput"
    >
        <div
            v-if="$slots.start"
            class="c-formInput__start"
            :class="{'c-formInput__start--small' : small}"
        >
            <slot name="start"/>
        </div>
        <!-- ref="inputField" might be referenced by parent  -->
        <input
            v-if="!locked"
            ref="inputField"
            :class="{
                [`has-status-${status}`]: status,
                ['c-formInput__input--white']: white,
                // otherwise the input will change its width, when clear button appears (e.g. in FormJobSearch)
                ['c-formInput__input--clearButton']: hasClearButton !== 'never',
            }"
            :value="formatAdapter(value)"
            v-bind="attrs"
            class="c-formInput__input"
            :aria-label="ariaLabel"
            v-on="{
                ...$listeners,
                input: event => updateValue(event),
                keyup: event => updateValueInEdge(event),
            }"
        >
        <div
            v-else
            class="k-c-inputGroup k-c-inputGroup--disabled"
        >
            <AppIcon
                name="lock-closed"
                size="m"
                class="c-formInput__icon k-c-inputGroup__icon"
            />
            <input
                class="k-c-inputGroup__field"
                :value="formatAdapter(value)"
                v-bind="attrs"
                aria-label="Text"
                disabled
                v-on="{
                    ...$listeners,
                    input: event => updateValue(event),
                    keyup: event => updateValueInEdge(event),
                }"
            >
        </div>
        <div
            v-if="$slots.end"
            class="c-formInput__end"
        >
            <slot name="end"/>
        </div>
        <button
            v-if="showClearButton"
            class="k-c-inputGroup__endIcon k-c-inputGroup__endIcon--action k-c-inputGroup__endIcon--visible"
            aria-label="Eingabe löschen"
            data-qa="clear button"
            type="button"
            @click="emit('clear')"
        >
            <AppIcon
                size="l"
                name="cross"
            />
        </button>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/components/input';

// 1. This resolves the issue of input icons blocking the focus on their own input fields
.c-formInput {
    $root: &;

    position: relative;

    &__start,
    &__end {
        position: absolute;
        top: $k-spacing--m;
    }

    &__start {
        left: $k-spacing--m;
        color: $k-color-gray--500;
        pointer-events: none; // 1.

        #{$root}:focus-within &,
        .has-content & {
            color: $k-color-gray--900;
        }

        &--small {
            top: $k-spacing--s;
        }
    }

    &__end {
        right: $k-spacing--m;
    }

    &__input {
        @include input;

        #{$root}.has-dropdown & {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }

        #{$root}.has-start & {
            padding-left: $k-spacing--2xl + $k-spacing--xs;
        }

        #{$root}.has-end & {
            padding-right: $k-spacing--2xl + $k-spacing--xs;
        }

        #{$root}.is-docked-right & {
            border-right-width: 0;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        #{$root}.is-small & {
            padding: $k-spacing--s;
        }

        #{$root}.is-small.has-start & {
            padding-left: $k-spacing--xl + $k-spacing--xs;
        }

        &--clearButton {
            padding-right: $k-spacing--2xl + $k-spacing--xs;
        }

        &::placeholder {
            color: $k-color-gray--500;
        }
    }
}
</style>
