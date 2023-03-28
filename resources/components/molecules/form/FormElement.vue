<template>
    <div class="c-formElement">
        <div
            v-if="$slots.start"
            class="c-formElement__start"
        >
            <slot name="start"/>
        </div>
        <div class="c-formElement__field">
            <slot/>
        </div>
        <div
            v-if="$slots.end"
            class="c-formElement__end"
        >
            <slot name="end"/>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';

.c-formElement {
    &__start {
        display: flex;
        justify-content: space-between;
    }

    &__field:not(:first-child) {
        margin-top: $k-spacing--xs;
    }

    &__end {
        margin-top: $k-spacing--s;
    }
}
</style>
