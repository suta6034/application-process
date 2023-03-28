<script setup>
import {
    Hooper as Slider,
    Slide,
} from 'hooper';

import {
    computed,
    inject, onBeforeMount, ref, watch,
} from 'vue';
import availableTemplateSettings from '../../../data/template-settings.json';
import {
    isEmbedded,
} from '../../../utils/frame-check';
import {
    log,
} from '../../../utils/action-logger';

import AppButton from '../../atoms/app/AppButton';
import AppCvFilePreviewImage from '../../molecules/app/AppCvFilePreviewImage';
import AppPill from '../../atoms/app/AppPill';
import AppToggle from '../../atoms/app/AppToggle';
import IllustrationTemplateFontElegant from '../../illustrations/IllustrationTemplateFontElegant';
import IllustrationTemplateFontSimple from '../../illustrations/IllustrationTemplateFontSimple';
import SliderArrowControl from '../../molecules/slider/SliderArrowControl';
import {
    useActions, useGetters, useMutations,
} from '../../../composables/vuex-helpers';

const router = inject('router');

const props = defineProps({
    profileCreate: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
    },
    variant: {
        type: String,
    },
    querySettings: {
        type: Object,
        default: null,
    },
    reset: {
        type: Boolean,
        default: false,
    },
    resetHover: {
        type: Boolean,
        default: false,
    },
});

const {
    templateSettings,
} = useGetters('templateSettings');
const {
    count: workExperienceCount,
} = useGetters('profile/work');
const {
    count: educationCount,
} = useGetters('profile/education');

const sliderSettings = {
    itemsToShow: 1,
    centerMode: true,
    infiniteScroll: true,
    wheelControl: false,
    mouseDrag: false,
};
const carousel = ref(null);
const init = ref(true);
const slideIndex = ref(0);
const settingsCache = ref(null);
const isTemplateHovered = ref(false);
const educationFirst = ref(false);

const availableColors = computed(() => availableTemplateSettings
    .find(x => x.key === templateSettings.value.template).colors);

const {
    SET_TEMPLATE_SETTINGS: setTemplateSettings,
    SET_TEMPLATE_SETTINGS_BY_KEY: setTemplateSettingsByKey,
    SET_MODIFIED: setModified,
} = useMutations('templateSettings');

const {
    FETCH_TEMPLATE_SETTINGS: fetchTemplateSettings,
} = useActions('templateSettings');

const validateTemplateSettings = settings => availableTemplateSettings
    .findIndex(x => x.key === settings.template);

const getDefaultTemplateSettingsByName = (templateName) => {
    const settings = availableTemplateSettings.find(x => x.key === templateName);
    return {
        template: settings.key,
        color: settings.colors.find(color => color.default).id,
        font: settings.fonts.find(font => font.default).id,
    };
};
const getSelectedLabel = ({ key, value }) => {
    const activeTemplate = availableTemplateSettings.find(x => x.key === templateSettings.value.template);
    if (key === 'template') return activeTemplate.label;
    const element = activeTemplate[key].find(x => x.id === value);
    return element.label;
};

const getAppPillStatus = settings => ((settings.value === templateSettings.value[settings.key])
            || (!isTemplateHovered.value && settingsCache.value !== null
                && settings.value === settingsCache.value[settings.key]) ? 'checked' : undefined);
const applySelectedTemplateDefaults = (template) => {
    if (typeof template.value === 'number') {
        /* eslint-disable no-param-reassign */
        template.value = availableTemplateSettings[template.value].key;
    }
    const index = typeof template.value === 'number' ? template.value
        : availableTemplateSettings.findIndex(x => x.key === template.value);

    // Set template
    setTemplateSettingsByKey(template);
    // Set default color for the current template
    const currentColor = settingsCache.value !== null && settingsCache.value.template === template.value
        ? settingsCache.value.color
        : availableTemplateSettings[index].colors.find(color => color.default).id;
    setTemplateSettingsByKey({ key: 'color', value: currentColor });
    // Set default font for the current template
    const currentFont = settingsCache.value !== null && settingsCache.value.template === template.value
        ? settingsCache.value.font : availableTemplateSettings[index].fonts.find(font => font.default).id;
    setTemplateSettingsByKey({ key: 'font', value: currentFont });

    slideIndex.value = index;
};
const setTemplateSettingsOnClick = (settings) => {
    settingsCache.value = null;
    if (settings.key === 'template') {
        applySelectedTemplateDefaults(settings);
    } else {
        setTemplateSettingsByKey(settings);
    }
};

