<script setup>
import AppCupcake from '../../atoms/app/AppCupcake';
import AppIframe from '../../atoms/app/AppIframe';
import IllustrationCompanyEmptyState from '../../illustrations/IllustrationCompanyEmptyState';

defineProps({
    conversation: {
        type: Object,
    },
    hasNoCompany: {
        type: Boolean,
    },
});
</script>

<template>
    <AppCupcake
        v-if="hasNoCompany"
        data-qa="company empty state"
    >
        <template #cherry>
            <IllustrationCompanyEmptyState
                class="c-appConversationCompany__emptyStateIllustration"
            />
        </template>
        <p data-qa="empty state text">
            Dieser Arbeitgeber hat kein Profil mehr auf karriere.at.
            Wir können dir daher keine Details zum Unternehmen bieten.
        </p>
    </AppCupcake>
    <div
        v-else
        class="c-appConversationCompany__iframeContainer"
        data-qa="has company"
    >
        <AppIframe
            :src="`/x/${conversation.company.slug}?isSplitView=true`"
        />
    </div>
</template>

<style lang="scss">
.c-appConversationCompany {
    $empty-company-illustration-width: 100px;

    &__iframeContainer {
        width: 100%;
    }

    &__emptyStateIllustration {
        width: $empty-company-illustration-width;
        height: 100%;
    }
}
</style>
