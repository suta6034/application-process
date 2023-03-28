<script setup>
import {
    ref,
} from 'vue';

import AppButtonIconOnly from '../../../atoms/app/AppButtonIconOnly';
import AppPill from '../../../atoms/app/AppPill';
import FormCvDesiredJob from '../../form/cv/FormCvDesiredJob';
import TextHeadline from '../../../atoms/text/TextHeadline';

import {
    useCvPills,
} from '../../../../composables/cv-pills';
import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const MAX_ELEMENTS = 3;

const {
    preparePillsArray,
} = useCvPills();

const cardKey = 'DESIRED-JOB';
const element = ref(null);
const {
    resetEditAndScroll,
    openEdit,
    activeForm,
} = useCvCard({ cardKey, element });

const {
    employment,
    jobFields,
    locations,
    objectives,
} = useState('profile/desiredJob');

const joinArray = () => {
    const desiredJobData = [...objectives.value, ...locations.value, ...employment.value, ...jobFields.value];
    return preparePillsArray(desiredJobData, MAX_ELEMENTS);
};
</script>

<template>
    <div
        ref="element"
        class="c-cardCvDesiredJob k-c-card k-c-card--noBorder"
        data-qa="desired job card"
    >
        <div class="k-o-distributeSpace">
            <section>
                <TextHeadline
                    :level="2"
                    size="l"
                    class="_flexbox-min-width-fix"
                >
                    Dein Wunschjob
                </TextHeadline>
                <p class="c-cardCvDesiredJob__text">
                    Erhalte passendere Job-Angebote durch Angabe deines Wunschjobs.
                </p>
                <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                <div
                    v-if="activeForm !== cardKey"
                    data-qa="edit desired job"
                    data-gtm-element="PR_L: Desired Job"
                    data-gtm-element-detail="Edit"
                    @click="openEdit('profile-list-desired-job-edit')"
                >
                    <ul class="c-cardCvDesiredJob__pillList">
                        <li
                            v-for="pill in joinArray()"
                            :key="pill.id"
                            data-qa="pill list item"
                        >
                            <AppPill
                                :label="pill.label"
                                checked
                                class="c-cardCvDesiredJob__pill"
                                :data-qa="pill.qa"
                            />
                        </li>
                    </ul>
                </div>
            </section>
            <AppButtonIconOnly
                v-if="activeForm !== cardKey"
                size="xl"
                icon="pen"
                aria-label="Bearbeiten"
                class="c-cardCvDesiredJob__action"
                data-qa="edit desired job"
                data-gtm-element="PR_L: Desired Job"
                data-gtm-element-detail="Edit"
                @click.native="openEdit('profile-list-desired-job-edit')"
            />
        </div>
        <FormCvDesiredJob
            v-if="activeForm === cardKey"
            class="c-cardCvDesiredJob__form"
            data-qa="edit form"
            @closeEdit="resetEditAndScroll"
        />
    </div>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/breakpoint';
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

// 1 Overflow must be visible to prevent layout shifts by home office + travel readiness dropdowns
.c-cardCvDesiredJob {
    overflow: visible; // 1
    padding: $k-spacing--l $k-spacing--l $k-spacing--xl;

    &__text {
        margin-top: $k-spacing--xs;
        color: $k-color-gray--600;
    }

    &__pillList {
        display: flex;
        flex-wrap: wrap;
        margin-top: $k-spacing--xs;
    }

    &__pill {
        margin-top: $k-spacing--s;
        margin-right: $k-spacing--xs;
    }

    &__form {
        margin-top: $k-spacing--xl;
        margin-bottom: $k-spacing--xl;
    }

    &__action {
        align-self: flex-start;
    }
}
</style>
