<script setup>
import {
    computed, onBeforeMount,
    ref,
    inject,
} from 'vue';

import {
    ACTIONS,
    track,
} from '../../../utils/tracking';

import * as authService from '../../../services/auth';

import MinitaskDesiredJobTravelReadiness from './MinitaskDesiredJobTravelReadiness';
import MinitaskDesiredJobWorkFromHome from './MinitaskDesiredJobWorkFromHome';
import MinitaskAddress from './MinitaskAddress';
import MinitaskBirthdate from './MinitaskBirthdate';
import MinitaskDesiredJobEmploymentType from './MinitaskDesiredJobEmploymentType';
import MinitaskDesiredJobJobfield from './MinitaskDesiredJobJobfield';
import MinitaskImage from './MinitaskImage';
import MinitaskLanguage from './MinitaskLanguage';
import MinitaskJobTitle from './MinitaskJobTitle';
import MinitaskJobField from './MinitaskJobField';
import MinitaskSoftSkills from './MinitaskSoftSkills';
import MinitaskSuccess from './MinitaskSuccess';
import MinitaskTelephone from './MinitaskTelephone';
import MinitaskVisibility from './MinitaskVisibility';
import MinitaskWork from './MinitaskWork';
import {
    useSoftSkills,
} from '../../../composables/resource-soft-skills';
import {
    useActions, useGetters, useState,
} from '../../../composables/vuex-helpers';

defineProps({
    gaPrefix: {
        type: String,
    },
});

const { hasEmptySoftSkillGroups } = useSoftSkills();
const isFetching = ref(true);

const {
    addressDisplayStatus,
    birthdateDisplayStatus,
    desiredJobEmploymentTypeDisplayStatus,
    desiredJobJobfieldDisplayStatus,
    imageDisplayStatus,
    languageDisplayStatus,
    jobTitleDisplayStatus,
    jobFieldDisplayStatus,
    desiredJobTravelReadinessDisplayStatus,
    desiredJobWorkFromHomeDisplayStatus,
    successDisplayStatus,
    telephoneDisplayStatus,
    visibilityDisplayStatus,
    workDisplayStatus,
    softSkillsSkippedStatus,
} = useGetters('minitask');

const {
    exists: profileExists,
} = useState('profile');

const {
    rows: workExperiences,
} = useState('profile/work');

const storedWorkExperiences = computed(() => workExperiences.value.filter(x => x.id));

const currentWorkExperienceWithoutTitle = computed(() => {
    const matchCounter = storedWorkExperiences.value.filter(x => !x.title).length;
    let workExperienceWithoutTitle;

    for (let i = 0; i < matchCounter; i += 1) {
        workExperienceWithoutTitle = storedWorkExperiences.value.filter(x => !x.title)[i] ?? {};

        if (workExperienceWithoutTitle?.category.id === 1) return workExperienceWithoutTitle;
    }

    return null;
});

const currentWorkExperienceWithoutField = computed(() => {
    const matchCounter = storedWorkExperiences.value.filter(x => !x.jobfield.id).length;
    let workExperienceWithoutField;

    for (let i = 0; i < matchCounter; i += 1) {
        workExperienceWithoutField = storedWorkExperiences.value.filter(x => !x.jobfield.id)[i] ?? {};

        if (workExperienceWithoutField?.category.id === 1) return workExperienceWithoutField;
    }

    return null;
});

const {
    FETCH_MINITASKS: fetchMinitasks,
    SET_MINITASK_ADDRESS_SKIPPED: setMinitaskAddressSkipped,
    SET_MINITASK_BIRTHDATE_SKIPPED: setMinitaskBirthdateSkipped,
    SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED: setMinitaskDesiredJobEmploymentTypSkipped,
    SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED: setMinitaskDesiredJobJobfieldSkipped,
    SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED: setMinitaskDesiredJobTravelReadinessSkipped,
    SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED: setMinitaskDesiredJobWorkFromHomeSkipped,
    SET_MINITASK_IMAGE_SKIPPED: setMinitaskImageSkipped,
    SET_MINITASK_LANGUAGE_SKIPPED: setMinitaskLanguageSkipped,
    SET_MINITASK_JOBTITLE_SKIPPED: setMinitaskJobTitleSkipped,
    SET_MINITASK_JOBFIELD_SKIPPED: setMinitaskJobFieldSkipped,
    SET_MINITASK_SOFT_SKILLS_SKIPPED: setMinitaskSoftSkillsSkipped,
    SET_MINITASK_SUCCESS_STATUS: setMinitaskSuccessStatus,
    SET_MINITASK_SUCCESS_HIDE: setMinitaskSuccessHide,
    SET_MINITASK_TELEPHONE_SKIPPED: setMinitaskTelephoneSkipped,
    SET_MINITASK_VISIBILITY_SKIPPED: setMinitaskVisibilitySkipped,
    SET_MINITASK_WORK_SKIPPED: setMinitaskWorkSkipped,
} = useActions('minitask');

