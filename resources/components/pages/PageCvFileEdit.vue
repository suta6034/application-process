<script setup>
import {
    nextTick, ref, inject,
} from 'vue';
import {
    onBeforeRouteLeave,
    // eslint-disable-next-line import/extensions
} from 'vue-router/composables';

import {
    isEmbedded,
} from '../../utils/frame-check';
import AppButton from '../atoms/app/AppButton';
import AppLink from '../atoms/app/AppLink';
import LayoutFullscreen from '../layouts/LayoutFullscreen';
import SliderCvTemplates from '../organisms/slider/SliderCvTemplates';
import '../../directives/touch-outside';
import {
    useMutations,
} from '../../composables/vuex-helpers';

const { SET_MODIFIED: setModified } = useMutations('templateSettings');

onBeforeRouteLeave((to, from, next) => {
    /* istanbul ignore next - tested in acceptance tests */
    if (to.name === 'page-cv') setModified(false);
    /* istanbul ignore next - tested in acceptance tests */
    next();
});

defineProps({
    reset: {
        type: Boolean,
        default: false,
    },
});

const router = inject('router');

const resetSliderHover = ref(false);

/* istanbul ignore next - not tested because it is a f**** hack */
async function awaitTouchOutside() {
    // this is a hacky hack to unbind the touch-end event from hooper
    // needed in Safari iOS 13
    /* istanbul ignore next */
    await nextTick();
}

async function onNextClick() {
    resetSliderHover.value = true;
    await nextTick();
    await router.push({ name: 'page-cv-file-preview' });
}

async function close() {
    await router.push({ name: 'page-cv' });
}

// Exposing for unit test
defineExpose({ onNextClick });
</script>

<template>
    <LayoutFullscreen
        class="c-pageCvFileEdit"
        @close="close"
    >
        <template #headline>
            Design ändern
        </template>
        <SliderCvTemplates
            v-touch-outside="awaitTouchOutside"
            :reset="reset"
            :reset-hover="resetSliderHover"
            data-qa="template slider"
        />
        <template #footer>
            <AppLink
                v-if="isEmbedded"
                :to="{ name: 'page-cv-edit-overview', params: { reset: true }}"
                class="c-pageCvFileEdit__backLink"
                data-qa="cancel link"
            >
                Zurück<!--
            -->
            </AppLink>
            <AppButton
                data-qa="next button"
                @click.native="onNextClick"
            >
                Weiter
            </AppButton>
        </template>
    </LayoutFullscreen>
</template>

<style lang="scss">
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/layout';

.c-pageCvFileEdit {
    &__backLink {
        margin-right: $k-spacing--l;
    }
}
</style>
