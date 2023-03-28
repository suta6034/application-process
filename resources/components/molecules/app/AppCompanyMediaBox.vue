<script setup>
import {
    ref,
} from 'vue';
import AppBadge from '../../atoms/app/AppBadge';
import IllustrationCompanyImagePlaceholder from '../../illustrations/IllustrationCompanyImagePlaceholder';

defineProps({
    companyName: {
        type: String,
    },
    img: {
        type: String,
    },
    video: {
        type: String,
    },
    logo: {
        type: String,
    },
    brandingType: {
        type: Number,
    },
    isActive: {
        type: Boolean,
    },
});

const showVideo = ref(false);
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
    <div
        class="c-appCompanyMediaBox k-o-layerBox"
        data-qa="company media box"
        @mouseenter="showVideo = true"
        @mouseleave="showVideo = false"
    >
        <div
            v-if="img"
            class="c-appCompanyMediaBox__wrap"
        >
            <Transition
                enter-active-class="c-appCompanyMediaBox__fadeIn"
                leave-active-class="c-appCompanyMediaBox__fadeOut"
            >
                <img
                    v-if="!showVideo || !video"
                    :src="img"
                    class="c-appCompanyMediaBox__media"
                    :alt="`Firmenbild des Arbeitgebers ${companyName}`"
                    data-qa="image"
                >
                <video
                    v-else
                    class="c-appCompanyMediaBox__media"
                    muted
                    loop
                    playsinline
                    autoplay
                    preload="none"
                    data-qa="video"
                >
                    <source :src="video">
                </video>
            </Transition>
        </div>
        <IllustrationCompanyImagePlaceholder
            v-else
            class="c-appCompanyMediaBox__placeholder k-o-layerBox"
            data-qa="placeholder illustration"
        />
        <div
            v-if="brandingType > 0 || !isActive"
            class="c-appCompanyMediaBox__badges k-o-layerBox__topLeft k-o-ladder k-o-ladder--xs"
        >
            <AppBadge
                v-if="!isActive"
                class="k-o-ladder__rung"
                condensed
                gray
                data-qa="inactive badge"
            >
                inaktive firma
            </AppBadge>
            <AppBadge
                v-if="brandingType >= 1 && isActive"
                class="k-o-ladder__rung"
                condensed
                primary
                data-qa="insight badge"
            >
                Einblicke
            </AppBadge>
            <AppBadge
                v-if="brandingType === 2 && isActive"
                class="k-o-ladder__rung"
                condensed
                secondary
                data-qa="video badge"
            >
                Videos
            </AppBadge>
        </div>
        <img
            v-if="logo && isActive"
            :alt="`Logo des Arbeitgebers ${companyName}`"
            :src="logo"
            class="k-o-layerBox__bottomLeft"
            data-qa="company logo"
        >
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';

.c-appCompanyMediaBox {
    $placeholder-max-height: 6em;

    &__wrap {
        aspect-ratio: 23 / 13;
        overflow: hidden;
    }

    &__media {
        width: 100%;
        object-fit: cover;
    }

    &__badges {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    &__placeholder {
        background-color: $k-color-gray--100;
    }

    &__fadeIn,
    &__fadeOut {
        animation-name: fade;
        animation-duration: 0.3s;
        animation-timing-function: ease-out;
    }

    &__fadeIn {
        position: absolute;
        top: 0;
        left: 0;
    }

    &__fadeOut {
        animation-direction: reverse;
    }

    @keyframes fade {
        from {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
}
</style>
