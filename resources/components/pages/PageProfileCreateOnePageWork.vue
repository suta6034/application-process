<script setup>
/* istanbul ignore file */
import {
    ref, inject, watchEffect, onBeforeMount, onMounted, nextTick,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    CLEAR_NEW_ROWS,
} from '../../store/mutation-types';
import * as authService from '../../services/auth';

import {
    ERROR_CLASS,
    focusFirstStatus,
} from '../../utils/form-focus';
import {
    ACTIONS,
    CATEGORIES,
    LABELS,
    track,
} from '../../utils/tracking';

import AppButton from '../atoms/app/AppButton';
import AppIcon from '../atoms/app/AppIcon';
import AppLink from '../atoms/app/AppLink';
import AppTile from '../molecules/app/AppTile';
import FormElement from '../molecules/form/FormElement';
import FormFlag from '../atoms/form/FormFlag';
import FormMessage from '../atoms/form/FormMessage';
import FormProfileCreateDesiredJob from '../organisms/form/profile-create/FormProfileCreateDesiredJob';
import FormProfileCreateEducation from '../organisms/form/profile-create/FormProfileCreateEducation';
import FormProfileCreatePersonal from '../organisms/form/profile-create/FormProfileCreatePersonal';
import FormProfileCreateSkills from '../organisms/form/profile-create/FormProfileCreateSkills';
import FormProfileCreateWork from '../organisms/form/profile-create/FormProfileCreateWork';
import LayoutMinimal from '../layouts/LayoutMinimal';
import LayoutForm from '../layouts/LayoutForm';
import TextHeadline from '../atoms/text/TextHeadline';
import {
    isEmpty,
} from '../../utils/validators';
import {
    useFinish,
} from '../../composables/finish';
import {
    useActions, useMutations, useState,
} from '../../composables/vuex-helpers';

const {
    FETCH_PROFILE: fetchProfile,
} = useActions('profile');

const {
    SHOW_POPUP: showModal,
} = useMutations('popup');

const {
    SET_ORIGIN: setOrigin,
} = useMutations('profileCreate/origin');

const {
    finish,
} = useFinish();

// Form sections
const personalData = ref(null);
const experience = ref(null);
const education = ref(null);
const skills = ref(null);
const desiredJob = ref(null);

const root = ref(null);
const v$ = useVuelidate();

const showEducationForm = ref(false);
const showWorkExperienceForm = ref(false);
const loading = ref(false);

const {
    desiredJob: profileDesiredJob,
    exists: profileExists,
} = useState('profile');

const {
    userWithEmailExists,
} = useState('profileCreate');

const {
    rows: educations,
} = useState('profileCreate/education');

const {
    rows: work,
} = useState('profileCreate/work');

const router = inject('router');

onBeforeMount(async () => {
    if (!isEmpty(educations.value[0].name) && !isEmpty(educations.value[0].category)) showEducationForm.value = true;
    if (!isEmpty(work.value[0].title) && !isEmpty(work.value[0].company.label)) showWorkExperienceForm.value = true;
    if (await authService.isUserLoggedIn()) fetchProfile();
});

onMounted(() => {
    setOrigin('ONE_PAGER_WORK_MANUAL');

    track({
        category: CATEGORIES.page.profileCreate,
        action: ACTIONS.cvCreate,
        label: LABELS.evaluate,
    });
});

async function onValidationError() {
    // Show error messages for sub-components
    v$.value.$touch();

    // Gather tracking information
    const validationEvents = {
        'no-email': personalData.value.v$.email.required.$response,
        'no-firstname': personalData.value.v$.firstname.required.$response,
        'no-lastname': personalData.value.v$.surname.required.$response,
        'firstname-max-char-count': personalData.value.v$.firstname.maxLength.$response,
        'lastname-max-char-count': personalData.value.v$.surname.maxLength.$response,
        'no-date-of-birth': personalData.value.v$.birthdate.required.$response,
        'no-zip-code': personalData.value.v$.zip.required.$response,
        'no-town': personalData.value.v$.town.required.$response,
        'no-country': personalData.value.v$.country.required.$response,
        'no-education': !education.value.v$.$error,
        'no-skills': skills.value.v$.skills.required.$response,
        'too-few-skills': skills.value.v$.skills.minLength.$response,
        'no-desired-job': desiredJob.value?.v$.objective.required.$response ?? true,
        'no-desired-job-location': desiredJob.value?.v$.location.required.$response ?? true,
    };
    const errors = [];
    Object.keys(validationEvents).forEach((key) => {
        if (!validationEvents[key]) errors.push(key);
    });
    const elementDetail = errors.join(', ');
    track({
        element: 'PR_C: Submit - Error',
        elementDetail,
        ga4Event: true,
    });
    await nextTick();
    const firstErrorElement = root.value.$el.querySelector(ERROR_CLASS);
    focusFirstStatus(firstErrorElement);
}

