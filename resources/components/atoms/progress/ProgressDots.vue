<script setup>
defineProps({
    variant: {
        type: String,
    },
    insideButton: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <span
        :class="{
            'k-c-loadingDots--white' : variant,
            'k-c-loadingDots--insideButton': insideButton,
        }"
        class="k-c-loadingDots"
    >
        <span class="k-c-loadingDots__dot"/>
        <span class="k-c-loadingDots__dot"/>
        <span class="k-c-loadingDots__dot"/>
    </span>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '~@karriereat/global-styles/scss/components/loading-dots/index';
</style>
