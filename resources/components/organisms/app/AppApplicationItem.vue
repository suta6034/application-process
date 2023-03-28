<script setup>
import {
    computed,
    inject,
} from 'vue';

import {
    emitUserAction,
} from '../../../services/user-actions';
import {
    formatDate,
} from '../../../utils/filter';
import {
    useBreakpoints,
} from '../../../composables/breakpoint';
import {
    trackPageView,
    trackSubContentGroup,
} from '../../../utils/tracking';

import AppApplicationActions from './AppApplicationActions';
import AppBadge from '../../atoms/app/AppBadge';
import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';

import '../../../lang/application';
import {
    useTrackClick,
} from '../../../composables/track-click';

const props = defineProps({
    application: {
        default: null,
        type: Object,
    },
    hasRemove: {
        default: true,
        type: Boolean,
    },
});

const emit = defineEmits(['clicked', 'memo', 'remove', 'status', 'application-status']);

const router = inject('router');
const isLoading = computed(() => !props.application);
const applicationRoute = computed(() => ({
    name: 'page-application-detail',
    params: {
        id: props.application.id,
    },
}));

const { isMobile } = useBreakpoints();
/* istanbul ignore next */
const { trackClick } = useTrackClick(router.currentRoute.meta?.trackingCategory);

const handleLinkClick = async (event) => {
    const isNewTabClick = event.metaKey || event.ctrlKey;

    if (!isNewTabClick) event.preventDefault();

    // $router.resolve does not give 'from' referrer in meta thus, :href in appLink serves only for desktop
    // as the deeplink page gets open as a new page.
    // But for mobile, 'from' referrer is important to know to redirect correctly by clicking back button.
    // So router push is here being used.
    if (isMobile.value) {
        await router.push(applicationRoute.value);
        return;
    }

    trackSubContentGroup('Detail');
    trackPageView(`/profil/bewerbungen/${props.application.id}`);
    emit('clicked', event);
};
</script>

<template>
    <div
        class="c-appApplicationItem"
    >
        <div class="k-o-media">
            <div class="k-o-media__figure">
                <SkeletonBox
                    v-if="isLoading"
                    class="c-appApplicationItem__companyLogoSkeleton"
                    data-qa="company logo skeleton box"
                />
                <div
                    v-else
                    class="k-c-imageBox"
                >
                    <div class="c-appApplicationItem__companyLogo">
                        <img
                            v-if="application.company?.logo"
                            :src="application.company.logo"
                            :alt="`Logo des Arbeitgebers ${application.companyName}`"
                            data-qa="company logo"
                        >
                        <AppIcon
                            v-else-if="application.company?.isChiffre"
                            name="company"
                            size="2xl"
                            data-qa="chiffre logo"
                        />
                        <img
                            v-else
                            src="../../../assets/img/company-fallback-logo.png"
                            alt=""
                        >
                    </div>
                </div>
            </div>
            <div class="k-o-media__body">
                <div class="k-c-excerpt">
                    <div class="c-appApplicationItem__headlineWrapper k-c-excerpt__headline">
                        <SkeletonBox
                            v-if="isLoading"
                            data-qa="headline loading skeleton box"
                        />
                        <template v-else>
                            <TextHeadline
                                :level="3"
                                size="l"
                                bold
                                class="u-word-break"
                                data-qa="headline"
                            >
                                <!--Router link enables detail-page to be opened mobile and in new tab-->
                                <AppLink
                                    :href="$router.resolve(applicationRoute).href"
                                    neutral
                                    class="c-appApplicationItem__link"
                                    data-gtm-element="AP_L: Application"
                                    data-gtm-element-detail="Open Detail"
                                    @click.native="handleLinkClick($event); trackClick('application-detail-view')"
                                    @click.meta="trackClick('application-detail-view-new-tab')"
                                    @click.ctrl="trackClick('application-detail-view-new-tab')"
                                >
                                    {{ application.jobTitle }}
                                </AppLink>
                            </TextHeadline>
                            <AppApplicationActions
                                :application="application"
                                :has-remove="hasRemove"
                                ga-prefix="AP_L"
                                @edit="emitUserAction('application-edit-application')"
                                @memo="emit('memo'); emitUserAction(`application-${$event}-note`)"
                                @open-modal-remove="emitUserAction('application-delete')"
                                @open-popover="emitUserAction('application-open-popover')"
                                @remove="emit('remove')"
                                @status="emit('status'); emitUserAction('application-status')"
                            />
                        </template>
                    </div>
                    <div
                        class="k-c-excerpt__snippet"
                        data-qa="snippet"
                    >
                        <SkeletonBox
                            v-if="isLoading"
                            data-qa="snippet loading skeleton box"
                        />
                        <div
                            v-else
                            class="u-ellipsis"
                        >
                            <span class="k-o-chain__link">
                                {{ application.companyName }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="c-appApplicationItem__metaEnd">
            <SkeletonBox
                v-if="isLoading"
                data-qa="meta end skeleton box"
            />
            <template v-else>
                <span data-qa="date">
                    Beworben:
                    {{ formatDate({ format: 'd.m.Y', date: application.createDate }) }}
                </span>
                <AppBadge
                    v-if="application.status"
                    class="c-appApplicationItem__status"
                    small
                    :dark="application.isRejected"
                    data-qa="status"
                >
                    <template v-if="application.isRejected">
                        {{ $t(`application.status.rejected`) }}
                    </template>
                    <template v-else>
                        {{ $t(`application.status.${application.status.toLowerCase()}`) }}
                    </template>
                </AppBadge>
                <AppIcon
                    v-if="application.memo"
                    name="notepad"
                    size="s"
                    fixed-width
                />
            </template>
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/utilities/anchor-block-overlay';

// 1. Trump skeleton inline styles.
// 2. Make the skeleton the same size as the regular logo.
.c-appApplicationItem {
    $logo-height: 51px;
    $marker-width: 3px;

    position: relative;
    -webkit-tap-highlight-color: transparent;

    &__link {
        @include anchor-block-overlay;
    }

    &__companyLogo,
    &__companyLogoSkeleton {
        max-width: 14vw;
        max-height: 14vw;
        width: $logo-height !important; // 1
        height: $logo-height !important; // 1
    }

    &__companyLogo {
        display: flex;
        justify-content: center;
        align-items: center;
        color: $k-color-gray--300;
    }

    &__companyLogoSkeleton {
        box-sizing: content-box; // 2
        padding: $k-spacing--xs; // 2
    }

    &__headlineWrapper {
        display: flex;
        justify-content: space-between;
    }

    &__metaEnd {
        display: flex;
        align-items: center;
        margin-top: $k-spacing--m;
        color: $k-color-gray--600;
    }

    &__status {
        margin-right: $k-spacing--s;
        margin-left: $k-spacing--s;
    }
}
</style>
