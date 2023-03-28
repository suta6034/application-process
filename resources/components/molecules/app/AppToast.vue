<script setup>
import {
    onMounted,
    ref,
} from 'vue';
import {
    isEmbedded,
} from '../../../utils/frame-check';

import AppIcon from '../../atoms/app/AppIcon';

const VISIBLE_TIMEOUT_IN_MS = 50;
const VISIBLE_DURATION_IN_MS = 2000;

defineProps({
    text: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'success',
    },
});

const visible = ref(false);

// Trigger a CSS class change after component mount to trigger CSS transition.
// Won't work without setTimeout, nextTick wouldn't work either.
onMounted(async () => {
    setTimeout(() => {
        visible.value = true;
    }, VISIBLE_TIMEOUT_IN_MS);

    setTimeout(() => {
        visible.value = false;
    }, VISIBLE_DURATION_IN_MS + VISIBLE_TIMEOUT_IN_MS);
});
</script>

<template>
    <div
        :class="{
            'is-visible': visible,
            'is-embedded': isEmbedded(),
        }"
        class="c-appToast"
        data-qa="toast"
    >
        <AppIcon
            v-if="status === 'success'"
            name="check"
            class="c-appToast__icon c-appToast__icon--success"
            data-qa="success icon"
        />
        <p data-qa="text">
            {{ text }}
        </p>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/z-index';

// 1. Height from k4-iFrame-header
.c-appToast {
    $transition-duration: 0.6s;
    $bar-height: 55px; // 1.

    position: fixed;
    top: 0;
    z-index: $z-index-toast;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $k-spacing--l;
    width: 100%;
    background-color: $k-color-white;
    box-shadow: 0 0 0.5rem rgba($k-color-gray--400, 0.5);
    transition: transform $transition-duration cubic-bezier(0.46, 0.03, 0.52, 0.96);
    transform: translate(0, -4rem);

    &.is-visible {
        transform: translate(0);
    }

    &.is-embedded {
        margin-top: $bar-height;
    }

    &__icon {
        margin-right: $k-spacing--m;

        &--success {
            color: $k-color-primary--dark;
        }
    }
}
</style>
