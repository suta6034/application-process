<script setup>
import {
    inject, onBeforeMount, onMounted,
} from 'vue';
import {
    CATEGORIES,
} from '../../utils/tracking';
import {
    FORMS,
} from '../../utils/form-settings';

import AppBusinessCard from '../organisms/app/AppBusinessCard';
import AppButton from '../atoms/app/AppButton';
import CardFaqBanner from '../organisms/card/CardFaqBanner';
import CardJobMatching from '../organisms/card/CardJobMatching';
import CardLatestApplications from '../organisms/card/CardLatestApplications';
import CardLatestCompanyFollows from '../organisms/card/CardLatestCompanyFollows';
import CardLatestJobAlarm from '../organisms/card/CardLatestJobAlarm';
import CardLatestJobWatchlist from '../organisms/card/CardLatestJobWatchlist';
import CardLatestMessages from '../organisms/card/CardLatestMessages';
import CardLatestProfileViews from '../organisms/card/CardLatestProfileViews';
import FormJobSearch from '../organisms/form/FormJobSearch';
import LayoutDefault from '../layouts/LayoutDefault';
import MinitasksContainer from '../organisms/minitask/MinitasksContainer';
import ProgressLoadingBar from '../atoms/progress/ProgressLoadingBar';
import SliderBlogArticle from '../organisms/slider/SliderBlogArticle';
import TextHeadline from '../atoms/text/TextHeadline';
import AppInfoBox from '../molecules/app/AppInfoBox';
import AppLink from '../atoms/app/AppLink';
import SvgLightBulb from '../atoms/svg/SvgLightBulb';
import {
    useActions, useMutations, useState,
} from '../../composables/vuex-helpers';
import {
    useTrackClick,
} from '../../composables/track-click';
import {
    showToast,
} from '../../utils/toast';
import {
    useTimeGatedElement,
} from '../../composables/time-gated-element';
import {
    travelReadinessInfoBox,
} from '../../data/time-gated-elements';
import {
    showSnackbar,
} from '../../utils/snackbar';

const DAYS_SINCE_KABOOM = 7;
const RETURN_OF_KABOOM_IN_DAYS = 182;

const {
    exists: hasProfile,
    fetched: isFetched,
    hasSeenBooster,
    boosterCounter,
} = useState('profile');

const {
    FETCH_PROFILE: fetchProfile,
    UPDATE_HAS_SEEN_BOOSTER: updateHasSeenBoosterState,
} = useActions('profile');

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

const router = inject('router');

const showUserFeedback = () => {
    if (router.currentRoute.query.watchlistAdded) {
        showSnackbar({
            text: 'Der Job wurde gemerkt.',
            icon: 'check',
        });
        router.replace('/dashboard');
    }
    if (router.currentRoute.query.toast) {
        showToast({ text: router.currentRoute.query.toast });
        router.replace('/dashboard');
    }
};

const { trackClick } = useTrackClick(CATEGORIES.page.dashboard);

const isBoosterOutdated = (days) => {
    const compareDate = new Date(new Date().setDate(new Date().getDate() - days));
    return new Date(hasSeenBooster.value).valueOf() <= compareDate.valueOf();
};

const goToForm = ({ id = null, hasNewForm = false }) => {
    router.push({ name: 'page-cv', params: { formId: id, newForm: hasNewForm } });
};

const {
    elementShown,
    shouldShowElement,
} = useTimeGatedElement(travelReadinessInfoBox);

onBeforeMount(async () => {
    if (!isFetched.value) await fetchProfile();

    if (!hasProfile.value && boosterCounter.value < 3 && isBoosterOutdated(DAYS_SINCE_KABOOM)) {
        showModal({ componentName: 'ModalCvBooster' });
        updateHasSeenBoosterState({ hasSeenBooster: Date.now() });
    }
    if (!hasProfile.value && boosterCounter.value >= 3 && isBoosterOutdated(RETURN_OF_KABOOM_IN_DAYS)) {
        updateHasSeenBoosterState({ hasSeenBooster: null });
        showModal({ componentName: 'ModalCvBooster' });
        updateHasSeenBoosterState({ hasSeenBooster: Date.now() });
    }
});

onMounted(showUserFeedback);

