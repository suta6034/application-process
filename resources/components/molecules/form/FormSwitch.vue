<script setup>
import {
    ref, watchEffect,
} from 'vue';
import AppIcon from '../../atoms/app/AppIcon';

const props = defineProps({
    name: {
        required: true,
        type: String,
    },
    radios: {
        type: Array,
    },
    value: {
        type: [Boolean, String],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    valueComparator: {
        type: Function,
        default: (value, selected) => value === selected,
    },
});
const emit = defineEmits(['click', 'change']);

const selected = ref(null);

function updateValue() {
    if (!props.disabled) emit('change', selected.value);
}

watchEffect(() => {
    selected.value = props.value;
});
</script>

<template>
    <div
        class="c-formSwitch"
        :class="{ 'is-disabled': disabled }"
    >
        <!-- eslint-disable-next-line max-len -->
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/label-has-for -->
        <label
            v-for="(radio, index) in radios"
            :key="radio.label"
            :class="{
                'is-active': valueComparator(radio.value, selected),
            }"
            :data-qa="`radio ${index + 1}`"
            class="c-formSwitch__button"
            @click="disabled ? '' : emit('click', { event: $event, value: radio.value })"
        >
            <AppIcon
                v-if="radio.icon"
                :class="{
                    'is-active': valueComparator(radio.value, selected),
                }"
                :name="radio.icon"
                class="c-formSwitch__icon"
                size="2xl"
                data-qa="icon"
            />
            <span class="c-formSwitch__label">
                {{ radio.label }}
            </span>
            <input
                v-model="selected"
                :name="name"
                :value="radio.value"
                class="u-screen-reader-only"
                type="radio"
                @change="updateValue"
            >
        </label>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-formSwitch {
    $root: &;
    $border-width: 1px;

    display: flex;
    color: $k-color-gray--500;

    &__button {
        flex-grow: 1;
        flex-basis: 0;
        padding: $k-spacing--l;
        border: $border-width solid $k-color-gray--300;
        border-right-width: 0;
        text-align: center;
        cursor: pointer;
        transition-duration: 0.2s;
        transition-property: border-color, color;

        &:first-child {
            border-top-left-radius: $k-border-radius--s;
            border-bottom-left-radius: $k-border-radius--s;
        }

        &:last-child {
            border-right-width: $border-width;
            border-top-right-radius: $k-border-radius--s;
            border-bottom-right-radius: $k-border-radius--s;
        }

        &.is-active {
            border-color: $k-color-active--dark;
            color: $k-color-active--dark;

            + .c-formSwitch__button {
                border-left-color: $k-color-active--dark;
            }
        }

        #{$root}.is-disabled & {
            border-color: $k-color-inactive--light;
            background-color: $k-color-gray--50;
            color: $k-color-inactive;
            cursor: not-allowed;

            + .c-formSwitch__button {
                border-left-color: $k-color-inactive--light;
            }
        }

        &:hover,
        &:focus {
            border-color: $k-color-green--800;
            color: $k-color-green--800;

            + .c-formSwitch__button {
                border-left-color: $k-color-green--800;
            }
        }
    }

    &__icon {
        transition: color 0.2s;

        &:not(.is-active) {
            color: $k-color-gray--400;
        }

        #{$root}.is-disabled & {
            color: $k-color-gray--400;
        }

        :hover > &,
        :focus > & {
            color: $k-color-green--800;
        }
    }

    &__label {
        @include k-typo-s;

        display: block;
    }
}
</style>
