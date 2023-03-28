<script setup>
import AppButton from '../../atoms/app/AppButton';
import AppIcon from '../../atoms/app/AppIcon';

defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    maxPages: {
        type: Number,
        required: true,
    },
    gaPrefix: {
        type: String,
    },
});

const emit = defineEmits(['first', 'next', 'previous']);
</script>

<template>
    <div class="c-appPagination">
        <AppButton
            :disabled="currentPage === 1"
            outline
            width="condensed"
            class="c-appPagination__paginationButton"
            :data-gtm-element="gaPrefix ? `${gaPrefix}: Pagination` : undefined"
            :data-gtm-element-detail="gaPrefix ? 'First' : undefined"
            data-qa="first page"
            aria-label="Anfang"
            @click.native="emit('first')"
        >
            <AppIcon
                name="arrow-left-double"
                size="l"
                class="c-appPagination__paginationButtonIcon"
            />
        </AppButton>
        <AppButton
            :disabled="currentPage === 1"
            outline
            width="condensed"
            class="c-appPagination__paginationButton"
            :data-gtm-element="gaPrefix ? `${gaPrefix}: Pagination` : undefined"
            :data-gtm-element-detail="gaPrefix ? 'Previous' : undefined"
            data-qa="previous page"
            aria-label="Zurück"
            @click.native="emit('previous')"
        >
            <AppIcon
                name="arrow-left"
                size="l"
                class="c-appPagination__paginationButtonIcon"
            />
        </AppButton>
        <div
            class="c-appPagination__paginationLabel"
            data-qa="page number"
        >
            {{ currentPage }} von {{ maxPages }}
        </div>
        <AppButton
            :disabled="currentPage + 1 > maxPages"
            outline
            class="c-appPagination__paginationButton"
            :data-gtm-element="gaPrefix ? `${gaPrefix}: Pagination` : undefined"
            :data-gtm-element-detail="gaPrefix ? 'Next' : undefined"
            data-qa="next page"
            aria-label="Weiter"
            @click.native="emit('next')"
        >
            <AppIcon
                name="arrow-right"
                size="l"
                class="c-appPagination__paginationButtonIcon"
            />
        </AppButton>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appPagination {
    $root: &;
    $min-width-pagination-button: 40px;

    display: flex;
    justify-content: center;
    align-items: center;

    &__paginationButton {
        min-width: $min-width-pagination-button;

        + #{$root}__paginationButton {
            margin-left: $k-spacing--s;
        }
    }

    &__paginationLabel {
        margin-right: $k-spacing--xl;
        margin-left: $k-spacing--xl;
    }
}
</style>
