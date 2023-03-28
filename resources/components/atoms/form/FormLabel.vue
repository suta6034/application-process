<script setup>
import FormFlag from './FormFlag';

defineProps({
    required: {
        type: Boolean,
    },
});

</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label
        class="c-formLabel"
        :title="required ? 'Pflichtfeld' : null"
    >
        <!-- If you try to access slots via the useSlots composable, you are running into timing issues
             where some labels are not displayed correctly - Thats why we access them directly -->
        {{ $slots.default[0].text.trim() }}
        <FormFlag v-if="required">
            *
        </FormFlag>
    </label>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/font-size';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-formLabel {
    @include k-typo-s;

    display: inline-block;
    color: $k-color-gray--600;
}
</style>
