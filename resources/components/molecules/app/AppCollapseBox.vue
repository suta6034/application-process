<script setup>
import {
    ref,
} from 'vue';
import AppBrandline from '../../atoms/app/AppBrandline';
import AppButtonIconOnly from '../../atoms/app/AppButtonIconOnly';
import AppIcon from '../../atoms/app/AppIcon';
import TextHeadline from '../../atoms/text/TextHeadline';

defineProps({
    closeable: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['hide']);

const collapsed = ref(false);
const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
};

const visible = ref(true);
const hide = () => {
    visible.value = false;
    emit('hide');
};
</script>

<template>
    <div
        v-if="visible"
        class="c-appCollapseBox k-c-card k-c-card--noBorder"
    >
        <AppBrandline class="c-appCollapseBox__brandline"/>
        <div
            :class="{'c-appCollapseBox__collapsed' : collapsed}"
            class="k-c-card__body"
        >
            <div
                v-if="!collapsed"
                class="c-appCollapseBox__wrap"
            >
                <span class="c-appCollapseBox__media">
                    <slot name="media"/>
                </span>
                <div class="c-appCollapseBox__contentWrap">
                    <div class="c-appCollapseBox__body">
                        <TextHeadline
                            :level="4"
                            bold
                        >
                            <slot name="headline"/>
                        </TextHeadline>
                        <div class="c-appCollapseBox__content">
                            <slot name="content"/>
                        </div>
                    </div>
                    <div class="c-appCollapseBox__interaction">
                        <slot name="interaction"/>
                    </div>
                </div>
            </div>
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
            <div
                v-else
                class="c-appCollapseBox__wrap c-appCollapseBox__wrap--collapsed"
                data-qa="collapsed box"
                @click="toggleCollapse"
            >
                <slot name="collapse-content"/>
            </div>
            <AppButtonIconOnly
                v-if="closeable"
                size="m"
                icon="cross"
                aria-label="Schließen"
                class="c-appCollapseBox__button"
                data-qa="close button"
                @click="hide"
            />
            <button
                v-else
                class="c-appCollapseBox__button"
                data-qa="toggle button"
                :aria-label="collapsed ? 'Ausklappen' : 'Einklappen'"
                @click="toggleCollapse"
            >
                <AppIcon
                    :class="{ 'is-open' : collapsed }"
                    class="c-appCollapseBox__toggle"
                    name="arrow-down"
                    size="m"
                />
            </button>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/z-index';
@import '../../../assets/scss/tools/wrap';
@import '../../../assets/scss/tools/surface-boost';

// 1. Overflow visible is needed to display dropdowns correct.
// 2. Customize brandline's global-styles z-index, so that style is usable within collapse-component.
.c-appCollapseBox {
    position: relative;
    overflow: visible; // 1
    margin-top: $k-spacing--l;

    &__brandline {
        position: relative;
        z-index: $z-index-zero !important; // 2
        border-top-left-radius: $k-border-radius--s;
        border-top-right-radius: $k-border-radius--s;
    }

    &__collapsed {
        padding: $k-spacing--l $k-spacing--s;
    }

    &__wrap {
        @include wrap(1, $k-spacing--l);

        display: flex;

        &--collapsed {
            justify-content: center;
            padding-right: $k-spacing--2xl;
            text-align: center;
            cursor: pointer;
        }
    }

    &__media {
        display: none;
        margin-right: $k-spacing--xl;
        margin-left: $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            display: block;
        }
    }

    &__body {
        @include wrap(1, 0, false, math.div(7, 12));
    }

    &__content {
        margin-top: $k-spacing--xs;
    }

    &__contentWrap {
        width: 100%;
    }

    &__interaction {
        display: flex;
        flex-direction: column;
        margin-top: $k-spacing--m;
        text-align: center;

        & > :not(:first-child) {
            margin-top: $k-spacing--s;
        }

        @media (min-width: $k-breakpoint--m) {
            flex-direction: row;
            align-items: flex-start;

            & > :not(:first-child) {
                margin-top: 0;
                margin-left: $k-spacing--s;
            }
        }
    }

    &__button {
        @include surface-boost;

        position: absolute;
        top: $k-spacing--m;
        right: $k-spacing--m;
        border: none;
        background: transparent;
        cursor: pointer;
    }

    &__toggle {
        color: $k-color-gray--500;
        transition: transform 0.2s;
        transform: rotate(180deg);

        &.is-open {
            transform: rotate(0deg);
        }
    }
}
</style>
