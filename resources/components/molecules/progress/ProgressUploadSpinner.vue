<script setup>
import AppIcon from '../../atoms/app/AppIcon';

defineProps({
    status: {
        type: String,
        default: 'loading',
    },
    size: {
        type: String,
    },
});
</script>

<template>
    <span
        :class="{
            [`is-${status}`]: status,
        }"
        class="c-progressUploadSpinner"
    >
        <span
            v-if="status === 'loading'"
            key="loading"
            data-qa="loading icon"
        >
            <AppIcon
                :size="size"
                name="upload-spinner"
                spin
                fixed-width
            />
        </span>
        <span
            v-if="status === 'success'"
            key="success"
            data-qa="success icon"
        >
            <AppIcon
                :size="size"
                name="check"
                fixed-width
            />
        </span>
        <span
            v-if="status === 'error'"
            key="error"
            data-qa="error icon"
        >
            <AppIcon
                :size="size"
                name="cross"
                fixed-width
            />
        </span>

        <span
            v-if="$slots.default"
            class="c-progressUploadSpinner__label"
        >
            <slot/>
        </span>
    </span>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-progressUploadSpinner {
    &.is-success {
        color: $k-color-active--dark;
    }

    &__label {
        margin-left: $k-spacing--xs;
    }
}
</style>
