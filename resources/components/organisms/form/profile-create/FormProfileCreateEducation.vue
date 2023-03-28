<script setup>
import {
    computed, onBeforeMount, ref, watch,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    required,
    requiredIf,
} from '@vuelidate/validators';

import {
    EDUCATION_CATEGORY_APPRENTICE,
    EDUCATION_TYPE_OTHER,
} from '../../../../services/education';
import {
    dateRange,
    isoDate,
    maxDate,
    minDate,
    validateIf,
} from '../../../../utils/validators';

import FormCheckbox from '../../../atoms/form/FormCheckbox';
import FormDateInput from '../../../molecules/form/FormDateInput';
import FormElement from '../../../molecules/form/FormElement';
import FormInput from '../../../atoms/form/FormInput';
import FormLabel from '../../../atoms/form/FormLabel';
import FormMessage from '../../../atoms/form/FormMessage';
import FormPillSelect from '../../../molecules/form/FormPillSelect';
import FormSection from '../../../molecules/form/FormSection';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/validation';
import {
    useActions, useComputedObjectProperties, useMutations, useState,
} from '../../../../composables/vuex-helpers';

const MIN_EDUCATION_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 65));

const {
    educationCategories,
    educationTypes,
} = useState('profileCreate');

const {
    rows: educations,
} = useState('profileCreate/education');

const {
    updateField,
} = useMutations('profileCreate/education');

const education = computed(() => educations.value[0]);

const {
    completed,
    type,
    customType,
    category,
    trainingCompany,
    focus,
    start,
    end,
    name,
    submitted,
} = useComputedObjectProperties({
    updateField,
    object: education,
});

const educationTypesByActiveEducationCategory = computed(() => educationTypes.value
    .filter(educationType => educationType.parentId === education.value.category.id));

const educationTypeOtherSelected = computed(() => education.value.type.id === EDUCATION_TYPE_OTHER);
const isApprentice = computed(() => education.value.category.id === EDUCATION_CATEGORY_APPRENTICE);

const {
    fetchEducationCategories,
    fetchEducationTypes,
} = useActions('profileCreate');

const educationEnd = ref(null);
function focusEducationEnd(e) {
    if (e.target.nextSibling || e.target.value.length < 4) return;

    setTimeout(() => {
        educationEnd.value.$el.querySelector('input').focus();
    }, 0);
}

// Not tested because testing this is (almost) impossible.
const validations = () => {
    const rules = {
        category: {
            required,
        },
        type: {
            required,
        },
        customType: {
            required: requiredIf(/* istanbul ignore next */() => educationTypeOtherSelected.value),
        },
        trainingCompany: {
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            required: requiredIf(/* istanbul ignore next */() => isApprentice.value),
        },
        name: {
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            required: requiredIf(/* istanbul ignore next */() => !isApprentice.value),
        },
        focus: {
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            required: requiredIf(/* istanbul ignore next */() => isApprentice.value),
        },
        start: {
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            isoDate: isoDate(true, true, false),
            required,
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            minDate: minDate(MIN_EDUCATION_DATE),
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            maxDate: maxDate(new Date()),
        },
        end: {
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            isoDate: isoDate(true, true, false),
            required: requiredIf(/* istanbul ignore next: */completed),
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            minDate: minDate(MIN_EDUCATION_DATE),
            /* istanbul ignore next: Hard to test – tested in acceptance tests. */
            maxDate: validateIf(completed, maxDate(new Date())),
            dateRange: validateIf(start, dateRange(start, end)),

        },
        $validationGroups: {
            categorySection: ['education.category'],
            typeSection: ['education.type'],
            nameSection: ['education.name'],
            durationSection: ['education.start'],
        },
    };

    if (educationTypeOtherSelected.value) {
        rules.$validationGroups.customTypeSection = ['education.customType'];
    }

    return rules;
};

const v$ = useVuelidate(validations(), {
    category, type, customType, trainingCompany, name, focus, start, end,
});