function trackOnePage(label) {
    track({
        category: CATEGORIES.page.profileCreateOnePage,
        action: ACTIONS.clickWithName(label),
        label,
    });
}

function setEducationFormVisiblity() {
    showEducationForm.value = true;
    education.value.v$.$reset();
    trackOnePage('onepage-work-add-experience');
}

function setWorkExperienceFormVisibility() {
    showWorkExperienceForm.value = true;
    experience.value?.v$.$reset();
    trackOnePage('onepage-add-work');
}

function deleteWorkExperience() {
    showModal({
        componentName: 'ModalDeleteItem',
        ariaLabel: 'Element löschen',
        componentProps: {
            itemId: 0,
            mutation: `profileCreate/work/${CLEAR_NEW_ROWS}`,
            createMode: true,
            deleteCallBack: () => {
                showWorkExperienceForm.value = false;
                experience.value?.v$.$reset();
            },
        },
    });
    trackOnePage('onepage-work-delete-experience');
}

async function startCreateProfileProcess() {
    if (loading.value) return;

    // Reset sub component validation
    v$.value.$reset();

    // Mark work as submitted if it's dirty or valid
    if (experience.value && (experience.value.v$.$anyDirty || !experience.value.v$.$invalid)) {
        experience.value.submitted = true;
    }

    if (v$.value.$invalid) {
        onValidationError();
        return;
    }

    loading.value = true;
    await personalData.value.validateAndCheckUserByEmail();
    if (!await authService.isUserLoggedIn() && userWithEmailExists.value) {
        loading.value = false;
    } else {
        trackOnePage('onepage-work-btn-save-and-create');
        track({
            element: 'PR_C: Submit - Success',
            ga4Event: true,
        });
        finish();
    }
}

watchEffect(() => {
    if (profileExists.value) router.push({ name: 'page-cv' });
});
</script>

