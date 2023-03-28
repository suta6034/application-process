<script setup>
import {
    computed, defineComponent,
    nextTick, ref,
} from 'vue';

import AppAccordion from './AppAccordion';
import AppAccordionItem from './AppAccordionItem';

const props = defineProps({
    label: {
        type: String,
        default: 'Mehr anzeigen',
    },
    center: {
        type: Boolean,
        default: false,
    },
    secondary: {
        type: Boolean,
        default: false,
    },
    showLessLabel: {
        type: String,
        default: 'Weniger anzeigen',
    },
    buttonInList: {
        type: Boolean,
        default: false,
    },
    linkToggle: {
        type: Boolean,
        default: false,
    },
    transition: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['showMore', 'showLess']);

const isMoreVisible = ref(false);
const open = ref(false);
const button = ref(null);

const classObject = computed(() => ({
    'c-appShowMore__moreToggle': true,
    'c-appShowMore__moreToggle--less': open.value,
    'in-list k-c-link': props.buttonInList,
    'k-c-link c-appShowMore__moreToggle--link': props.linkToggle,
    'c-appShowMore__moreToggle--center': props.center,
    'k-c-link--secondary c-appShowMore__moreToggle--secondary': props.secondary,
}));

const dataQa = computed(() => (open.value ? 'read less' : 'read more'));
const buttonLabel = computed(() => (open.value ? props.showLessLabel : props.label));

const setFocus = () => nextTick(() => button.value?.focus());

const ToggleButton = defineComponent({
    render(createElement) {
        return createElement('button', {
            class: classObject.value,
            attrs: {
                'data-qa': dataQa.value,
            },
        }, buttonLabel.value);
    },
});
</script>

<template>
    <AppAccordion
        class="c-appShowMore"
        tabindex="-1"
    >
        <AppAccordionItem
            v-slot="{ isActive, toggle }"
            class="c-appShowMore__item"
            @open="emit('showMore'); open = true"
            @close="emit('showLess'); open = false"
        >
            <div v-if="$slots.icon">
                <slot name="icon"/>
            </div>
            <div class="c-appShowMore__body">
                <slot/>
                <div
                    v-if="$slots.more && !isActive"
                    v-show="!isMoreVisible"
                >
                    <ToggleButton @click.native="toggle(); setFocus();"/>
                </div>
                <Transition
                    v-if="transition"
                    enter-active-class="c-appShowMore__animateIn"
                    leave-active-class="c-appShowMore__animateOut"
                    @before-enter="isMoreVisible = true"
                    @after-enter="setFocus();"
                    @after-leave="isMoreVisible = false; setFocus();"
                >
                    <div
                        v-if="$slots.more && isActive"
                        tabindex="-1"
                        class="c-appShowMore__more"
                        data-qa="more"
                    >
                        <slot name="more"/>
                        <ToggleButton @click.native="toggle(); setFocus();"/>
                    </div>
                </Transition>
                <template v-else>
                    <div
                        v-if="$slots.more && isActive"
                        tabindex="-1"
                        class="c-appShowMore__more"
                        data-qa="more"
                    >
                        <slot name="more"/>
                        <ToggleButton @click.native="toggle(); setFocus();"/>
                    </div>
                </template>
            </div>
        </AppAccordionItem>
    </AppAccordion>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/animations/fade-in';

.c-appShowMore {
    $root: &;

    &__item {
        display: flex;
    }

    // 1. Internet Explorer (sometimes) can't handle text overflow of flex children.
    //    https://stackoverflow.com/questions/35111090/text-in-a-flex-container-doesnt-wrap-in-ie11
    // 2. To prevent list points even, when the more area does not contain an ul element
    &__body {
        flex: 1; // 1
        max-width: 100%;
    }

    &__more {
        overflow: hidden;
        list-style: none; // 2.
        will-change: max-height, opacity;
    }

    &__moreToggle {
        display: block;
        margin-top: $k-spacing--xs;
        padding: 0;
        border: none;
        background-color: transparent;
        text-decoration: underline;
        font-weight: bold;
        cursor: pointer;
        transition: 0.2s color;

        &:hover,
        &:focus-visible {
            #{$root}--info & {
                color: $k-c-link-color-hover;
            }

            color: $k-color-gray--900;
            text-decoration: none;
        }

        &--secondary {
            text-decoration: none;
            font-weight: normal;

            &:hover {
                color: $k-c-link-color-hover;
                text-decoration: underline;
            }
        }

        &--less {
            margin-top: $k-spacing--m;
        }

        &--center {
            margin-top: $k-spacing--l;
            width: 100%;
            text-align: center;
        }

        &--link {
            margin-top: $k-spacing--s;
            font-weight: normal;
        }

        &.in-list {
            margin-top: $k-spacing--xl;
            font-weight: normal;

            @media (min-width: $k-breakpoint--m) {
                margin-left: $k-spacing--4xl;
            }
        }
    }

    &__animateIn,
    &__animateOut {
        animation-name: max-height, a-fade-in;
        animation-duration: 1s;
        animation-timing-function: ease-out;
        animation-fill-mode: both;
    }

    &__animateOut {
        animation-direction: reverse;
    }

    @keyframes max-height {
        from {
            max-height: 0;
        }

        to {
            max-height: 20em;
        }
    }
}
</style>