const resetHoverSettings = () => {
    if (isTemplateHovered.value) isTemplateHovered.value = false;
    if (settingsCache.value !== null) {
        applySelectedTemplateDefaults({ key: 'template', value: settingsCache.value.template });
        setTemplateSettingsByKey({ key: 'color', value: settingsCache.value.color });
        setTemplateSettingsByKey({ key: 'font', value: settingsCache.value.font });
    }
};
const setCache = () => {
    settingsCache.value = { ...templateSettings.value };
};
const setTemplateSettingsOnHover = (settings) => {
    setCache();
    if (settings.key === 'template') {
        isTemplateHovered.value = true;
        applySelectedTemplateDefaults(settings);
    } else {
        setTemplateSettingsByKey(settings);
    }
};
const slidePrev = () => {
    /* istanbul ignore next */
    carousel.value.slidePrev();
};
const slideNext = () => {
    /* istanbul ignore next */
    carousel.value.slideNext();
};
const updateCarousel = (payload) => {
    // This prevents the hooper slider from counting wrong and provide the correct index.
    // When switching from the last slide to the first, the index should be set to 0
    // and not be increased by one.
    // It should also work to switch from the last slide to the first slide.
    // Therefore the index should be, the index of the last slide and not -1
    /* istanbul ignore next */
    const index = payload.currentSlide > (availableTemplateSettings.length - 1) ? 0 : payload.currentSlide;
    slideIndex.value = index < 0 ? (availableTemplateSettings.length - 1) : index;
    if (init.value === false) {
        applySelectedTemplateDefaults({ key: 'template', value: slideIndex.value });
    }
    init.value = false;
};
const next = async () => {
    await router.push({ name: 'form-profile-create-onepage' });
};
const logCvTemplate = () => {
    log('cv-template-selection', { ...templateSettings.value });
};

onBeforeMount(async () => {
    if (isEmbedded() && props.reset) setModified(false);

    await fetchTemplateSettings(props.profileCreate);

    if (props.querySettings && props.querySettings.template
        && validateTemplateSettings(props.querySettings) > -1) {
        const cleanQuerySettings = {};
        Object.keys(props.querySettings)
            .forEach((key) => {
                if (props.querySettings[key] !== null) cleanQuerySettings[key] = props.querySettings[key];
            });
        setTemplateSettings({
            ...getDefaultTemplateSettingsByName(props.querySettings.template),
            ...cleanQuerySettings,
        });
    }

    educationFirst.value = templateSettings.value.educationFirst;

    // this simulates the initialSlide behaviour of the hooper
    // init is set to true to make sure the settings from the store aren't overwritten with the default
    // in the updateCarousel handler
    slideIndex.value = availableTemplateSettings.findIndex(x => x.key === templateSettings.value.template);
    if (slideIndex.value !== 0) init.value = true;
});

watch(slideIndex, () => {
    if (!carousel.value.isSliding) {
        carousel.value.slideTo(slideIndex.value);
    } else {
        // this waits for the current slide to finish and then triggers a new slideTo
        // as the hooper aborts new slideTo calls when isSliding is still true
        window.setTimeout(() => {
            carousel.value.slideTo(slideIndex.value);
        }, carousel.value.config.transition);
    }
});

watch(() => props.resetHover, () => {
    if (props.resetHover.value) {
        resetHoverSettings();
    }
});

// Expose for unit tests
defineExpose({ applySelectedTemplateDefaults });
</script>

