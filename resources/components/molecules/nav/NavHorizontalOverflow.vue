<script setup>
import {
    onMounted, onUnmounted, ref,
} from 'vue';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';

const STICKY_DELAY_IN_MS = 200;

defineProps({
    activeItem: {
        default: null,
        type: String,
    },
    isCentered: {
        default: false,
        type: Boolean,
    },
    isLoading: {
        default: false,
        type: Boolean,
    },
    isSticky: {
        default: false,
        type: Boolean,
    },
    items: {
        required: true,
        type: Array,
    },
    isSplitviewTabNav: {
        type: Boolean,
        default: false,
    },
});

const isStickyVisible = ref(false);
const shadowEndIsVisible = ref(true);
const shadowStartIsVisible = ref(false);
const shadowVisibilityIsUpdating = ref(false);
const lastScroll = ref(0);
const scrollStartTime = ref(null);
const scrollDuration = ref(0);
const stickyVisibilityIsUpdating = ref(false);
const lastScrollTop = ref(window.scrollY);
const root = ref(null);
const list = ref(null);

let resetScrollInfo;

const waitForDelay = () => {
    lastScroll.value = new Date().getTime();

    if (!scrollStartTime.value) {
        scrollStartTime.value = lastScroll.value;
        return true;
    }

    scrollDuration.value = lastScroll.value - scrollStartTime.value;

    return scrollDuration.value < STICKY_DELAY_IN_MS;
};
const scrollToActiveLink = () => {
    const activeLink = root.value?.querySelector('.is-active');

    if (activeLink && list.value !== undefined) {
        const listWidth = list.value.clientWidth;
        const itemWidth = activeLink.clientWidth;

        list.value.scrollLeft = activeLink.offsetLeft - ((listWidth / 2) - (itemWidth / 2));
    }
};
const updateStickyVisibility = () => {
    if (stickyVisibilityIsUpdating.value || waitForDelay()) return;

    stickyVisibilityIsUpdating.value = true;

    requestAnimationFrame(() => {
        isStickyVisible.value = lastScrollTop.value > window.scrollY;
        lastScrollTop.value = window.scrollY;
        stickyVisibilityIsUpdating.value = false;
    });
};
const updateShadowVisibility = ({ target }) => {
    if (shadowVisibilityIsUpdating.value) return;

    shadowVisibilityIsUpdating.value = true;

    requestAnimationFrame(() => {
        const maxScrollEndReached = target.scrollLeft >= target.scrollWidth - target.offsetWidth;
        shadowEndIsVisible.value = !maxScrollEndReached;

        const maxScrollStartReached = target.scrollLeft <= 0;
        shadowStartIsVisible.value = !maxScrollStartReached;

        shadowVisibilityIsUpdating.value = false;
    });
};
// Exposing for unit test
defineExpose({ scrollToActiveLink });
onMounted(() => {
    shadowVisibilityIsUpdating.value = false;
    scrollToActiveLink();

    lastScroll.value = 0;
    scrollStartTime.value = null;
    scrollDuration.value = 0;
    stickyVisibilityIsUpdating.value = false;
    lastScrollTop.value = window.scrollY;

    /* istanbul ignore next */
    resetScrollInfo = setInterval(() => {
        const scrollEndTimeout = 100;

        if (new Date().getTime() - lastScroll.value > scrollEndTimeout) {
            scrollStartTime.value = null;
            lastScrollTop.value = window.scrollY;
        }
    }, STICKY_DELAY_IN_MS);

    document.addEventListener('scroll', updateStickyVisibility);
});

onUnmounted(() => {
    document.removeEventListener('scroll', updateStickyVisibility);
    clearInterval(resetScrollInfo);
});
</script>

