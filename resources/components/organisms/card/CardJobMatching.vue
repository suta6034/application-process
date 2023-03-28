<script setup>
import {
    Hooper as Slider,
    Slide,
} from 'hooper';

import {
    ref,
} from 'vue';

import {
    ACTIONS,
    CATEGORIES,
    track,
} from '../../../utils/tracking';

import AppCupcake from '../../atoms/app/AppCupcake';
import AppJobItem from '../app/AppJobItem';
import AppJobMatchingItem from '../../molecules/app/AppJobMatchingItem';
import AppLink from '../../atoms/app/AppLink';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import IllustrationEmptyJobMatching from '../../illustrations/IllustrationEmptyJobMatching';
import SliderArrowControl from '../../molecules/slider/SliderArrowControl';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useLatestJobMatchings,
} from '../../../composables/latest-job-matchings';

const {
    jobMatchings,
    error,
    isLoading,
    fetch,
} = useLatestJobMatchings();

const sliderSettings = {
    centerMode: true,
    infiniteScroll: true,
    itemsToShow: 1,
    mouseDrag: false,
    wheelControl: false,
};

const carousel = ref(null);

const slidePrev = () => carousel.value.slidePrev();
const slideNext = () => carousel.value.slideNext();

const trackViewAll = () => {
    track({
        category: CATEGORIES.page.dashboard,
        action: ACTIONS.clickWithName('view-all'),
    });
};

</script>

<template>
    <div class="c-cardJobMatching k-c-card k-c-card--noBorder">
        <div class="c-cardJobMatching__header">
            <div class="c-cardJobMatching__textalign k-o-distributeSpace">
                <div class="k-o-media">
                    <TextHeadline
                        :level="2"
                        size="l"
                        class="c-cardJobMatching__headline _flexbox-min-width-fix"
                    >
                        Job-Empfehlungen
                    </TextHeadline>
                </div>
                <router-link
                    v-if="jobMatchings && jobMatchings.length"
                    :to="{ name: 'page-job-matching' }"
                    class="k-c-link"
                    data-qa="show all link"
                    data-gtm-element="DB: Matching"
                    data-gtm-element-detail="Show All"
                    @click.native="trackViewAll"
                >
                    Alle anzeigen
                </router-link>
            </div>
            <div
                v-if="jobMatchings && jobMatchings.length"
                class="k-c-cupcake__text"
                data-qa="job matching description"
            >
                Passend zu deinen Angaben Wunschjob, Wunsch-Arbeitsort, Kenntnisse
            </div>
        </div>
        <div class="k-c-card__body">
            <AppRefreshPrompt
                v-if="error"
                :fetch="fetch"
                data-qa="error state"
            />
            <AppCupcake v-else-if="!isLoading && jobMatchings && jobMatchings.length === 0">
                <template #cherry>
                    <IllustrationEmptyJobMatching data-qa="empty state illustration"/>
                </template>
                <p>
                    Um Job-Empfehlungen zu erhalten sind vollständige Angaben zu deinem Wunschjob
                    und deinen Kenntnissen wichtig.
                </p>
                <template #action>
                    <AppLink :to="{ name: 'page-cv' }">
                        Lebenslauf bearbeiten
                    </AppLink>
                </template>
            </AppCupcake>
            <template v-else-if="isLoading">
                <AppJobItem loading/>
            </template>
            <div
                v-else
                class="c-cardJobMatching__sliderWrap"
            >
                <ul
                    v-if="jobMatchings.length > 1"
                    class="c-cardJobMatching__list k-o-ladder k-o-ladder--l"
                    data-qa="job matching list"
                >
                    <li
                        v-for="job in jobMatchings.slice(0,3)"
                        :key="job.id"
                        class="k-o-ladder__rung k-o-media"
                        data-qa="item"
                    >
                        <AppJobMatchingItem :job="job"/>
                    </li>
                </ul>
                <div
                    v-if="jobMatchings.length <= 1"
                    class="c-cardJobMatching__optional k-o-media"
                    data-qa="item"
                >
                    <AppJobMatchingItem :job="jobMatchings[0]"/>
                </div>
                <Slider
                    v-else
                    ref="carousel"
                    class="c-cardJobMatching__slider"
                    :settings="sliderSettings"
                    data-qa="job matching slider"
                >
                    <Slide
                        v-for="job in jobMatchings.slice(0,3)"
                        :key="job.id"
                        class="k-o-media"
                        is-centered
                        data-qa="item"
                    >
                        <AppJobMatchingItem
                            :job="job"
                            class="c-cardJobMatching__jobWrap"
                        />
                    </Slide>
                    <Slide
                        v-if="jobMatchings.length > 3"
                        class="c-cardJobMatching__slide"
                        is-centered
                        data-qa="show more card"
                    >
                        <router-link
                            class="c-cardJobMatching__showAllCard"
                            :to="{ name: 'page-job-matching' }"
                        >
                            <div class="k-c-pearls">
                                <span
                                    class="k-c-pearls__pearl c-cardJobMatching__counter"
                                >
                                    +{{ jobMatchings.length - 3 }}
                                </span>
                            </div>
                            <router-link
                                v-if="jobMatchings && jobMatchings.length"
                                :to="{ name: 'page-job-matching' }"
                                class="k-c-link c-cardJobMatching__showAllLink"
                                data-qa="show all link"
                            >
                                Job-Empfehlungen anzeigen
                            </router-link>
                        </router-link>
                    </Slide>
                </Slider>
                <SliderArrowControl
                    v-if="jobMatchings.length > 1"
                    class="c-cardJobMatching__sliderControls"
                    :is-big="true"
                    :next="slideNext"
                    :prev="slidePrev"
                    data-qa="slider controls"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/dependencies/hooper';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/layout';

.c-cardJobMatching {
    &__header {
        display: flex;
        flex-direction: column;
        padding-top: $k-spacing--m;
        padding-right: $k-spacing--l;
        padding-bottom: $k-spacing--m;
        padding-left: $k-spacing--l;
    }

    &__textalign {
        align-items: center;
    }

    &__headline {
        margin-right: $k-spacing--s;
    }

    &__headlineOptional {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: inline;
        }
    }

    &__list {
        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__slider {
        @media (min-width: $k-breakpoint--m) {
            width: 100%;
        }
    }

    &__slider,
    &__sliderControls {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: block;
        }
    }

    &__showAllCard {
        @include wrap(math.div(7, 12));

        display: block;
        padding: $k-spacing--m  $k-spacing--l $k-spacing--l;
        width: 90%;
        border: 1px solid $k-color-gray--100;
        border-radius: $k-border-radius--s;
        text-align: center;
    }

    &__showAllLink {
        display: block;
        margin-top: $k-spacing--s;
    }

    &__counter {
        padding-top: $k-spacing--m;
        border: 1px solid $k-color-white;
        text-align: center;
        background-color: $k-color-gray--100;
        color: $k-color-gray--600;
    }

    &__sliderWrap {
        position: relative;
    }

    &__jobWrap {
        width: 90%;
    }
}
</style>