<template>
    <div class="c-sliderCvTemplates">
        <div
            class="c-sliderCvTemplates__wrap"
            :class="{'c-sliderCvTemplates__profileCreate': profileCreate}"
        >
            <div
                v-if="templateSettings"
                class="c-sliderCvTemplates__showDesktop c-sliderCvTemplates__slider"
                data-qa="templates preview desktop"
            >
                <div
                    v-for="template in availableTemplateSettings"
                    :key="template.key"
                    data-qa="slide"
                >
                    <AppCvFilePreviewImage
                        v-show="template.key === templateSettings.template"
                        :settings="template"
                        :current-settings="templateSettings"
                        class="c-sliderCvTemplates__img"
                        data-qa="preview image"
                    />
                </div>
            </div>
            <Slider
                v-if="templateSettings"
                ref="carousel"
                :settings="sliderSettings"
                class="c-sliderCvTemplates__showMobile c-sliderCvTemplates__slider"
                data-qa="templates slider"
                @slide="updateCarousel"
            >
                <Slide
                    v-for="template in availableTemplateSettings"
                    :key="template.key"
                    data-qa="slide"
                >
                    <AppCvFilePreviewImage
                        :settings="template"
                        :current-settings="templateSettings"
                        class="c-sliderCvTemplates__img"
                        data-qa="preview image"
                    />
                </Slide>
                <template #hooper-addons>
                    <SliderArrowControl
                        :is-centered="true"
                        :next="slideNext"
                        :prev="slidePrev"
                        class="c-sliderCvTemplates__showMobile"
                        data-qa="slider controls"
                        @update="applySelectedTemplateDefaults({ key: 'template', value: slideIndex })"
                    />
                </template>
            </Slider>
            <div
                v-if="templateSettings"
                class="c-sliderCvTemplates__actions k-o-ladder"
            >
                <div class="c-sliderCvTemplates__settings">
                    <div class="c-sliderCvTemplates__rung k-o-ladder__rung">
                        <div
                            class="c-sliderCvTemplates__headline"
                            data-qa="template label"
                        >
                            <span class="k-c-headline-m u-bold">
                                Vorlage:
                            </span>
                            {{ getSelectedLabel({ key: 'template', value: templateSettings.key }) }}
                            <div
                                class="c-sliderCvTemplates__meta c-sliderCvTemplates__showMobile"
                                data-qa="pagination counter"
                            >
                                {{ slideIndex + 1 }} von 3
                            </div>
                        </div>
                        <ul
                            class="k-o-chain c-sliderCvTemplates__thumbnailList"
                            data-qa="thumbnail list"
                        >
                            <!-- eslint-disable-next-line max-len -->
                            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/mouse-events-have-key-events -->
                            <li
                                v-for="template in availableTemplateSettings"
                                :key="template.key"
                                class="c-sliderCvTemplates__thumbnailListItem"
                                data-qa="thumbnail item"
                                @click="setTemplateSettingsOnClick({key: 'template', value: template.key })"
                                @touchstart="setTemplateSettingsOnClick({key: 'template', value: template.key })"
                                @mouseenter="setTemplateSettingsOnHover({key: 'template', value: template.key })"
                                @mouseleave="resetHoverSettings"
                            >
                                <AppCvFilePreviewImage
                                    :settings="template"
                                    :is-thumbnail="true"
                                    class="c-sliderCvTemplates__thumbnail"
                                    :class="{'is-active': template.key === templateSettings.template
                                        || (settingsCache !== null && template.key === settingsCache.template)}"
                                />
                            </li>
                        </ul>
                    </div>
                    <div
                        class="c-sliderCvTemplates__selectionArea"
                        data-qa="color options"
                    >
                        <div data-qa="color label">
                            <span class="k-c-headline-m u-bold">
                                Farbe:
                            </span>
                            {{ getSelectedLabel({ key: 'colors', value: templateSettings.color }) }}
                        </div>
                        <ul class="k-o-chain c-sliderCvTemplates__options">
                            <!-- eslint-disable-next-line max-len -->
                            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/mouse-events-have-key-events -->
                            <li
                                v-for="color in availableColors"
                                :key="color.id"
                                class="c-sliderCvTemplates__pillList"
                                data-qa="pill"
                                @click="setTemplateSettingsOnClick({ key: 'color', value: color.id })"
                                @mouseenter="setTemplateSettingsOnHover({ key: 'color', value: color.id })"
                                @mouseleave="resetHoverSettings"
                                @touchend="resetHoverSettings"
                            >
                                <AppPill
                                    outline
                                    :label="color.label"
                                    :color="color.hex"
                                    :status="getAppPillStatus({ key: 'color', value: color.id })"
                                >
                                    <template #icon>
                                        <span
                                            :style="`background-color: ${color.hex}`"
                                            class="c-sliderCvTemplates__colorDot"
                                        />
                                    </template>
                                </AppPill>
                            </li>
                        </ul>
                    </div>
                    <div
                        class="c-sliderCvTemplates__selectionArea"
                        data-qa="font options"
                    >
                        <div data-qa="font label">
                            <span class="k-c-headline-m u-bold">
                                Schriftart:
                            </span>
                            {{ getSelectedLabel({ key: 'fonts', value: templateSettings.font }) }}
                        </div>
                        <ul class="k-o-chain c-sliderCvTemplates__options">
                            <!-- eslint-disable-next-line max-len -->
                            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/mouse-events-have-key-events -->
                            <li
                                class="c-sliderCvTemplates__pillList"
                                data-qa="pill"
                                @click="setTemplateSettingsOnClick({ key: 'font', value: 'not-not' })"
                                @mouseenter="setTemplateSettingsOnHover({ key: 'font', value: 'not-not' })"
                                @mouseleave="resetHoverSettings"
                                @touchend="resetHoverSettings"
                            >
                                <AppPill
                                    outline
                                    :status="getAppPillStatus({ key: 'font', value: 'not-not' })"
                                >
                                    <template #illustration>
                                        <IllustrationTemplateFontSimple/>
                                    </template>
                                </AppPill>
                            </li>
                            <!-- eslint-disable-next-line max-len -->
                            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/mouse-events-have-key-events -->
                            <li
                                class="c-sliderCvTemplates__pillList"
                                data-qa="pill"
                                @click="setTemplateSettingsOnClick({ key: 'font', value: 'lor-pts' })"
                                @mouseenter="setTemplateSettingsOnHover({ key: 'font', value: 'lor-pts' })"
                                @mouseleave="resetHoverSettings"
                                @touchend="resetHoverSettings"
                            >
                                <AppPill
                                    outline
                                    :status="getAppPillStatus({ key: 'font', value: 'lor-pts' })"
                                >
                                    <template #illustration>
                                        <IllustrationTemplateFontElegant/>
                                    </template>
                                </AppPill>
                            </li>
                        </ul>
                    </div>
                    <div
                        v-if="!profileCreate && workExperienceCount > 0 && educationCount > 0"
                        class="c-sliderCvTemplates__selectionArea"
                        data-qa="order options"
                    >
                        <div data-qa="order label">
                            <div class="k-c-headline-m u-bold">
                                Reihenfolge
                            </div>
                            <div class="c-sliderCvTemplates__orderDescription">
                                Die Berufserfahrung wird normalerweise vor der Ausbildung
                                angezeigt. Für den Berufseinstieg empfiehlt es sich aber, den
                                Fokus auf die Ausbildung zu legen.
                            </div>
                        </div>
                        <AppToggle
                            v-model="educationFirst"
                            class="c-sliderCvTemplates__orderToggle"
                            @input="setTemplateSettingsOnClick({
                                key: 'educationFirst', value: educationFirst
                            })"
                        >
                            Ausbildung vorreihen
                        </AppToggle>
                    </div>
                </div>
                <AppButton
                    v-if="profileCreate"
                    class="c-sliderCvTemplates__next"
                    data-qa="save button"
                    @click="next();logCvTemplate();"
                >
                    nächster Schritt
                </AppButton>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/dependencies/hooper';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/layout';