<template>
    <nav
        ref="root"
        :class="{
            'is-centered': isCentered,
            'is-sticky': isSticky,
            'is-sticky-visible': isStickyVisible,
            'c-navHorizontalOverflow--isSplitviewTabNav': isSplitviewTabNav,
        }"
        class="c-navHorizontalOverflow"
    >
        <div class="c-navHorizontalOverflow__inner">
            <ul
                ref="list"
                class="c-navHorizontalOverflow__list"
                data-qa="list"
                @scroll="updateShadowVisibility"
            >
                <li
                    v-for="(item) in items"
                    :key="item.id"
                    class="c-navHorizontalOverflow__item"
                    :data-qa="item.id"
                    data-gtm-element="AP_D: Tab"
                    :data-gtm-element-detail="`${item.trackingName}`"
                >
                    <SkeletonBox
                        v-if="isLoading"
                        width="6em"
                    />
                    <template v-else>
                        <!--
                                Using only a single dynamic component is not possible here because
                                `.native` click event modifier does throw an error on native HTML
                                elements like `<button>`.
                            -->
                        <RouterLink
                            v-if="item.tag === 'router-link'"
                            :to="item.to"
                            active-class="is-active"
                            class="c-navHorizontalOverflow__link"
                            data-qa="link"
                            @click.native="$emit('click-link', item.id)"
                        >
                            {{ item.name }}
                            <span
                                v-if="item.notification"
                                class="c-navHorizontalOverflow__notification"
                                :aria-label="item.notification.label"
                                :data-qa="`${item.id} notification`"
                            />
                        </RouterLink>
                        <Component
                            :is="item.tag"
                            v-else
                            :class="{ 'is-active': activeItem === item.id }"
                            class="c-navHorizontalOverflow__link"
                            data-qa="link"
                            @click="$emit('click-link', item.id)"
                        >
                            {{ item.name }}
                            <span
                                v-if="item.notification"
                                class="c-navHorizontalOverflow__notification"
                                :aria-label="item.notification.label"
                                :data-qa="`${item.id} notification`"
                            />
                        </Component>
                    </template>
                </li>
            </ul>
            <Transition
                enter-active-class="c-navHorizontalOverflow__shadow--fadeIn"
                leave-active-class="c-navHorizontalOverflow__shadow--fadeOut"
            >
                <span
                    v-show="shadowStartIsVisible"
                    class="c-navHorizontalOverflow__shadow c-navHorizontalOverflow__shadow--start"
                    data-qa="shadow start"
                />
            </Transition>
            <Transition
                enter-active-class="c-navHorizontalOverflow__shadow--fadeIn"
                leave-active-class="c-navHorizontalOverflow__shadow--fadeOut"
            >
                <span
                    v-show="shadowEndIsVisible"
                    class="c-navHorizontalOverflow__shadow c-navHorizontalOverflow__shadow--end"
                    data-qa="shadow end"
                />
            </Transition>
        </div>
    </nav>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '../../../assets/scss/settings/branding';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/font-size';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/z-index';
@import '../../../assets/scss/tools/wrap';

// 1. This must be larger than max scrollbar height in any browser and OS.
//    It is not relative to any other value on the page, so px is appropriate.
// 2. The height is defined in the style guide. Also a explicit height has to be set
//    to prevent jumpy behaviour when switching from relative to fixed positioning.
// 3. Hide the scrollbar on devices with touch input.
// 4. Move the scrollbar outside of the visible area by making the element taller than the parent element.
// 5. Using 0% rgba value instead of transparent because of Safari.
// 6. Pixel values are required here in order to avoid display issues because of rounding in Chrome.
.c-navHorizontalOverflow {
    $root: &;
    $border-width: 1px;
    $height: $branding-header-height;
    $scrollbar-height: 20px; // 1
    $shadow-width: 4em;
    $notification-size: 6px; // 6

    height: $height; // 2

    &.is-sticky {
        position: sticky;
        top: -$height;
        z-index: $z-index-nav-sub;
        transition: top 0.2s;
    }

    &.is-sticky-visible {
        top: 0;
    }

    &--isSplitviewTabNav {
        #{$root}__inner {
            padding-right: $k-spacing--l;
            padding-left: $k-spacing--l;

            @media (min-width: $k-breakpoint--m) {
                padding-right: 0;
                padding-left: 0;
            }
        }
    }

    @media (pointer: coarse) {
        overflow: hidden; // 3
    }

    &__inner {
        position: relative;
        display: flex;
        align-items: center;
        height: $height; // 2
        background: $k-color-white;

        &::before {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            border-bottom: $border-width solid $k-color-gray--100;
            content: '';
        }
    }

    &__list {
        position: relative;
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0;
        list-style-type: none;
        -webkit-overflow-scrolling: touch;

        @media (pointer: coarse) {
            &::-webkit-scrollbar {
                display: none;
            }

            height: $height + $scrollbar-height; // 4
        }

        .is-centered & {
            @include wrap;
        }
    }

    &__item {
        flex-shrink: 0;

        &:not(:first-child) {
            margin-left: $k-spacing--xl;
        }
    }

    &__link {
        position: relative;
        display: inline-flex;
        align-items: center;
        padding: 0;
        height: $height;
        border: none;
        border-bottom: $border-width solid transparent;
        background-color: transparent;
        cursor: pointer;

        &,
        &:visited {
            color: inherit;
        }

        &:hover,
        &:focus,
        &.is-active {
            border-bottom-color: $k-c-link-color;
            color: $k-c-link-color;
        }
    }

    &__notification {
        position: absolute;
        top: 0.95em;
        right: -0.45em;
        padding: 0;
        width: $notification-size;
        height: $notification-size;
        border-radius: 50%;
        background-color: $k-color-red--500;
    }

    &__shadow {
        position: absolute;
        top: 0;
        width: $shadow-width;
        height: $height - $border-width;
        background: linear-gradient(to right, rgba($k-color-white, 0), $k-color-white 80%); // 5
        transition: opacity 0.3s;
        pointer-events: none;

        &--start {
            left: 0;
            transform: rotate(180deg);
        }

        &--end {
            right: 0;
        }

        &--fadeIn {
            opacity: 1;
        }

        &--fadeOut {
            opacity: 0;
        }
    }
}
</style>