watch(educationTypeOtherSelected, () => {
    if (!educationTypeOtherSelected.value) {
        education.value.customType = '';
        v$.value.customType.$reset();
    }
});

watch(isApprentice, () => {
    if (isApprentice.value) {
        name.value = '';
        v$.value.name.$reset();
    } else {
        trainingCompany.value = '';
        v$.value.trainingCompany.$reset();
    }
});

onBeforeMount(() => {
    fetchEducationCategories();
    fetchEducationTypes();
    submitted.value = true;
});

// Expose for parent + unit tests
defineExpose({ v$, educationTypesByActiveEducationCategory, educationTypeOtherSelected });
</script>

<template>
    <LayoutForm
        class="c-formProfileCreateEducation"
        :full-page="false"
    >
        <FormSection
            data-qa="education category section"
        >
            <template #headline>
                <span v-if="true">
                    Was ist deine höchste Ausbildung?
                </span>
            </template>
            <FormElement>
                <FormPillSelect
                    v-model="category"
                    name="educationCategory"
                    :options="educationCategories"
                    :status="v$.category.$error ? 'error' : undefined"
                    class="c-formProfileCreateEducation__pills"
                    data-qa="education category select"
                    @change="type = {}"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.category.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.educationCategory') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection
            v-if="education.category.id"
            data-qa="education type section"
            class="c-formProfileCreateEducation__educationType"
        >
            <template #headline>
                Bitte wähle noch den passenden Schultyp aus.
            </template>
            <FormElement>
                <FormPillSelect
                    v-model="type"
                    name="educationType"
                    :options="educationTypesByActiveEducationCategory"
                    :status="v$.type.$error ? 'error' : undefined"
                    class="c-formProfileCreateEducation__pills c-formProfileCreateEducation__pills--underneath"
                    data-qa="education type select"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.type.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.educationType') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection
            v-if="educationTypeOtherSelected"
            data-qa="custom education type section"
            class="c-formProfileCreateEducation__customEducationType"
        >
            <FormElement>
                <template #start>
                    <FormLabel for="custom-education-type">
                        Schultyp
                    </FormLabel>
                </template>
                <FormInput
                    id="custom-education-type"
                    v-model="customType"
                    :status="v$.customType.$error ? 'error' : ''"
                    data-qa="custom education type field"
                    aria-label="Bezeichnung des Schultyps"
                    placeholder="Bezeichnung des Schultyps"
                    @blur="v$.customType.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.customType.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Schultyp' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection
            v-if="isApprentice"
            data-qa="training company section"
            class="c-formProfileCreateEducation__trainingCompany"
        >
            <FormElement>
                <template #start>
                    <FormLabel for="training-company">
                        Ausbildungsbetrieb
                    </FormLabel>
                </template>
                <FormInput
                    id="training-company"
                    v-model="trainingCompany"
                    :status="v$.trainingCompany.$error ? 'error' : ''"
                    aria-label="Name des Ausbildungsbetriebs"
                    placeholder="Name des Ausbildungsbetriebs"
                    data-qa="training company"
                    @blur="v$.trainingCompany.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.trainingCompany.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Ausbildungsbetrieb' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection
            v-if="!isApprentice"
            data-qa="education name section"
            class="c-formProfileCreateEducation__educationName"
        >
            <FormElement>
                <template #start>
                    <FormLabel for="education-name">
                        Schule / Institution
                    </FormLabel>
                </template>
                <FormInput
                    id="education-name"
                    v-model="name"
                    :status="v$.name.$error ? 'error' : ''"
                    data-qa="education name field"
                    aria-label="Name der Schule oder Institution"
                    placeholder="Name der Institution"
                    @blur="v$.name.$touch()"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.name.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Schule / Institution' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection
            v-if="true"
            data-qa="education focus section"
            class="c-formProfileCreateEducation__educationFocus"
        >
            <FormElement>
                <template #start>
                    <FormLabel for="education-focus">
                        <template v-if="isApprentice">
                            Lehrberuf
                        </template>
                        <template v-else>
                            Fachrichtung
                        </template>
                    </FormLabel>
                </template>
                <FormInput
                    id="education-focus"
                    v-model="focus"
                    :aria-label="isApprentice ? `Name des Lehrberufs` : `Name der Fachrichtung`"
                    :placeholder="isApprentice ? 'z.B. Tischler, Metalltechniker, Elektriker'
                        : 'Studienrichtung, Schwerpunkt...'"
                    :status="v$.focus.$error ? 'error' : ''"
                    data-qa="education focus field"
                />
                <template #end>
                    <FormMessage
                        v-if="v$.focus.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.required', { fieldName: 'Lehrberuf' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <FormSection
            data-qa="education duration section"
            class="c-formProfileCreateEducation__educationDuration"
        >
            <FormElement>
                <div class="c-formProfileCreateEducation__duration">
                    <FormElement>
                        <template #start>
                            <FormLabel for="education-start">
                                Von
                            </FormLabel>
                        </template>
                        <FormDateInput
                            id="education-start"
                            v-model="start"
                            :show-day="false"
                            :status="v$.start.$error ? 'error' : ''"
                            data-qa="education start"
                            divider="/"
                            default-day="01"
                            @blurLastField="v$.start.$touch()"
                            @input.native.capture="focusEducationEnd"
                        />
                    </FormElement>
                    <FormElement>
                        <template #start>
                            <FormLabel for="education-end">
                                {{ completed ? 'Bis' : 'Bis - optional' }}
                            </FormLabel>
                        </template>
                        <FormDateInput
                            id="education-end"
                            ref="educationEnd"
                            v-model="end"
                            :show-day="false"
                            :status="v$.end.$error ? 'error' : ''"
                            data-qa="education end"
                            divider="/"
                            default-day="01"
                            @blurLastField="v$.end.$touch()"
                        />
                    </FormElement>
                </div>
                <template #end>
                    <FormMessage
                        v-if="v$.start.$error || v$.end.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.dateRange') }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
            <FormElement>
                <FormCheckbox
                    :checked="!completed"
                    data-qa="education not completed checkbox"
                    @change="completed = !completed"
                >
                    Ausbildung ist noch nicht abgeschlossen
                </FormCheckbox>
            </FormElement>
        </FormSection>
    </LayoutForm>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../../assets/scss/settings/breakpoint';