@import '~@karriereat/global-styles/scss/components/input/settings';

// 1. IE 11 overflow fix.
// 2. Hooper slider needs a max width to be rendered correctly.
.c-sliderCvTemplates {
    $width-slider: 50%; // 2.

    max-width: 100%; // 1.
    width: 100%;

    &__wrap {
        @include wrap(math.div(10, 12));

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;

        @media (min-width: $k-breakpoint--m) {
            flex-direction: row;
        }
    }

    &__profileCreate {
        margin-top: $k-spacing--3xl;
        margin-bottom: $k-spacing--5xl;

        @media (min-width: $k-breakpoint--m) {
            margin-top: $k-spacing--4xl;
        }
    }

    &__slider {
        flex-wrap: nowrap;
        padding-bottom: $k-spacing--m;
        max-width: none;
        height: auto;

        @media (min-width: $k-breakpoint--m) {
            @include wrap(math.div(5, 12));

            margin-left: $k-spacing--2xl;
            width: $width-slider;
        }

        @media (orientation: portrait) {
            margin-left: 0;
        }
    }

    &__actions {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        @media (min-width: $k-breakpoint--m) {
            width: $width-slider;
        }
    }

    &__next {
        align-self: flex-end;
        margin-top: $k-spacing--2xl;
        width: 100%;

        @media (min-width: $k-breakpoint--m) {
            margin: 0;
            width: auto;
        }
    }

    &__img {
        display: flex;
        margin: auto;
        width: 75%;
        border: 1px solid $k-color-gray--200;
        border-radius: $k-border-radius--s;

        @media (min-width: $k-breakpoint--m) {
            width: 90%;
        }
    }

    &__meta {
        color: $k-color-gray--400;
    }

    &__showMobile {
        display: flex;
        justify-content: center;

        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__showDesktop {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
        }
    }

    &__headline {
        padding-bottom: $k-spacing--xl;
        border-bottom: 1px solid $k-color-gray--200;
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            border-bottom: none;
            text-align: left;
        }
    }

    &__thumbnailList {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
            flex-wrap: nowrap;
            margin-top: -$k-spacing--m;
        }
    }

    &__thumbnailListItem {
        &:not(:last-child) {
            padding-right: $k-spacing--s;
        }
    }

    &__thumbnail {
        width: 100%;
        border: 1px solid $k-color-gray--200;
        border-radius: $k-border-radius--s;
        cursor: pointer;
        transition: border-color, color;
        transition-duration: 0.2s;

        &.is-active {
            border: 1px solid $k-color-active;
        }
    }

    &__pillList {
        margin-top: $k-spacing--s;
        margin-right: $k-spacing--xs;
    }

    &__selectionArea {
        margin-top: $k-spacing--xl;
    }

    &__orderDescription,
    &__orderToggle {
        margin-top: $k-spacing--s;
        margin-bottom: $k-spacing--l;
    }

    &__colorDot {
        margin-right: $k-spacing--xs;
        margin-bottom: $k-spacing--2xs;
        width: $k-spacing--l;
        height: $k-spacing--l;
        border-radius: 100%;
    }
}
</style>
