<script setup>
import {
    computed,
} from 'vue';
import {
    FORMS,
} from '../../../utils/form-settings';

import AppCollapsible from './AppCollapsible';
import AppIcon from '../../atoms/app/AppIcon';
import ProgressBar from '../../atoms/progress/ProgressBar';
import {
    useSoftSkills,
} from '../../../composables/resource-soft-skills';
import {
    useImageEditor,
} from '../../../composables/image-editor';
import {
    useGetters, useState,
} from '../../../composables/vuex-helpers';

const formSettings = FORMS;
const { hasEmptySoftSkillGroups } = useSoftSkills();
const { showImageEditor, acceptedImageFormats } = useImageEditor();

const {
    completeness,
    hasWorkExperience,
    image: hasImage,
} = useState('profile');

const { count: educationCount } = useGetters('profile/education');
const { count: languageCount } = useGetters('profile/language');
const { count: skillCount } = useGetters('profile/skill');
const { count: trainingCount } = useGetters('profile/training');
const { count: workExperienceCount } = useGetters('profile/work');

const isComplete = computed(() => completeness.value === 100);
const emit = defineEmits(['complete']);
</script>

<template>
    <div
        class="c-appCvCompleteness"
        data-qa="completeness area"
    >
        <AppCollapsible :is-expandable="completeness !== 100">
            <template #label>
                <Component
                    :is="isComplete ? 'router-link' : 'div'"
                    :to="isComplete && { name: 'page-cv' }"
                    class="c-appCvCompleteness__labelWrapper"
                >
                    <ProgressBar :value="completeness"/>
                    <span
                        class="c-appCvCompleteness__label"
                        data-qa="completeness label"
                    >
                        {{ completeness }}%
                    </span>
                </Component>
            </template>
            <template
                v-if="completeness !== 100"
                #content
            >
                <ul
                    class="c-appCvCompleteness__list"
                    data-qa="completeness body"
                >
                    <li
                        v-if="skillCount < 3"
                        class="c-appCvCompleteness__listItem"
                    >
                        <button
                            class="c-appCvCompleteness__linkBody"
                            data-qa="skill link"
                            @click="emit('complete', formSettings.skills)"
                        >
                            <span>Kenntnisse +15%</span>
                            <div class="c-appCvCompleteness__listIcon">
                                <AppIcon
                                    name="plus-circle"
                                    size="l"
                                />
                            </div>
                        </button>
                    </li>
                    <li
                        v-if="hasWorkExperience && workExperienceCount <= 0"
                        class="c-appCvCompleteness__listItem"
                    >
                        <button
                            class="c-appCvCompleteness__linkBody"
                            data-qa="work experience link"
                            @click="emit('complete', formSettings.work)"
                        >
                            Berufserfahrung +15%
                            <div class="c-appCvCompleteness__listIcon">
                                <AppIcon
                                    name="plus-circle"
                                    size="l"
                                />
                            </div>
                        </button>
                    </li>
                    <li
                        v-if="educationCount <= 0"
                        class="c-appCvCompleteness__listItem"
                    >
                        <button
                            class="c-appCvCompleteness__linkBody"
                            data-qa="education link"
                            @click="emit('complete', formSettings.education)"
                        >
                            Ausbildung +15%
                            <div class="c-appCvCompleteness__listIcon">
                                <AppIcon
                                    name="plus-circle"
                                    size="l"
                                />
                            </div>
                        </button>
                    </li>
                    <li
                        v-if="trainingCount === 0"
                        class="c-appCvCompleteness__listItem"
                    >
                        <button
                            class="c-appCvCompleteness__linkBody"
                            data-qa="training link"
                            @click="emit('complete', formSettings.training)"
                        >
                            Weiterbildung +5%
                            <div class="c-appCvCompleteness__listIcon">
                                <AppIcon
                                    name="plus-circle"
                                    size="l"
                                />
                            </div>
                        </button>
                    </li>
                    <li
                        v-if="languageCount === 0"
                        class="c-appCvCompleteness__listItem"
                    >
                        <button
                            class="c-appCvCompleteness__linkBody"
                            data-qa="language link"
                            @click="emit('complete', formSettings.language)"
                        >
                            Sprachen +10%
                            <div class="c-appCvCompleteness__listIcon">
                                <AppIcon
                                    name="plus-circle"
                                    size="l"
                                />
                            </div>
                        </button>
                    </li>
                    <li
                        v-if="hasEmptySoftSkillGroups"
                        class="c-appCvCompleteness__listItem"
                    >
                        <button
                            class="c-appCvCompleteness__linkBody"
                            data-qa="soft-skills link"
                            @click="emit('complete', formSettings.softSkills)"
                        >
                            Soft Skills und Werte +15%
                            <div class="c-appCvCompleteness__listIcon">
                                <AppIcon
                                    name="plus-circle"
                                    size="l"
                                />
                            </div>
                        </button>
                    </li>
                    <li
                        v-if="!hasImage[0]"
                        class="c-appCvCompleteness__listItem"
                    >
                        <label
                            for="image"
                            class="c-appCvCompleteness__linkBody k-outline-if-focus-within"
                            data-qa="personal data link"
                        >
                            Foto +5%
                            <input
                                id="image"
                                :accept="acceptedImageFormats"
                                class="u-screen-reader-only"
                                type="file"
                                data-qa="image input"
                                @change="showImageEditor"
                            >
                            <div class="c-appCvCompleteness__listIcon">
                                <AppIcon
                                    name="plus-circle"
                                    size="l"
                                />
                            </div>
                        </label>
                    </li>
                </ul>
            </template>
        </AppCollapsible>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/settings/border-radius';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-appCvCompleteness {
    @include k-typo-m;

    padding: $k-spacing--m;
    background-color: $k-color-gray--200;

    &__labelWrapper {
        display: flex;
        align-items: center;
        padding: $k-spacing--xs 0;
        width: 100%;
        border: none;
        background: transparent;
        cursor: pointer;
        font-variant-numeric: lining-nums;
    }

    &__label {
        @include k-typo-s;

        margin-left: $k-spacing--s;
        color: $k-color-gray--500;
    }

    &__list {
        margin-top: $k-spacing--l;
        list-style: none;
    }

    &__listItem {
        margin-bottom: $k-spacing--s;
    }

    &__linkBody {
        display: flex;
        justify-content: space-between;
        padding: 0;
        width: 100%;
        border: none;
        background: transparent;
        color: $k-color-gray--600;
        cursor: pointer;
        font-variant-numeric: lining-nums;
    }

    &__listIcon {
        position: relative;
        color: $k-color-brand;

        &::before {
            position: absolute;
            top: 20%;
            left: 10%;
            width: 80%;
            height: 70%;
            border-radius: 50%;
            background-color: $k-color-white;
            content: '';
        }
    }
}
</style>
