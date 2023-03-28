<script setup>
import {
    CATEGORIES,
} from '../../../utils/tracking';

import AppCupcake from '../../atoms/app/AppCupcake';
import AppIcon from '../../atoms/app/AppIcon';
import AppIframe from '../../atoms/app/AppIframe';
import AppLink from '../../atoms/app/AppLink';
import IllustrationCompanyEmptyState from '../../illustrations/IllustrationCompanyEmptyState';
import {
    useTrackClick,
} from '../../../composables/track-click';

defineProps({
    application: {
        type: Object,
    },
    hasNoCompany: {
        type: Boolean,
    },
});

const { trackClick } = useTrackClick(CATEGORIES.page.applications);
</script>

<template>
    <AppCupcake
        v-if="hasNoCompany"
        data-qa="company empty state"
    >
        <template #cherry>
            <IllustrationCompanyEmptyState
                class="c-appApplicationCompany__emptyStateIllustration"
            />
        </template>
        <p data-qa="empty state text">
            <template
                v-if="application.company?.isChiffre"
            >
                Der Arbeitgeber möchte vorerst keine Informationen bekanntgeben.
                Details zum Unternehmen erfährst du im Laufe des Bewerbungsprozesses.
            </template>
            <template
                v-else-if="!application.company?.isActive && !application.isManual"
            >
                Dieser Arbeitgeber hat kein Profil mehr auf karriere.at.
                Wir können dir daher keine Details zum Unternehmen bieten.
            </template>
            <template
                v-else-if="!application.company?.id && application.isManual"
            >
                Wenn du dich nicht über karriere.at beworben hast und/oder
                das jeweilige Unternehmen nicht in unserer Datenbank ist,
                können wir hier keine Infos zum Arbeitgeber anzeigen.
                <template
                    v-if="application.jobUrl"
                >
                    Die findest du über den von dir hinterlegten Link:
                    <span class="c-appApplicationCompany__jobUrlLinkWrapper">
                        <AppLink
                            target="_blank"
                            :href="application.jobUrl"
                            @click="trackClick('application-tab-company-showlink')"
                        >
                            <template #icon>
                                <AppIcon
                                    name="external-link"
                                    size="l"
                                />
                            </template>
                            <span class="c-appApplicationCompany__jobUrl u-ellipsis">
                                {{ application.jobUrl }}
                            </span>
                        </AppLink>
                    </span>
                </template>
            </template>
        </p>
    </AppCupcake>
    <div
        v-else
        class="c-appApplicationCompany__iframeContainer"
        data-qa="has company"
    >
        <AppIframe
            :src="`/x/${application.company.slug}?isSplitView=true`"
        />
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';

.c-appApplicationCompany {
    $empty-company-illustration-width: 100px;

    &__iframeContainer {
        width: 100%;
    }

    &__emptyStateIllustration {
        width: $empty-company-illustration-width;
        height: 100%;
    }

    &__jobUrlLinkWrapper {
        display: block;
        margin-top: $k-spacing--s;
    }

    &__jobUrl {
        max-width: 300px;
    }
}
</style>
