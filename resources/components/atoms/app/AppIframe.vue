<script setup>
import {
    ref,
} from 'vue';

const iframeHeight = ref('auto');
const adjustIframeHeight = (event) => {
    iframeHeight.value = event.target.contentWindow.document.documentElement.scrollHeight;
};
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/iframe-has-title -->
    <iframe
        class="c-appIframe"
        :height="iframeHeight"
        @load="adjustIframeHeight"
    />
</template>

<style lang="scss">
.c-appIframe {
    width: 100%;
}
</style>
