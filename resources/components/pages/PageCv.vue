<script setup>
import {
    nextTick,
    onMounted,
    inject, ref, onBeforeMount, onBeforeUnmount,
} from 'vue';

import {
    isEmbedded,
} from '../../utils/frame-check';

import mitt from '../../utils/mitt';
import {
    PROFILE_ACTIVATION_CONSENT,
} from '../../services/gdpr';
import scrollToElement from '../../utils/scroll-to-element';
import {
    FORMS,
} from '../../utils/form-settings';

import CardCvAction from '../organisms/card/cv/CardCvAction';
import CardCvAward from '../organisms/card/cv/CardCvAward';
import CardCvDesiredJob from '../organisms/card/cv/CardCvDesiredJob';
import CardCvDocuments from '../organisms/card/cv/CardCvDocuments';
import CardCvEducation from '../organisms/card/cv/CardCvEducation';
import CardCvInterests from '../organisms/card/cv/CardCvInterests';
import CardCvLanguage from '../organisms/card/cv/CardCvLanguage';
import CardCvPersonalData from '../organisms/card/cv/CardCvPersonalData';
import CardCvProfileText from '../organisms/card/cv/CardCvProfileText';
import CardCvProjects from '../organisms/card/cv/CardCvProjects';
import CardCvSoftSkills from '../organisms/card/cv/CardCvSoftSkills';
import CardCvSkills from '../organisms/card/cv/CardCvSkills';
import CardCvStatement from '../organisms/card/cv/CardCvStatement';
import CardCvTraining from '../organisms/card/cv/CardCvTraining';
import CardCvWorkExperience from '../organisms/card/cv/CardCvWorkExperience';
import LayoutDefault from '../layouts/LayoutDefault';
import MinitasksContainer from '../organisms/minitask/MinitasksContainer';
import AppInfoBox from '../molecules/app/AppInfoBox';
import AppLink from '../atoms/app/AppLink';
import SvgLightBulb from '../atoms/svg/SvgLightBulb';
import ProviderConsent from '../providers/ProviderConsent';

import '../../directives/debounce-click';
import {
    useActions, useMutations, useState,
} from '../../composables/vuex-helpers';
import {
    useTimeGatedElement,
} from '../../composables/time-gated-element';
import {
    travelReadinessInfoBox,
} from '../../data/time-gated-elements';

const MIN_COMPLETENESS = 50;

const router = inject('router');

const {
    active: isVisible,
    completeness,
    anyFormDirty,
} = useState('profile');

const {
    UPDATE_ACTIVE_STATUS: updateVisibility,
} = useActions('profile');

const {
    SET_FORM_DIRTY: setFormDirty,
    SET_FORM_ACTIVE: setFormActive,
    SET_NEW_FORM_ACTIVE: setNewFormActive,
    TRIGGER_CANCEL: triggerCancel,
} = useMutations('profile');

const handleAcceptedConsent = (consentType) => {
    if (completeness.value >= MIN_COMPLETENESS && consentType === PROFILE_ACTIVATION_CONSENT) {
        updateVisibility(true);
    }
};

const resetEditState = () => {
    setFormActive(null);
    setFormDirty(false);
    setNewFormActive(false);
};

const cards = ref({
    [FORMS.work.id]: ref(null),
    [FORMS.education.id]: ref(null),
    [FORMS.skills.id]: ref(null),
    [FORMS.training.id]: ref(null),
    [FORMS.language.id]: ref(null),
    [FORMS.softSkills.id]: ref(null),
    [FORMS.interests.id]: ref(null),
    [FORMS.documents.id]: ref(null),
    [FORMS.desiredJob.id]: ref(null),
});

const openForm = async ({ id = null, hasNewForm = false }) => {
    setFormActive(id);
    setNewFormActive(hasNewForm);

    await nextTick();
    cards.value[id].$el.focus();
    scrollToElement(cards.value[id].$el);
};

const goToForm = ({ id = null, hasNewForm = false }) => {
    if (anyFormDirty.value) {
        triggerCancel(Date.now());
        return;
    }
    openForm({ id, hasNewForm });
};

const {
    elementShown,
    shouldShowElement,
} = useTimeGatedElement(travelReadinessInfoBox);

onMounted(() => {
    resetEditState();
    if (router.currentRoute.params?.formId) {
        const { formId, newForm } = router.currentRoute.params;
        openForm({ id: formId, hasNewForm: newForm });
    }
    if (router.currentRoute.query?.formId) {
        const { formId, hasNewForm = false } = router.currentRoute.query;
        openForm({ id: formId, hasNewForm: !!hasNewForm });
    }
});

