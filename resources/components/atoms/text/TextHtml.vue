<script setup>
defineProps({
    html: {
        required: true,
        type: String,
    },
});
</script>

<template>
    <div
        class="c-textHtml"
        v-html="html"
    />
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '~@karriereat/global-styles/scss/components/link/mixins';
@import '../../../assets/scss/settings/spacing';

.c-textHtml {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin-top: $k-spacing--xl;
    }

    p,
    li {
        margin-top: $k-spacing--s;
    }

    h1,
    h2 {
        @include k-typo-2xl;

        text-transform: uppercase;
        font-weight: bold;
    }

    h3,
    h4,
    h5,
    h6 {
        @include k-typo-xl;

        font-weight: bold;
    }

    ul {
        padding-left: 1.5em;
        list-style: disc;
    }

    a {
        @include k-c-link;
    }
}
</style>
