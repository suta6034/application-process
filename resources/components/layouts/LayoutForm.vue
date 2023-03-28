<script setup>
import TextHeadline from '../atoms/text/TextHeadline';

defineProps({
    fullPage: {
        type: Boolean,
        default: true,
    },
    inline: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div
        class="c-layoutForm"
        :class="{
            'c-layoutForm__default': !inline,
            'c-layoutForm__fullPage': fullPage,
        }"
    >
        <TextHeadline
            v-if="$slots.headline"
            :level="1"
            size="2xl"
            class="c-layoutForm__headline"
        >
            <slot name="headline"/>
        </TextHeadline>

        <div
            v-if="$slots.info"
            class="c-layoutForm__info"
        >
            <slot name="info"/>
        </div>

        <div
            v-if="$slots.before"
            class="c-layoutForm__before"
        >
            <slot name="before"/>
        </div>

        <div
            class="c-layoutForm__body"
            @change.capture="$emit('dirty')"
            @input="$emit('dirty')"
        >
            <slot/>
        </div>

        <div
            v-if="$slots.actions"
            class="c-layoutForm__actions"
        >
            <slot name="actions"/>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';

.c-layoutForm {
    &__default {
        @include wrap(math.div(5, 12));
    }

    &__fullPage {
        padding-top: $k-spacing--xl;
        padding-bottom: $k-spacing--5xl;
    }

    &__headline {
        text-align: center;
    }

    &__info {
        &:not(:first-child) {
            margin-top: $k-spacing--l;
        }
    }

    &__before,
    &__body {
        &:not(:first-child) {
            margin-top: $k-spacing--xl;
        }
    }

    &__body {
        > :not(:first-child) {
            margin-top: $k-spacing--xl;
        }
    }

    &__actions {
        margin-top: $k-spacing--2xl;
        text-align: center;
    }
}
</style>