// Expose for unit tests
defineExpose({ showUserFeedback, router });
</script>
<template>
    <LayoutDefault
        has-background-gray
    >
        <div class="c-pageDashboard">
            <FormJobSearch data-qa="job search"/>
            <ProgressLoadingBar/>
            <div class="c-pageDashboard__wrap u-clearfix">
                <TextHeadline
                    :level="1"
                    size="xl"
                    class="c-pageDashboard__headline"
                    data-qa="dashboard headline"
                >
                    Übersicht über mein Profil
                </TextHeadline>
                <AppInfoBox
                    v-if="shouldShowElement && hasProfile"
                    data-qa="travel readiness change info"
                    class="c-pageDashboard__travelReadinessInfoBox"
                    oneliner
                    @hook:mounted="elementShown"
                >
                    <template #icon>
                        <SvgLightBulb
                            stroke="#02347b"
                            fill="#b3cdf0"
                        />
                    </template>
                    Die Reisebereitschaft im Wunschjob wurde von Prozent auf Tage pro Woche umgestellt.
                    <AppLink
                        data-gtm-element="DB: Infobox"
                        data-gtm-element-detail="Review Travel Readiness"
                        tag="span"
                        neutral
                        underline
                        @click="goToForm(FORMS.desiredJob)"
                    >
                        Zum Wunschjob
                    </AppLink>
                </AppInfoBox>
                <MinitasksContainer
                    data-qa="minitasks"
                    ga-prefix="DB"
                    @add="goToForm"
                />
                <div class="c-pageDashboard__layout">
                    <aside class="c-pageDashboard__sidebar k-o-ladder k-o-ladder--l">
                        <AppBusinessCard
                            class="k-o-ladder__rung"
                            data-qa="cv box"
                            @complete="goToForm"
                        />
                        <CardLatestProfileViews
                            v-if="hasProfile"
                            class="k-o-ladder__rung"
                            data-qa="profile views card"
                        />
                        <CardLatestMessages
                            v-if="hasProfile"
                            class="k-o-ladder__rung"
                            data-qa="messages card"
                        />
                        <CardFaqBanner
                            class="k-o-ladder__rung"
                            data-qa="faq card"
                            data-gtm-element="DB: FAQ Box"
                            data-gtm-element-detail="Click"
                            @click="trackClick('faq-dashboard')"
                        />
                    </aside>
                    <div class="c-pageDashboard__content k-o-ladder k-o-ladder--l">
                        <CardJobMatching
                            v-if="hasProfile"
                            ref="jobmatchingCard"
                            class="k-o-ladder__rung"
                            data-qa="job matching card"
                        />
                        <CardLatestJobAlarm
                            class="k-o-ladder__rung"
                            data-qa="job alarm card"
                        />
                        <CardLatestApplications
                            class="k-o-ladder__rung"
                            data-qa="applications card"
                            :has-profile="hasProfile"
                        />
                        <CardLatestJobWatchlist
                            class="k-o-ladder__rung"
                            data-qa="job watchlist card"
                        />
                        <CardLatestCompanyFollows
                            class="k-o-ladder__rung"
                            data-qa="company follow card"
                        />
                        <div class="c-pageDashboard__eventBanner k-c-card k-c-card--noBorder k-o-ladder__rung">
                            <div class="c-pageDashboard__eventBannerText">
                                <h4 class="k-c-headline-l u-bold c-pageDashboard__eventBannerHeadline">
                                    karriere.at Gehaltsbefragung
                                </h4>
                                <span>
                                    Gewinne jetzt € 500,– für deine Karriere!
                                </span>
                            </div>
                            <AppButton
                                outline
                                class="c-pageDashboard__eventBannerButton"
                                size="s"
                                data-gtm-element="DB: Event Box"
                                data-gtm-element-detail="Button Click"
                                :to="{ name: 'gehaltsstudie' }"
                                target-blank
                                @click.native="trackClick('event-box-dashboard')"
                            >
                                Jetzt teilnehmen
                            </AppButton>
                        </div>
                    </div>
                    <div class="c-pageDashboard__fullContent">
                        <TextHeadline
                            :level="2"
                            size="2xl"
                        >
                            karriere.blog
                        </TextHeadline>
                        <hr class="c-pageDashboard__divider k-c-divider">
                        <SliderBlogArticle
                            data-gtm-element="DB: Blog Article"
                            data-gtm-element-detail="Open Detail"
                        />
                    </div>
                </div>
            </div>
        </div>
    </LayoutDefault>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../assets/scss/tools/wrap';

// 1. Prevent the element from taking more space than available.
//    This is necessary for rendering an ellipsis text overflow.
// 2. This is necessary to keep a fixed 16:9 aspect ratio.
// 3. Required to match the different screen size designs of KSPECK-3277
.c-pageDashboard {
    $app-banner-height: 180px;

    &__wrap {
        @include wrap(math.div(10, 12));
    }

    &__layout {
        @include k-layout($k-spacing--l, $k-spacing--l);

        margin-top: $k-spacing--2xs;
    }

    &__headline {
        margin-top: $k-spacing--l + $k-spacing--m;
    }

    &__sidebar {
        @include k-layout__item(auto, 19em);

        min-width: 0; // 1
    }

    &__content {
        @include k-layout__item(max, 22em);

        min-width: 0; // 1
    }

    &__fullContent {
        @include k-layout__item(auto, 28em);

        overflow: hidden;
        margin-top: $k-spacing--3xl;
    }

    &__divider {
        margin-top: $k-spacing--m;
        margin-bottom: $k-spacing--2xl;
    }

    &__mobileAnchor {
        display: inline;

        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__eventBanner {
        position: relative;
        min-height: $app-banner-height;
        background-image: url('../../assets/img/banner/gehaltsstudie-banner.png');
        background-position: 70% top;
        background-size: cover;
        background-repeat: no-repeat;

        .k-o-ladder > &.k-o-ladder__rung {
            margin-top: $k-spacing--2xl;
        }

        @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
            background-position: right center;
        }
    }

    &__eventBannerText,
    &__eventBannerButton {
        position: relative;
        z-index: 1;
    }

    &__eventBannerText {
        padding-top: $k-spacing--xl;
        padding-right: $k-spacing--2xl;
        padding-bottom: $k-spacing--l;
        padding-left: $k-spacing--l;
        width: 65%;
    }

    &__eventBannerHeadline {
        padding-bottom: $k-spacing--xs;
    }

    &__eventBannerButton {
        margin-bottom: $k-spacing--l;
        margin-left: $k-spacing--l;
    }

    &__eventBannerImage {
        position: absolute;
        right: -36px; // 3.
        bottom: -5px; // 3.
        max-width: 200px; // 3.
        max-height: none;

        @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
            right: $k-spacing--xl;
            bottom: $k-spacing--s;
            max-width: 280px; // 3.
        }
    }

    &__link {
        color: $k-color-gray--800;

        &:hover,
        &:focus {
            color: $k-color-gray--900;
        }
    }

    &__travelReadinessInfoBox {
        margin-top: $k-spacing--l;
    }
}
</style>
