<script setup>
import FormRadio from '../../atoms/form/FormRadio';

defineProps({
    isChecked: {
        type: Boolean,
        default: false,
    },
    name: {
        required: true,
        type: String,
    },
});

const emit = defineEmits(['check']);
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label class="c-appRadioBox">
        <FormRadio
            tag="div"
            class="c-appRadioBox__form"
            :checked="isChecked"
            :name="name"
            @change="emit('check')"
        >
            <slot/>
        </FormRadio>
    </label>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appRadioBox {
    display: block;
    padding-top: $k-spacing--m;
    padding-right: $k-spacing--xl;
    padding-bottom: $k-spacing--m;
    padding-left: $k-spacing--m;
    height: 100%;
    border: 1px solid $k-color-gray--200;
    border-radius: $k-border-radius--s;
    background-color: $k-color-white;
    cursor: pointer;

    &--checked,
    &:hover {
        border-color: $k-color-green--700;
    }

    &__form {
        width: 100%;
    }
}
</style>