@import '../../../../assets/scss/settings/spacing';

// 1. Display Block is needed, so that text can overflow as ellipis on mobile devices
// 2. These style rules affect another component (FormSection) since the default
//    spacing needs to be altered in this specific use case
// 3. Higher specificity is required, otherwise styles from .c-formSection override this
.c-formProfileCreateEducation {
    $root: &;

    &__duration {
        @include k-layout($k-spacing--l, $k-spacing--s);
    }

    &__actions {
        @include k-layout(0, $k-spacing--s);

        justify-content: flex-end;
    }

    &__action {
        @include k-layout__item(math.div(6, 12));

        @media (min-width: $k-breakpoint--m) {
            @include k-layout__item('min');

            width: auto;
        }
    }

    &__pills {
        display: block;

        &--underneath {
            & > * {
                display: block; // 1.

                @media (min-width: $k-breakpoint--m) {
                    display: inline-flex;
                }
            }
        }
    }

    &__educationType,
    &__customEducationType,
    &__trainingCompany { // 2.
        &.c-formSection { // 3.
            margin-top: $k-spacing--xl;
        }
    }

    &__customEducationType + #{$root}__educationName { // 2.
        margin-top: $k-spacing--m;
    }

    &__educationDuration,
    &__educationFocus { // 2.
        &.c-formSection { // 3.
            margin-top: $k-spacing--m;
        }
    }
}
</style>
