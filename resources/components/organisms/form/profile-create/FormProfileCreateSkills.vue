<script setup>
import FormElement from '../../../molecules/form/FormElement';
import FormFlag from '../../../atoms/form/FormFlag';
import FormMessage from '../../../atoms/form/FormMessage';
import FormSection from '../../../molecules/form/FormSection';
import FormSuggestionSelect from '../../../molecules/form/FormSuggestionSelect';
import LayoutForm from '../../../layouts/LayoutForm';

import '../../../../lang/validation';
import {
    useSkillForm,
} from '../../../../composables/skill-form';
import {
    skillMaxLength,
} from '../../../../utils/validators';

const {
    skills,
    showLevelSelection,
    MIN_SKILLS,
    MAX_SKILLS,
    skillLabelDefinitionAdapter,
    skillOptionAdapter,
    skillValueAdapter,
    suggestedSkills,
    updateSkills,
    v$,
} = useSkillForm('profileCreate');

defineExpose({ v$ });
</script>

<template>
    <LayoutForm
        class="c-formProfileCreateSkills"
        :full-page="false"
    >
        <FormSection
            headline="large"
            data-qa="skills section"
        >
            <template #headline>
                <span>
                    Kenntnisse&nbsp;
                    <FormFlag class="c-formProfileCreateSkills__formFlag">
                        mind. 3
                    </FormFlag>
                </span>
            </template>
            <FormElement>
                <FormSuggestionSelect
                    :value="skills"
                    :status="v$.skills.$error ? 'error' : ''"
                    :max="MAX_SKILLS"
                    :allow-new="true"
                    :auto-select-on-separator="false"
                    :label-definition-adapter="skillLabelDefinitionAdapter"
                    :option-adapter="skillOptionAdapter"
                    :value-adapter="skillValueAdapter"
                    :options="suggestedSkills"
                    :input-validation-rules="{ skillMaxLength }"
                    :input-limit="70"
                    placeholder="Eingeben oder Vorschläge wählen"
                    endpoint="skills"
                    data-qa="skill"
                    @pillPrimaryAction="showLevelSelection"
                    @change="updateSkills"
                    @add="showLevelSelection"
                >
                    <template #warning-distinct>
                        {{ $t('validation.distinct', { fieldName: 'Kenntnis' }) }}
                    </template>
                    <template #warning-max>
                        {{ $t('validation.max', { n: MAX_SKILLS, fieldName: 'Kenntnissen' }) }}
                    </template>
                </FormSuggestionSelect>
                <template #end>
                    <FormMessage
                        v-if="v$.skills.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.min', { n: MIN_SKILLS, fieldName: 'Kenntnisse' }) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>
    </LayoutForm>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../../assets/scss/settings/breakpoint';
@import '../../../../assets/scss/settings/font-size';
@import '../../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/layout';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-formProfileCreateSkills {
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

    &__formFlag {
        @include k-typo-s;
    }
}
</style>
