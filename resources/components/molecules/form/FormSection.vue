<script setup>
import TextHeadline from '../../atoms/text/TextHeadline';

defineProps({
    headline: {
        type: String,
        default: 'm',
    },
});
</script>

<template>
    <div class="c-formSection">
        <TextHeadline
            v-if="$slots.headline"
            :level="2"
            :size="headline"
            class="c-formSection__headline"
            data-qa="headline"
        >
            <slot name="headline"/>
        </TextHeadline>
        <div class="c-formSection__content">
            <slot/>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/layout';

.c-formSection {
    // 1. Use bottom spacing to prevent problems with layout spacing.
    &__headline {
        margin-bottom: $k-spacing--m; // 1
    }

    &__content {
        @include k-layout($k-spacing--m, $k-spacing--s);

        > * {
            @include k-layout__item(math.div(12, 12));
        }
    }
}
</style>
