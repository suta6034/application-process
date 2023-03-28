<script setup>
import AppIcon from '../../atoms/app/AppIcon';

defineProps({
    steps: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <nav class="c-navProgressTracker">
        <ol class="c-navProgressTracker__list">
            <li
                v-for="(step, index) in steps"
                :key="step.key"
                class="c-navProgressTracker__item"
            >
                <router-link
                    :class="{
                        'is-completed': step.completed,
                        'is-locked': step.locked,
                    }"
                    :data-qa="`step ${step.name}`"
                    :to="{ name: step.routerName }"
                    :event="step.locked ? '' : 'click'"
                    :active-class="index === 0 ? 'is-active' : null"
                    :exact="step.completed"
                    class="c-navProgressTracker__link"
                >
                    <div class="c-navProgressTracker__indicator">
                        <span
                            v-if="step.completed"
                            class="c-navProgressTracker__indicatorIcon"
                        >
                            <AppIcon name="check"/>
                        </span>
                    </div>
                    <div
                        class="c-navProgressTracker__label"
                    >
                        {{ step.name }}
                    </div>
                </router-link>
            </li>
        </ol>
    </nav>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/font-size';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-navProgressTracker {
    $bar-width: 5rem;
    $bar-height: 0.0625rem;
    $indicator-icon-top: $k-spacing--2xs;
    $indicator-width: 1.875rem;
    $indicator-height: $indicator-width;
    $indicator-border: $bar-height;
    $label-width: 6rem;
    $duration-bar: 1.2s;
    $duration-item: 0.2s;
    $bar-padding: math.div(($bar-width + $indicator-width - $label-width), 2);

    display: inline-block;
    vertical-align: middle;

    &__list {
        display: flex;
        margin-right: -($bar-padding);
        margin-left: -($bar-padding);
        counter-reset: progressTrackerLink;
    }

    &__item {
        &:first-child {
            > ::before,
            > ::after {
                display: none;
            }
        }
    }

    &__link {
        position: relative;
        display: inline-block;
        padding-right: $bar-padding;
        padding-left: $bar-padding;

        &::before,
        &::after {
            position: absolute;
            top: math.div($indicator-height, 2) - math.div($bar-height, 2);
            right: 50%;
            z-index: -1;
            width: 100%;
            height: $bar-height;
            background: $k-color-inactive--light;
            content: '';
        }

        &::after {
            background: $k-color-active;
            transition: transform $duration-bar;
            transform: scaleX(0);
            transform-origin: left;
        }

        &.is-active,
        &.is-completed {
            &::after {
                transform: scaleX(1);
            }
        }
    }

    &__indicator {
        @include k-typo-xs;

        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: $indicator-width;
        height: $indicator-height;
        border: $indicator-border solid $k-color-inactive--light;
        border-radius: 50%;
        background-color: $k-color-white;
        color: $k-color-gray--400;
        transition-property: background-color, color, border-color;

        &,
        &::before {
            transition-duration: $duration-item;
        }

        &::before {
            content: counter(progressTrackerLink);
            counter-increment: progressTrackerLink;
            transition-property: transform, opacity;
        }

        .is-active &,
        .is-completed & {
            border-color: $k-color-active;
            background-color: $k-color-active;
            color: $k-color-active--contrast;
            transition-delay: math.div($duration-bar, 2);
        }

        .is-completed & {
            &::before {
                opacity: 0;
                transform: scale(2);
            }
        }
    }

    &__indicatorIcon {
        position: absolute;

        // START Safari and IE10+ positioning fixes.
        top: $indicator-icon-top;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        // END.
        opacity: 0;
        transition-duration: $duration-item;
        transition-property: transform, opacity;
        transform: scale(0);

        .is-completed & {
            opacity: 1;
            transform: scale(1);
        }
    }

    &__label {
        @include k-typo-s;

        margin-top: $k-spacing--s;
        width: $label-width;
        color: $k-color-gray--400;
        transition: color $duration-item;

        .is-active & {
            color: $k-color-active--dark;
            transition-delay: math.div($duration-bar, 2);
        }
    }
}
</style>
