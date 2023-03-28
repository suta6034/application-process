<script setup>
import AppAccordion from '../../molecules/app/AppAccordion';
import AppAccordionItem from '../../molecules/app/AppAccordionItem';
import AppIcon from '../../atoms/app/AppIcon';

defineProps({
    label: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    isActiveInitially: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <AppAccordion class="c-appMotivationLetterAssemblyKitAccordion">
        <AppAccordionItem
            v-slot="{ isActive, toggle }"
            :is-active-initially="isActiveInitially"
        >
            <button
                ref="toggleButton"
                class="c-appMotivationLetterAssemblyKitAccordion__head"
                data-qa="toggle button"
                @click="toggle"
            >
                {{ label }}
                <AppIcon
                    :class="{ 'is-open' : isActive }"
                    class="c-appMotivationLetterAssemblyKitAccordion__icon"
                    name="arrow-down"
                    size="l"
                />
            </button>
            <slot
                v-if="isActive"
                name="infobox"
            />
            <ul
                v-if="isActive"
                class="c-appMotivationLetterAssemblyKitAccordion__items"
                :class="{['has-infobox']: $slots.infobox}"
                data-qa="items"
            >
                <li
                    v-for="item in items"
                    :key="item.text"
                    class="c-appMotivationLetterAssemblyKitAccordion__item"
                >
                    <slot
                        name="item"
                        v-bind="item"
                    />
                </li>
            </ul>
        </AppAccordionItem>
    </AppAccordion>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appMotivationLetterAssemblyKitAccordion {
    &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: $k-spacing--m $k-spacing--l;
        width: 100%;
        border: none;
        background-color: $k-color-gray--50;
        cursor: pointer;
    }

    &__icon {
        margin-top: $k-spacing--2xs;
        margin-left: $k-spacing--m;
        transition: transform 0.2s;

        &.is-open {
            transform: rotate(180deg);
        }
    }

    &__label {
        background: $k-color-gray--50;
    }

    &__items {
        margin-top: $k-spacing--xs;
        padding: $k-spacing--l;
        background: $k-color-gray--50;

        &.has-infobox {
            margin-top: $k-spacing--s;
        }
    }

    &__item {
        &:not(:first-child) {
            margin-top: $k-spacing--l;
            padding-top: $k-spacing--l;
            border-top: 1px solid $k-color-gray--200;
        }
    }
}
</style>
