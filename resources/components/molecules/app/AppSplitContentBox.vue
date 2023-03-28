<template>
    <div class="c-appSplitContentBox">
        <div class="c-appSplitContentBox__illustration">
            <slot name="illustration"/>
        </div>
        <slot/>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appSplitContentBox {
    &__illustration {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: block;
        }
    }
}
</style>
