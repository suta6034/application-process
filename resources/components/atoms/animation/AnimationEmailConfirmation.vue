<template>
    <div class="c-animationEmailConfirmation">
        <iframe
            title="E-Mail-Bestätigung"
            class="c-animationEmailConfirmation__animation"
            src="/profil/animation/email-confirmation/confirm.html"
        />
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';

// 1. This overrides the default height of the iframe to fit the animation's height.
.c-animationEmailConfirmation {
    $animation-width-mobile: 12rem;
    $animation-width-desktop: 16rem;

    &__animation {
        max-width: $animation-width-mobile;
        max-height: 126px; // 1.

        @media (min-width: $k-breakpoint--m) {
            max-width: $animation-width-desktop;
            max-height: 150px; // 1.
        }
    }
}
</style>
