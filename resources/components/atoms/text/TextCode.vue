<template>
    <pre class="c-textCode"><code><slot/></code></pre>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-textCode {
    @include k-typo-s;

    overflow: auto;
    padding: $k-spacing--m;
    background-color: $k-color-gray--200;
    font-family: monospace;
}
</style>
