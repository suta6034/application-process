<script setup>
import AppButton from '../../atoms/app/AppButton';
import TextHeadline from '../../atoms/text/TextHeadline';

const emit = defineEmits(['click']);
</script>

<template>
    <div
        class="c-cardFaqBanner k-c-card k-c-card--noBorder"
        data-qa="faq card"
    >
        <img
            alt=""
            src="../../../assets/img/banner/faq-banner.png"
        >
        <div class="c-cardFaqBanner__body k-c-card__body">
            <TextHeadline
                :level="1"
                size="l"
                bold
            >
                Du hast offene Fragen?
            </TextHeadline>
            <p class="c-cardFaqBanner__subheadline">
                Nicht mehr lange!
            </p>
            <AppButton
                :to="{ name: 'lp-faqs' }"
                class="c-cardFaqBanner__button"
                data-qa="faq button"
                @click="emit('click')"
            >
                Hier gibts die Antworten
            </AppButton>
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/settings/breakpoint';
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-cardFaqBanner {
    background-color: $k-color-green--100;

    &__body {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__subheadline {
        margin-top: $k-spacing--xs;
    }

    &__button {
        margin-top: $k-spacing--l;
    }
}
</style>
