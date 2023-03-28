<script setup>
import AppIcon from '../../atoms/app/AppIcon';

defineProps({
    text: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    dataQa: {
        type: String,
        default: 'snackbar',
    },
});
</script>

<template>
    <div
        class="c-appSnackbar"
        :data-qa="dataQa"
    >
        <div class="k-c-snackbar k-c-snackbar--toggle">
            <div class="k-c-snackbar__content">
                <AppIcon
                    v-if="icon"
                    :name="icon"
                    :class="'c-appSnackbar__icon--' + icon"
                    class="k-c-snackbar__icon"
                    :data-qa="icon + ' icon'"
                />
                <span data-qa="text">{{ text }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/snackbar/index';
@import '~@karriereat/global-styles/scss/settings/color';
@import '~@karriereat/global-styles/scss/settings/spacing';

$z-index-snackbar: 9999;

.c-appSnackbar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: $z-index-snackbar;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: $k-spacing--l;
    margin-left: $k-spacing--l;

    &__icon {
        &--success {
            color: $k-color-primary--dark;
        }
    }
}
</style>
