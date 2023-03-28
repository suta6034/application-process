<script setup>
import {
    inject, nextTick,
} from 'vue';
import * as gdpr from '../../../services/gdpr';

import mitt from '../../../utils/mitt';
import {
    ACTIONS,
    CATEGORIES,
    track,
} from '../../../utils/tracking';
import {
    log,
} from '../../../utils/action-logger';

import AppButton from '../../atoms/app/AppButton';
import AppButtonIconOnly from '../../atoms/app/AppButtonIconOnly';
import AppLink from '../../atoms/app/AppLink';
import LayoutDynamicModal from '../../layouts/LayoutDynamicModal';
import TextHeadline from '../../atoms/text/TextHeadline';

import {
    commitAndShowModal,
} from '../../../utils/error';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const store = inject('store');

const props = defineProps({
    consentType: {
        required: true,
        type: String,
    },
    generalInfo: {
        default: '',
        type: String,
    },
    specificInfos: {
        default: () => [],
        type: Array,
    },
});

async function accept() {
    try {
        await gdpr.approve(props.consentType);
        mitt.emit('consent-accepted', props.consentType);
        log('first-activation-modal-profile-active');
        hide();
    } catch (error) {
        hide();
        // Wait for re-render after hiding the popup.
        await nextTick();
        commitAndShowModal(store.commit, error);
    }
}

function trackClickAndClose() {
    track({
        category: CATEGORIES.page.profile,
        action: ACTIONS.clickWithName('close-first-activation-modal'),
    });
    hide();
}

// Exposing for unit test
defineExpose({ accept, trackClickAndClose });

</script>

<template>
    <LayoutDynamicModal
        class="c-modalGdpr"
        ignorable
        mobile-overlay
        data-qa="modal"
    >
        <div class="c-modalGdpr__fadeOut">
            <AppButtonIconOnly
                icon="cross"
                aria-label="Schließen"
                class="c-modalGdpr__close"
                data-qa="close button"
                @click.native="trackClickAndClose()"
            />
        </div>
        <div class="c-modalGdpr__header">
            <TextHeadline
                :level="2"
                size="l"
                class="c-modalGdpr__headline"
                data-qa="headline"
            >
                Lebenslauf-Datenschutz<span class="c-modalGdpr__headlineOptional">erklärung</span>
            </TextHeadline>
        </div>
        <div class="c-modalGdpr__wrap">
            <p class="c-modalGdpr__text">
                Bitte lies dir folgende Informationen aufmerksam durch und stimme zu:
            </p>

            <ul
                v-if="specificInfos.length"
                class="c-modalGdpr__specificInfos"
                data-qa="specific infos"
            >
                <li
                    v-for="(info, index) in specificInfos"
                    :key="index"
                    class="c-modalGdpr__specificInfo"
                >
                    <TextHeadline
                        :level="3"
                        class="c-modalGdpr__specificHeadline"
                    >
                        {{ info.headline }}
                    </TextHeadline>
                    <p class="c-modalGdpr__specificInfoText">
                        {{ info.text }}
                    </p>
                </li>
            </ul>

            <div
                v-if="generalInfo"
                class="c-modalGdpr__generalInfo"
                data-qa="general info"
                v-html="generalInfo"
            />
        </div>
        <div class="c-modalGdpr__actions">
            <AppLink
                class="c-modalGdpr__back"
                tag="button"
                data-qa="decline"
                @click="hide"
            >
                Abbrechen
            </AppLink>
            <AppButton
                data-qa="accept"
                @click="accept"
            >
                Ok, Lebenslauf aktivieren
            </AppButton>
        </div>
    </LayoutDynamicModal>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';
@import '~@karriereat/global-styles/scss/components/link/mixins';
@import '~@karriereat/global-styles/scss/components/headline/index';

// 1. Compensate for the spacing on the infos.
// 2. Bottom margin is used because of quirks with margin top in combination with `column-count`.
// 3. The consentinfo-text and its html is provided by an API, therefor we need to style the a-tag directly.
.c-modalGdpr {
    $modal-width: 45em; // 1.
    $z-index: 1;

    &__wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: $k-spacing--xl $k-spacing--xl;
        text-align: left;

        @media (min-width: $k-breakpoint--m) {
            padding: $k-spacing--xl $k-spacing--4xl $k-spacing--m;
            width: $modal-width;
        }
    }

    &__header {
        position: sticky;
        top: 0;
        display: flex;
        padding: $k-spacing--l;
        border-bottom: 1px solid $k-color-gray--100;
        background-color: $k-color-white;

        @media (min-width: $k-breakpoint--m) {
            position: relative;
            padding: $k-spacing--3xl $k-spacing--xl 0;
            border-bottom: unset;
        }
    }

    &__fadeOut {
        @media (min-width: $k-breakpoint--m) {
            position: sticky;
            top: 0;
            z-index: $z-index;
            margin-bottom: -$k-spacing--2xl;
            width: 100%;
            height: $k-spacing--2xl;
            background: linear-gradient(180deg, $k-color-white 0, rgb(255 255 255 / 0%) 100%);
        }
    }

    &__headline {
        flex-grow: 1;
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            @include k-typo-2xl;
        }
    }

    &__headlineOptional {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: inline;
        }
    }

    &__close {
        position: fixed;
        top: 0;
        right: 0;
        z-index: $z-index;
        margin: $k-spacing--s;

        @media (min-width: $k-breakpoint--m) {
            position: absolute;
        }
    }

    &__specificHeadline {
        @include k-typo-s;

        color: $k-color-gray--500;
        text-transform: uppercase;
    }

    &__specificInfos {
        margin-top: $k-spacing--m;
        padding: $k-spacing--m;
        padding-bottom: 0; // 1
        border: 1px solid $k-color-gray--200;

        @media (min-width: $k-breakpoint--m) {
            column-count: 2;
        }
    }

    &__specificInfo {
        margin-bottom: $k-spacing--m; // 2
        break-inside: avoid;
    }

    &__specificInfoText {
        margin-top: $k-spacing--xs;
    }

    &__generalInfo {
        word-wrap: break-word;

        &,
        > * {
            margin-top: $k-spacing--m;
        }

        a { // 3
            @include k-c-link;
        }
    }

    &__actions {
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        padding-top: $k-spacing--m;
        padding-bottom: $k-spacing--3xl;

        @media (min-width: $k-breakpoint--m) {
            position: sticky;
            bottom: 0;
            flex-direction: row;
            justify-content: flex-end;
            align-items: baseline;
            margin-top: $k-spacing--xl;
            padding: $k-spacing--m $k-spacing--4xl;
            background-color: $k-color-gray--50;
        }
    }

    &__back {
        margin-top: $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            margin-right: $k-spacing--l;
        }
    }
}
</style>