<template>
    <LayoutMinimal>
        <LayoutForm
            ref="root"
            class="c-pageProfileCreateOnePageWork"
        >
            <template #headline>
                Lebenslauf anlegen
            </template>
            <FormProfileCreatePersonal
                ref="personalData"
                data-qa="personal form"
            />
            <section>
                <div class="c-pageProfileCreateOnePageWork__workExperienceWrap">
                    <div class="c-pageProfileCreateOnePageWork__workExperienceHeader">
                        <TextHeadline
                            :level="3"
                            size="l"
                            class="c-pageProfileCreateOnePageWork__workExperienceHeadline"
                        >
                            Berufserfahrung&nbsp;
                            <FormFlag class="c-pageProfileCreateOnePageWork__formFlag">
                                optional
                            </FormFlag>
                        </TextHeadline>
                        <AppLink
                            v-if="showWorkExperienceForm"
                            tag="button"
                            class="k-c-headline-m"
                            @click="deleteWorkExperience"
                        >
                            Löschen
                        </AppLink>
                    </div>
                    <p class="c-pageProfileCreateOnePageWork__workExperienceInfo">
                        Füge zuerst deine aktuellste Berufserfahrung hinzu. Weitere Stationen kannst du später ergänzen.
                    </p>
                    <div
                        tabindex="0"
                        @click="setWorkExperienceFormVisibility"
                        @keydown="setWorkExperienceFormVisibility"
                    >
                        <FormElement v-show="!showWorkExperienceForm">
                            <AppTile
                                class="c-pageProfileCreateOnePageWork__emptyTile"
                                data-qa="work empty tile"
                            >
                                <AppIcon
                                    class="c-pageProfileCreateOnePageWork__icon"
                                    name="plus"
                                    size="2xl"
                                />
                                <span class="c-pageProfileCreateOnePageWork__subline">
                                    Berufserfahrung hinzufügen
                                </span>
                            </AppTile>
                        </FormElement>
                    </div>
                </div>
                <FormProfileCreateWork
                    v-if="showWorkExperienceForm"
                    ref="experience"
                    data-qa="work experience form"
                />
            </section>
            <section>
                <div class="c-pageProfileCreateOnePageWork__educationWrap">
                    <TextHeadline
                        :level="3"
                        size="l"
                        class="c-pageProfileCreateOnePageWork__educationHeadline"
                    >
                        Ausbildung
                    </TextHeadline>
                    <div
                        tabindex="0"
                        @click="setEducationFormVisiblity"
                        @keydown="setEducationFormVisiblity"
                    >
                        <FormElement v-show="!showEducationForm">
                            <AppTile
                                class="c-pageProfileCreateOnePageWork__emptyTile"
                                :error="education && education.v$.$error"
                                data-qa="education empty tile"
                            >
                                <AppIcon
                                    class="c-pageProfileCreateOnePageWork__icon"
                                    name="plus"
                                    size="2xl"
                                />
                                <span class="c-pageProfileCreateOnePageWork__subline">
                                    Ausbildung hinzufügen
                                </span>
                            </AppTile>
                            <template #end>
                                <FormMessage
                                    v-if="education && education.v$.$error"
                                    type="error"
                                >
                                    <li>
                                        Bitte gib deine höchste Ausbildung an.
                                    </li>
                                </FormMessage>
                            </template>
                        </FormElement>
                    </div>
                </div>
                <FormProfileCreateEducation
                    v-show="showEducationForm"
                    ref="education"
                    data-qa="education form"
                />
            </section>
            <FormProfileCreateSkills
                ref="skills"
                data-qa="skills form"
            />
            <FormProfileCreateDesiredJob
                v-if="profileDesiredJob.objectives.length <= 0"
                ref="desiredJob"
                data-qa="desired job form"
            />
            <template #actions>
                <div class="c-pageProfileCreateOnePageWork__actions">
                    <AppButton
                        width="full"
                        class="c-pageProfileCreateOnePageWork__button"
                        data-qa="save button"
                        :loading="loading"
                        @click="startCreateProfileProcess"
                    >
                        Speichern und abschließen
                    </AppButton>
                </div>
            </template>
        </LayoutForm>
    </LayoutMinimal>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/animations/fade-in';
@import '~@karriereat/global-styles/scss/settings/color';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/typo';

// 1. Padding need to be normalized because there is a FormLayout within a FormLayout,
// so the padding would be twice it's size
.c-pageProfileCreateOnePageWork {
    padding-top: $k-spacing--4xl;
    padding-right: 0; // 1.
    padding-left: 0; // 1.

    &__educationWrap,
    &__workExperienceWrap {
        @include wrap(math.div(5, 12));
    }

    &__educationHeadline {
        padding-bottom: $k-spacing--l;
    }

    &__workExperienceHeader {
        display: flex;
        justify-content: space-between;
        padding-bottom: $k-spacing--s;
    }

    &__workExperienceInfo {
        padding-bottom: $k-spacing--l;
        color: $k-color-gray--500;
    }

    &__emptyTile {
        display: flex;
        align-items: center;
        border-color: $k-color-gray--300;
        color: $k-color-primary--dark;

        &:hover,
        &:focus {
            border-color: $k-color-green--700;
            color: $k-color-primary--dark;
            cursor: pointer;
        }
    }

    &__subline {
        padding-left: $k-spacing--m;
    }

    &__formFlag {
        @include k-typo-s;
    }

    &__actions {
        @include wrap(math.div(5, 12));
    }

    &__button {
        @media (min-width: $k-breakpoint--m) {
            width: auto;
        }
    }
}
</style>
