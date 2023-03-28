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
    LABELS,
    track,
} from '../../../utils/tracking';

import AppLink from '../../atoms/app/AppLink';
import IllustrationCvFeatureApply from '../../illustrations/IllustrationCvFeatureApply';
import IllustrationCvFeatureJobRequest from '../../illustrations/IllustrationCvFeatureJobRequest';
import IllustrationCvFeaturePdf from '../../illustrations/IllustrationCvFeaturePdf';
import SliderArrowControl from '../../molecules/slider/SliderArrowControl';
import TextHeadline from '../../atoms/text/TextHeadline';

defineProps({
    logCreateCv: {
        type: Function,
        default: () => {},
    },
});

const carousel = ref(null);

const sliderSettings = {
    centerMode: true,
    infiniteScroll: true,
    mouseDrag: false,
    wheelControl: false,
};
const slidePrev = () => {
    /* istanbul ignore next */
    carousel.value.slidePrev();
};
const slideNext = () => {
    /* istanbul ignore next */
    carousel.value.slideNext();
};

const trackClick = (label) => {
    track({
        category: CATEGORIES.page.dashboard,
        action: ACTIONS.clickWithName(`benefitbox-${label}-LL-create`),
        label: LABELS.eventWithName(`benefitbox-${label}-LL-create`),
    });
};
</script>

<template>
    <Slider
        ref="carousel"
        :settings="sliderSettings"
        class="c-sliderCvBenefits"
        data-qa="slider benefits"
    >
        <Slide
            class="k-c-cupcake"
            data-qa="slide"
        >
            <IllustrationCvFeatureJobRequest class="k-c-cupcake__cherry"/>
            <div class="k-c-cupcake__text c-hooperBenefits__text">
                <AppLink
                    :to="{ name: 'page-profile-create-onepage' }"
                    @click.native="trackClick('benefitbox'); logCreateCv();"
                >
                    <TextHeadline
                        :level="4"
                        data-qa="headline"
                    >
                        Job-Anfragen erhalten
                    </TextHeadline>
                </AppLink>
                Lass dich bequem von Arbeitgebern finden – auch wenn du nicht aktiv suchst.
            </div>
        </Slide>
        <Slide
            class="k-c-cupcake"
            data-qa="slide"
        >
            <IllustrationCvFeatureApply class="k-c-cupcake__cherry"/>
            <div class="k-c-cupcake__text c-hooperBenefits__text">
                <AppLink
                    :to="{ name: 'page-profile-create-onepage' }"
                    @click.native="trackClick('template'); logCreateCv();"
                >
                    <TextHeadline
                        :level="4"
                        data-qa="headline apply"
                    >
                        Individuelles Design
                    </TextHeadline>
                </AppLink>
                3 Vorlagen, Farbvarianten und Schriftarten – so wird dein Lebenslauf einzigartig wie du.
            </div>
        </Slide>
        <Slide
            class="k-c-cupcake"
            data-qa="slide"
        >
            <IllustrationCvFeaturePdf class="k-c-cupcake__cherry"/>
            <div class="k-c-cupcake__text c-hooperBenefits__text">
                <AppLink
                    :to="{ name: 'page-profile-create-onepage' }"
                    @click.native="trackClick('nachrichten'); logCreateCv();"
                >
                    <TextHeadline
                        :level="4"
                        data-qa="headline pdf"
                    >
                        Einfach überzeugen
                    </TextHeadline>
                </AppLink>
                Punkte mit deinem professionellen Lebenslauf – einfach als PDF speichern oder direkt bewerben.
            </div>
        </Slide>
        <template #hooper-addons>
            <SliderArrowControl
                :next="slideNext"
                :prev="slidePrev"
                data-qa="slider controls"
            />
        </template>
    </Slider>
</template>

<style lang="scss">
@import '../../../assets/scss/dependencies/hooper';
@import '../../../assets/scss/settings/spacing';

.c-sliderCvBenefits {
    &__text {
        padding: $k-spacing--xs;
    }
}
</style>
