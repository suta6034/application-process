<script setup>
import AppAccordion from './AppAccordion';
import AppAccordionItem from './AppAccordionItem';
import AppIcon from '../../atoms/app/AppIcon';

defineProps({
    isExpandable: {
        type: Boolean,
        default: true,
    },
});
</script>

<template>
    <AppAccordion class="c-appCollapsible">
        <AppAccordionItem v-slot="{ isActive, toggle }">
            <Component
                :is="isExpandable ? 'button' : 'div'"
                class="c-appCollapsible__head"
                data-qa="toggle button"
                @click="isExpandable && toggle()"
            >
                <slot name="label"/>
                <AppIcon
                    v-if="isExpandable"
                    :class="{ 'is-open' : isActive }"
                    class="c-appCollapsible__icon"
                    name="arrow-down"
                    size="l"
                />
            </Component>
            <slot
                v-if="isActive"
                name="content"
            />
        </AppAccordionItem>
    </AppAccordion>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-appCollapsible {
    &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        width: 100%;
        border: none;
        background-color: transparent;
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
}
</style>
