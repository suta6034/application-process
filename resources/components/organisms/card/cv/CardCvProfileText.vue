<script setup>
import {
    ref,
    computed,
    watch,
} from 'vue';

import {
    useBreakpoints,
} from '../../../../composables/breakpoint';

import AppButtonIconOnly from '../../../atoms/app/AppButtonIconOnly';
import AppButtonUnstyled from '../../../atoms/app/AppButtonUnstyled';
import AppCard from '../../../molecules/app/AppCard';
import AppCvItem from '../../app/AppCvItem';
import AppIcon from '../../../atoms/app/AppIcon';
import AppLink from '../../../atoms/app/AppLink';
import FormCvProfileText from '../../form/cv/FormCvProfileText';
import TextHeadline from '../../../atoms/text/TextHeadline';

import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const MAX_CHARS = 365;
const cardKey = 'PROFILE_TEXT';

const { isMediumScreen } = useBreakpoints();
const ELLIPSIS_LIMIT = isMediumScreen.value ? 85 : 20;

const element = ref(null);
const showMore = ref(false);
const moreIsVisible = ref(showMore.value);

const {
    resetEditAndScroll,
    openEdit,
    activeForm,
} = useCvCard({ cardKey, element });

const { profileText } = useState('profile/profileText');

const getTruncatedProfileText = computed(() => {
    let text = '';

    if (profileText.value.length > MAX_CHARS) {
        text = `${profileText.value.substr(0, ELLIPSIS_LIMIT)}...`;

        if (showMore.value) text = profileText.value.substr(0, ELLIPSIS_LIMIT);
    } else text = profileText.value;

    return text;
});

const emit = defineEmits(['track']);

watch(showMore, () => {
    if (showMore.value) emit('track');
});

defineExpose({ showMore }); // Expose for unit test
</script>
<template>
    <AppCard
        ref="element"
        class="c-cardCvProfileText"
        data-qa="profile text card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
            >
                Freitext
            </TextHeadline>
        </template>
        <template #action>
            <AppButtonIconOnly
                v-if="profileText && profileText.length && activeForm !== cardKey"
                size="xl"
                icon="pen"
                aria-label="Bearbeiten"
                data-qa="edit profile text"
                data-gtm-element="PR_L: Profile Text"
                data-gtm-element-detail="Edit"
                @click="openEdit('profile-list-profiletext-edit')"
            />
        </template>
        <div
            v-if="profileText && activeForm !== cardKey"
            class="c-cardCvProfileText__content"
            :class="{ 'is-expanded': showMore }"
            data-qa="profile text"
        >
            <span
                v-if="!showMore"
                class="c-cardCvProfileText__default"
                :class="{ 'is-hidden': moreIsVisible }"
                data-qa="truncate profile text"
            >
                {{ getTruncatedProfileText }}
                <AppLink
                    v-if="profileText.length > 365 && profileText.length < 2001"
                    tag="button"
                    data-qa="read more"
                    @click="showMore = true"
                >
                    Mehr anzeigen
                </AppLink>
                <AppLink
                    v-if="profileText.length > 365 && profileText.length > 2000"
                    tag="button"
                    data-qa="read all"
                    data-gtm-element="PR_L: Profile Text"
                    data-gtm-element-detail="Edit"
                    @click="openEdit('profile-list-profiletext-edit')"
                >
                    Alles anzeigen
                </AppLink>
            </span>
            <Transition
                enter-active-class="c-cardCvProfileText__animateIn"
                leave-active-class="c-cardCvProfileText__animateOut"
                @before-enter="moreIsVisible = true"
                @after-leave="moreIsVisible = false"
            >
                <span
                    v-if="showMore"
                    class="c-cardCvProfileText__more"
                    data-qa="full profile text"
                >
                    {{ profileText }}
                    <AppLink
                        tag="button"
                        class="c-cardCvProfileText__lessToggle"
                        data-qa="read less"
                        @click="showMore = false"
                    >
                        Weniger anzeigen
                    </AppLink>
                </span>
            </Transition>
        </div>
        <AppCvItem
            v-if="!profileText && activeForm !== cardKey"
            empty-state
            data-qa="empty state"
            data-gtm-element="PR_L: Profile Text"
            data-gtm-element-detail="Add"
            @click.native="openEdit('profile-list-profiletext-add')"
        >
            <template #figure>
                <AppIcon
                    name="plus"
                    size="2xl"
                    data-qa="add profile text"
                />
            </template>
            <template #headline>
                <AppButtonUnstyled>
                    Freitext hinzufügen
                </AppButtonUnstyled>
            </template>
            <template #snippet>
                Macht sich immer gut im Lebenslauf
            </template>
        </AppCvItem>
        <FormCvProfileText
            v-if="activeForm === cardKey"
            class="c-cardCvProfileText__form"
            data-qa="edit form"
            @closeEdit="resetEditAndScroll"
            @destroy="showMore = false"
        />
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/breakpoint';
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';
@import '../../../../assets/scss/animations/fade-in';
@import '~@karriereat/global-styles/scss/components/link/index';

.c-cardCvProfileText {
    $max-height-expanded: 31em;
    $max-height-expanded-tablet: 51em;
    $max-height-closed: 12em;

    // KSPECK-2919 will be displaced with List-Component Empty State
    &__emptyState {
        margin: $k-spacing--s;
        color: $k-color-green--700;
    }

    // 1. Internet Explorer (sometimes) can't handle text overflow of flex children.
    //    https://stackoverflow.com/questions/35111090/text-in-a-flex-container-doesnt-wrap-in-ie11
    &__body {
        flex: 1; // 1
    }

    &__content {
        overflow-wrap: anywhere;
        height: auto;
        transition: max-height 0.7s ease-out;

        @media (min-width: $k-breakpoint--m) {
            max-height: $max-height-closed;
        }

        &.is-expanded {
            transition: max-height 0.7s ease-in;

            @media (min-width: $k-breakpoint--m) {
                max-height: $max-height-expanded-tablet;
            }

            @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
                max-height: $max-height-expanded;
            }
        }
    }

    &__default {
        &.is-hidden {
            display: none;
        }
    }

    &__more {
        overflow: hidden;
        will-change: max-height, opacity;
    }

    &__lessToggle {
        margin-top: $k-spacing--s;
    }

    &__animateIn,
    &__animateOut {
        animation-name: a-fade-in;
        animation-duration: 1s;
        animation-timing-function: ease-out;
        animation-fill-mode: both;
    }

    &__animateOut {
        animation-direction: reverse;
    }

    &__form {
        padding-bottom: $k-spacing--xl;
    }
}
</style>