const router = inject('router');
function showTrack(actionName) {
    track({
        category: router.currentRoute.meta?.trackingCategory,
        action: ACTIONS.showWithName(actionName),
    });

    return true;
}

onBeforeMount(async () => {
    const userUuid = await authService.getUuid();
    fetchMinitasks({ uuid: userUuid, callback: () => { isFetching.value = false; } });
});

// Expose for unit tests
defineExpose({ successDisplayStatus, isFetching, hasEmptySoftSkillGroups, jobFieldDisplayStatus });
</script>

<template>
    <div
        v-if="profileExists"
    >
        <MinitaskDesiredJobTravelReadiness
            v-if="desiredJobTravelReadinessDisplayStatus && !isFetching && showTrack('minitask-travel-readiness')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Travel Readiness' : undefined
            }"
            data-qa="travel readiness minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskDesiredJobTravelReadinessSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskDesiredJobWorkFromHome
            v-else-if="desiredJobWorkFromHomeDisplayStatus && !isFetching && showTrack('minitask-homeoffice')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Homeoffice' : undefined
            }"
            data-qa="work from home minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskDesiredJobWorkFromHomeSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskImage
            v-else-if="imageDisplayStatus && !isFetching && showTrack('minitask-picture-upload')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Profile Photo' : undefined
            }"
            data-qa="image minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskImageSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskBirthdate
            v-else-if="birthdateDisplayStatus && !isFetching && showTrack('minitask-birthday-date')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Birthday' : undefined
            }"
            data-qa="birthdate minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskBirthdateSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskTelephone
            v-else-if="telephoneDisplayStatus && !isFetching && showTrack('minitask-phonenumber')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Phone Number' : undefined
            }"
            data-qa="telephone minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskTelephoneSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskAddress
            v-else-if="addressDisplayStatus && !isFetching && showTrack('minitask-address')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Address' : undefined
            }"
            data-qa="address minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskAddressSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskDesiredJobEmploymentType
            v-else-if="desiredJobEmploymentTypeDisplayStatus && !isFetching
                && showTrack('minitask-desiredjob-employmenttype')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Desired Job Employment Type' : undefined
            }"
            data-qa="desired job employment minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskDesiredJobEmploymentTypSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskDesiredJobJobfield
            v-else-if="desiredJobJobfieldDisplayStatus && !isFetching
                && showTrack('minitask-desiredjob-field')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Desired Job Field' : undefined
            }"
            data-qa="desired job jobfield minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskDesiredJobJobfieldSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskSoftSkills
            v-else-if="hasEmptySoftSkillGroups && softSkillsSkippedStatus
                && !isFetching && showTrack('minitask-soft-skills')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Soft Skills' : undefined
            }"
            data-qa="soft skills minitask"
            :ga-prefix="gaPrefix"
            @add="$emit('add', $event)"
            @skipped="setMinitaskSoftSkillsSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskLanguage
            v-else-if="languageDisplayStatus && !isFetching && showTrack('minitask-language')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Language' : undefined
            }"
            data-qa="language minitask"
            :ga-prefix="gaPrefix"
            @add="$emit('add', $event)"
            @skipped="setMinitaskLanguageSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskWork
            v-else-if="workDisplayStatus && !isFetching && showTrack('minitask-experience')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Experience' : undefined
            }"
            data-qa="work minitask"
            :ga-prefix="gaPrefix"
            @add="$emit('add', $event)"
            @skipped="setMinitaskWorkSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskJobTitle
            v-else-if="currentWorkExperienceWithoutTitle && jobTitleDisplayStatus
                && !isFetching && showTrack('minitask-employer-position')"
            :id="currentWorkExperienceWithoutTitle.id"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Employer Position' : undefined
            }"
            data-qa="job title minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskJobTitleSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskJobField
            v-else-if="currentWorkExperienceWithoutField && jobFieldDisplayStatus
                && !isFetching && showTrack('minitask-employer-field')"
            :id="currentWorkExperienceWithoutField.id"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Employer Field' : undefined
            }"
            data-qa="job field minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskJobFieldSkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskVisibility
            v-else-if="visibilityDisplayStatus && !isFetching && showTrack('minitask-profile-active')"
            v-track-visibility="{
                element: gaPrefix ? `${gaPrefix}: Minitask` : undefined,
                elementDetail: gaPrefix ? 'Activate Profile' : undefined
            }"
            data-qa="visibility minitask"
            :ga-prefix="gaPrefix"
            @skipped="setMinitaskVisibilitySkipped"
            @updated="setMinitaskSuccessStatus"
        />
        <MinitaskSuccess
            v-else-if="successDisplayStatus"
            data-qa="success minitask"
            @hide="setMinitaskSuccessHide"
        />
    </div>
</template>
