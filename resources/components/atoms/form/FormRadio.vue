<script setup>
defineProps({
    // this is useful when this component is wrapped with padding
    // use like it this: <label class="padding"> <FormRadio tag="div"/> </label>
    // otherwise clickevents on the padding are not registered
    tag: {
        default: 'label',
        type: String,
    },
    name: {
        type: String,
    },
    value: {
        type: [Boolean, String, Number],
    },
    checked: {
        type: [Boolean, String, Number],
        default: false,
    },
    variant: {
        type: String,
    },
});

const emit = defineEmits(['change']);
</script>

<template>
    <Component
        :is="tag"
        :class="{[`c-formRadio--${variant}`]: variant}"
        class="c-formRadio k-c-radio"
    >
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <input
            :class="{
                'is-checked': checked,
            }"
            :name="name"
            :value="value"
            :checked="checked"
            class="k-c-radio__input"
            type="radio"
            @change="emit('change', value)"
        >
        <span class="c-formRadio__radio k-c-radio__radio"/>
        <span class="c-formRadio__label k-c-radio__label">
            <slot/>
        </span>
    </Component>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/radio';
@import '../../../assets/scss/settings/spacing';

.c-formRadio {
    $root: &;

    &--list#{$root} {
        padding: $k-spacing--m;
    }

    &--list {
        width: 100%;

        #{$root}__radio {
            display: none;
        }

        #{$root}__label {
            left: 0;
        }
    }
}
</style>
