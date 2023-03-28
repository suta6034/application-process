<script setup>
import {
    computed,
} from 'vue';

const props = defineProps({
    aspectRatio: {
        type: String,
    },
    maxWidth: {
        default: 100,
        type: Number,
    },
    minWidth: {
        default: 80,
        type: Number,
    },
    height: {
        default: '1em',
        type: String,
    },
    width: {
        type: String,
    },
});

const computedWidth = computed(() => props.width
    || `${Math.floor((Math.random() * (props.maxWidth - props.minWidth)) + props.minWidth)}%`);
const aspectRatioFactor = computed(() => {
    if (!props.aspectRatio) return null;
    const [width, height] = props.aspectRatio.split('/');
    return (height / width) * 100;
});

const style = computed(() => {
    if (props.aspectRatio) {
        return {
            display: 'block',
            paddingTop: `${aspectRatioFactor.value}%`,
        };
    }
    return {
        height: props.height,
        width: computedWidth.value,
    };
});
</script>

<template>
    <span
        :style="style"
        class="c-skeletonBox"
    />
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';

.c-skeletonBox {
    position: relative;
    display: inline-block;
    overflow: hidden;
    vertical-align: middle;
    background-color: $k-color-gray--200;

    &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image:
            linear-gradient(
                90deg,
                rgba(#ffffff, 0) 0,
                rgba(#ffffff, 0.2) 20%,
                rgba(#ffffff, 0.5) 60%,
                rgba(#ffffff, 0)
            );
        content: '';
        transform: translateX(-100%);
        animation: shimmer 5s infinite;
    }

    @keyframes shimmer {
        100% {
            transform: translateX(100%);
        }
    }
}
</style>