onBeforeMount(() => {
    mitt.on('consent-accepted', handleAcceptedConsent);
});

onBeforeUnmount(() => {
    mitt.off('consent-accepted', handleAcceptedConsent);
});
</script>

<template>
    <LayoutDefault has-background-gray>
        <!-- eslint-disable vue/no-unused-vars -->
        <div class="c-pageCv">
            <ProviderConsent
                v-if="completeness >= MIN_COMPLETENESS"
                :type="PROFILE_ACTIVATION_CONSENT"
                :immediate="!!router.currentRoute.query['first-activation']"
            />
            <div class="c-pageCv__wrap">
                <AppInfoBox
                    v-if="shouldShowElement"
                    data-qa="travel readiness change info"
                    class="c-pageCv__travelReadinessInfoBox"
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
                        data-gtm-element="PR_L: Infobox"
                        data-gtm-element-detail="Review Travel Readiness"
                        tag="span"
                        neutral
                        underline
                        @click="goToForm(FORMS.desiredJob)"
                    >
                        Zum Wunschjob
                    </AppLink>
                </AppInfoBox>
            </div>
            <MinitasksContainer
                v-if="!isEmbedded()"
                class="c-pageCv__wrap"
                data-qa="minitask container"
                ga-prefix="PR_L"
                @add="goToForm"
            />
            <div class="c-pageCv__wrap u-clearfix">
                <div class="c-pageCv__layout">
                    <aside class="c-pageCv__sidebar k-o-ladder k-o-ladder--l">
                        <section class="c-pageCv__stickyCard">
                            <CardCvAction
                                class="k-o-ladder__rung"
                                data-qa="cv action box"
                                :is-visible="isVisible"
                                @complete="goToForm"
                            />
                        </section>
                    </aside>
                    <div class="c-pageCv__content k-o-ladder">
                        <CardCvDesiredJob
                            :ref="(el) => cards[FORMS.desiredJob.id] = el"
                            class="k-o-ladder__rung"
                        />
                        <CardCvPersonalData class="k-o-ladder__rung"/>
                        <div
                            class="k-o-ladder__rung"
                            data-qa="list view"
                        >
                            <CardCvWorkExperience
                                :ref="(el) => cards[FORMS.work.id] = el"
                                tabindex="-1"
                                class="k-o-ladder__rung"
                            />
                            <CardCvEducation
                                :ref="(el) => cards[FORMS.education.id] = el"
                                tabindex="-1"
                                class="k-o-ladder__rung"
                            />
                            <CardCvTraining
                                :ref="(el) => cards[FORMS.training.id] = el"
                                tabindex="-1"
                                class="k-o-ladder__rung"
                            />
                            <CardCvSkills
                                :ref="(el) => cards[FORMS.skills.id] = el"
                                tabindex="-1"
                                class="k-o-ladder__rung"
                            />
                            <CardCvLanguage
                                :ref="(el) => cards[FORMS.language.id] = el"
                                tabindex="-1"
                                class="k-o-ladder__rung"
                            />
                            <CardCvSoftSkills
                                :ref="(el) => cards[FORMS.softSkills.id] = el"
                                tabindex="-1"
                                class="k-o-ladder__rung"
                            />
                            <CardCvProjects class="k-o-ladder__rung"/>
                            <CardCvAward class="k-o-ladder__rung"/>
                            <CardCvInterests
                                :ref="(el) => cards[FORMS.interests.id] = el"
                                tabindex="-1"
                                class="k-o-ladder__rung"
                            />
                            <CardCvStatement class="k-o-ladder__rung"/>
                            <CardCvProfileText class="k-o-ladder__rung"/>
                            <CardCvDocuments
                                :ref="(el) => cards[FORMS.documents.id] = el"
                                tabindex="-1"
                                class="k-o-ladder__rung"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </LayoutDefault>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/border-radius';
@import '../../assets/scss/components/button';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/layout';
@import '~@karriereat/global-styles/scss/components/button';

.c-pageCv {
    padding-bottom: $k-spacing--5xl;

    &__wrap {
        @include wrap(math.div(10, 12));
    }

    &__layout {
        @include k-layout($k-spacing--l, $k-spacing--l);

        margin-top: $k-spacing--2xs;
    }

    &__sidebar {
        @include k-layout__item(auto, 19em);

        min-width: 0;
    }

    &__content {
        @include k-layout__item(max, 22em);

        min-width: 0;
    }

    &__stickyCard {
        position: sticky;
        top: $k-spacing--xl;
    }

    &__travelReadinessInfoBox {
        margin-top: $k-spacing--l;
    }
}
</style>
