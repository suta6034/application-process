<script>
import {
    defineComponent,
} from 'vue';
import NProgress from 'nprogress';

// Don't show a loading bar if loading does not take longer as the specified
// amount of time.
const DURATION_MIN_LOADING = 200;
// Debounce the start of progress animations to prevent a loading bar from being
// restarted while it's still running. Unfortunately, checking
// `NProgress.isStarted` is not sufficient.
const DURATION_ANIMATION_DELAY = 600;
const ID = 'progress-loading-bar';

// Reuse a single HTMLElement instance across all pages to prevent the progress
// bar from resetting because of a re-rendered parent element.
const $parent = document.createElement('div');
$parent.id = ID;
document.body.appendChild($parent);

NProgress.configure({
    parent: `#${ID}`,
    showSpinner: false,
    trickleSpeed: 300,
    easing: 'linear',
    speed: 1000,
    minimum: 0.3,
    template: '<div class="bar" role="bar"></div>',
});

function pause(time) {
    return new Promise((resolve) => { setTimeout(resolve, time); });
}

let isDone = true;
// When the progress is done, it starts the last bit of the animation. We set
// this to true only after this is done too to avoid multiple `start()` commands
// from interfering with each other.
let isDoneWithAnimation = true;

export async function start() {
    const hasNoParent = !document.getElementById(ID);
    const hasPendingLoadingBar = !isDoneWithAnimation;
    if (hasNoParent || hasPendingLoadingBar) return;

    isDone = false;
    await pause(DURATION_MIN_LOADING);
    isDoneWithAnimation = false;
    if (isDone) return;

    NProgress.start();
}

export async function done() {
    isDone = true;
    NProgress.done();

    await pause(DURATION_ANIMATION_DELAY);
    isDoneWithAnimation = true;
}

// To avoid ReferenceError: xxx does not exist,
// a fallback parent div is required in the beforeDestroy life cycle.
export default defineComponent({
    mounted() {
        this.$el.replaceWith($parent);
    },
    beforeDestroy() {
        document.body.appendChild($parent);
    },
});
</script>

<template>
    <div/>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/z-index';
@import '../../../assets/scss/settings/spacing';

$progress-bar-height: 2px;
$progress-box-shadow: 0 1px 3px 0 rgb(139 199 42 / 20%);

@mixin default-bar {
    position: absolute;
    left: 0;
    z-index: $z-index-progress-popup;
    width: 100%;
    height: $progress-bar-height;
    background: $k-color-green--600;
    box-shadow: $progress-box-shadow;
    opacity: 1;
}

#nprogress {
    position: sticky;
    pointer-events: none;
}

#nprogress .bar {
    @include default-bar;
}

.nprogress-custom-parent {
    position: relative;
    overflow: visible !important;
}

.nprogress-custom-parent #nprogress .bar {
    position: absolute;
}
</style>
