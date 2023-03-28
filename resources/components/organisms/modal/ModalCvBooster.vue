<script setup>
import {
    onMounted,
} from 'vue';

import {
    ACTIONS,
    CATEGORIES,
    track,
} from '../../../utils/tracking';
import {
    log,
} from '../../../utils/action-logger';

import AppButton from '../../atoms/app/AppButton';
import AppIcon from '../../atoms/app/AppIcon';
import AppSplitContentBox from '../../molecules/app/AppSplitContentBox';
import LayoutModal from '../../layouts/LayoutModal';
import router from '../../../router';

onMounted(() => {
    track({
        category: CATEGORIES.page.dashboard,
        action: ACTIONS.showWithName('kaboo-modal'),
    });
});

const createCvClick = () => {
    track({
        category: CATEGORIES.page.dashboard,
        action: ACTIONS.clickWithName('kaboo-create-cv'),
    });
    log('profile-create-cv', { source: 'dashboard' });
    router.push({ name: 'page-profile-create-onepage' });
};

const onHide = () => {
    track({
        category: CATEGORIES.page.dashboard,
        action: ACTIONS.clickWithName('kaboo-close-modal'),
    });
};
</script>

<template>
    <LayoutModal
        v-track-visibility="{ element: 'DB: Kaboo Modal' }"
        class="c-modalCvBooster"
        :ignorable="false"
        data-qa="cv-booster-modal"
        data-gtm-element="DB: Kaboo Modal"
        data-gtm-element-detail="Close Modal"
        body-layout="noMargin"
        content-layout="noPadding"
        content-width="45em"
        @hide="onHide"
    >
        <AppSplitContentBox
            class="c-modalCvBooster__splitContentBox"
            data-qa="kaboom content"
        >
            <template #illustration>
                <div class="c-modalCvBooster__media c-modalCvBooster__media--opticalFix">
                    <img
                        alt=""
                        src="../../../assets/img/illustrations/has-no-cv.png"
                    >
                </div>
            </template>
            <div class="c-modalCvBooster__contentWrap">
                <div class="c-modalCvBooster__hero">
                    <h2 class="c-modalCvBooster__headline">
                        Im Handumdrehen erstellt:
                        <br>
                        dein karriere.at Lebenslauf!
                    </h2>
                    <AppButton
                        data-qa="create cv button"
                        data-gtm-element="DB: Kaboo Modal"
                        data-gtm-element-detail="Create CV"
                        @click.native="createCvClick"
                    >
                        Jetzt anlegen
                    </AppButton>
                </div>
                <div
                    class="c-modalCvBooster__advantages"
                    data-qa="advantages"
                >
                    <div class="k-c-textDivider">
                        <hr class="k-c-textDivider__line">
                        <span class="k-c-textDivider__text">
                            Deine Vorteile
                        </span>
                        <hr class="k-c-textDivider__line">
                    </div>
                    <ul class="k-c-list">
                        <li class="k-c-list__item">
                            <AppIcon
                                size="s"
                                name="check"
                                class="k-c-list__icon"
                                fixed-width
                            />
                            <span>Perfektes Layout mit <b>modernen Design-Vorlagen</b></span>
                        </li>
                        <li class="k-c-list__item">
                            <AppIcon
                                size="s"
                                name="check"
                                class="k-c-list__icon"
                                fixed-width
                            />
                            <span><b>Einfacher bewerben</b> – Lebenslauf immer zur Hand</span>
                        </li>
                        <li class="k-c-list__item">
                            <AppIcon
                                size="s"
                                name="check"
                                class="k-c-list__icon"
                                fixed-width
                            />
                            <span>Erhalte <b>Job-Angebote</b> von interessanten Arbeitgebern</span>
                        </li>
                    </ul>
                </div>
            </div>
        </AppSplitContentBox>
    </LayoutModal>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/animations/fade-in';
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/spacing';

// 1. To create a smooth expand transition the height and width are static
//    WATCH OUT: Width and Height must be the same than in the the layoutDynamicModal
//    NICE TO HAVE: If we need a DynamicModal more often, we should create a transition via JS and dynamic properties
// 2. The CV-Illustration should be bigger than the background to create a nice overflow-effect
// 3. Add padding so the image is positioned correctly, to make dani happy
.c-modalCvBooster {
    $modal-width: 45em; // 1.

    &__splitContentBox {
        display: grid;
        grid-template-columns: 1fr;

        @media (min-width: $k-breakpoint--m) {
            grid-template-columns: 1fr 2fr;
            width: $modal-width;
        }
    }

    &__media {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: $k-spacing--l; // 3.
        height: 100%;
        background-color: $k-color-gray--100;
    }

    &__contentWrap {
        padding: $k-spacing--l $k-spacing--2xl $k-spacing--xl $k-spacing--2xl;

        @media (min-width: $k-breakpoint--m) {
            padding: $k-spacing--2xl $k-spacing--3xl $k-spacing--xl $k-spacing--3xl;
        }
    }

    &__hero {
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--l;
        }
    }

    &__headline {
        @include k-typo-xl;

        padding: $k-spacing--2xl $k-spacing--xl $k-spacing--xl;
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            @include k-typo-2xl;
        }
    }

    &__advantages {
        margin-top: $k-spacing--xl;
        text-align: left;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--2xl;
            margin-bottom: $k-spacing--4xl;
        }
    }

    .k-c-list {
        margin-top: $k-spacing--l;
    }
}
</style>
