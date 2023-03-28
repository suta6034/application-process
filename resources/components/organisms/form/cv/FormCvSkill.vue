<script setup>
import {
    onBeforeMount,
    onBeforeUnmount,
} from 'vue';

import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import AppLink from '../../../atoms/app/AppLink';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormElement from '../../../molecules/form/FormElement';
import FormFlag from '../../../atoms/form/FormFlag';
import FormMessage from '../../../atoms/form/FormMessage';
import FormSection from '../../../molecules/form/FormSection';
import FormSuggestionSelect from '../../../molecules/form/FormSuggestionSelect';
import LayoutForm from '../../../layouts/LayoutForm';
import SvgLightBulb from '../../../atoms/svg/SvgLightBulb';

import '../../../../lang/validation';
import {
    skillMaxLength,
} from '../../../../utils/validators';
import {
    useSkillForm,
} from '../../../../composables/skill-form';
import {
    cvEditFormEvents, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const props = defineProps({
    standalone: {
        type: Boolean,
        default: false,
    },
    matching: {
        type: [Boolean, String],
        default: false,
    },
});
const emit = defineEmits([...cvEditFormEvents]);

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
} = useSkillForm('profile');

const {
    save,
    markAsDirty,
    cancel,
    dirty,
    beforeRouteLeaveCustom,
    sendMessageToK4,
} = useCvEditForm(props, emit, v$);

function markAsDirtyAndShowLevelSelection(skill) {
    markAsDirty();
    showLevelSelection(skill);
}

if (props.matching) {
    const k4Communication = (event) => {
        /* istanbul ignore next */
        if (event.key === 'Escape' || event.key === 'Esc') {
            sendMessageToK4('closeButton');
        }
    };

    onBeforeMount(() => document.addEventListener('keyup', k4Communication));
    onBeforeUnmount(() => document.removeEventListener('keyup', k4Communication));
}

// expose for unit testing
// beforeRouteLeaveCustom: used in PageCvSkillForm (matching k4)
defineExpose({ beforeRouteLeaveCustom, showLevelSelection });
</script>

<template>
    <LayoutForm
        ref="root"
        :full-page="standalone"
        :inline="!standalone"
        class="c-formCvSkill"
    >
        <template
            v-if="standalone"
            #headline
        >
            Kenntnisse
        </template>

        <template #info>
            <AppInfoBox hint>
                <template #icon>
                    <SvgLightBulb v-if="standalone"/>
                </template>
                Achte darauf, dass du Kenntnisse anführst, die für deinen Wunschjob relevant sein können.
                Trag nicht zu dick auf, verkaufe dich aber auch nicht unter Wert.
            </AppInfoBox>
        </template>

        <FormSection>
            <template #headline>
                Welche Kenntnisse bringst du mit?&nbsp;<FormFlag>mind. 3</FormFlag>
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
                    placeholder="Kenntnis eingeben oder Vorschlag wählen"
                    endpoint="skills"
                    data-qa="skill"
                    @pillPrimaryAction="markAsDirtyAndShowLevelSelection"
                    @add="markAsDirtyAndShowLevelSelection"
                    @change="markAsDirty($event) && updateSkills($event)"
                >
                    <template #warning-distinct>
                        {{ $t('validation.distinct', {fieldName: 'Kenntnis'}) }}
                    </template>
                    <template #warning-max>
                        {{ $t('validation.max', {n: MAX_SKILLS, fieldName: 'Kenntnissen'}) }}
                    </template>
                </FormSuggestionSelect>
                <template #end>
                    <FormMessage
                        v-if="v$.skills.$error"
                        type="error"
                    >
                        <li>
                            {{ $t('validation.min', {n: MIN_SKILLS, fieldName: 'Kenntnisse'}) }}
                        </li>
                    </FormMessage>
                </template>
            </FormElement>
        </FormSection>

        <template #actions>
            <AppButtonGroup v-if="standalone">
                <AppButton
                    :disabled="!dirty"
                    data-qa="save button"
                    @click="save('', matching)"
                >
                    Änderungen speichern
                </AppButton>
                <template #secondary>
                    <AppLink
                        v-if="!matching"
                        :to="{ name: 'page-cv' }"
                        data-qa="back link"
                    >
                        Zurück zum Lebenslauf
                    </AppLink>
                    <AppLink
                        v-else
                        tag="button"
                        @click="sendMessageToK4('closeButton')"
                    >
                        Zurück zu den Job-Empfehlungen
                    </AppLink>
                </template>
            </AppButtonGroup>
            <AppButtonGroup
                v-else
                variant="right"
            >
                <AppButton
                    :disabled="!dirty"
                    data-qa="save button"
                    @click="save"
                >
                    Änderungen speichern
                </AppButton>
                <template #secondary>
                    <AppButton
                        outline
                        data-qa="cancel button"
                        @click="cancel"
                    >
                        Abbrechen
                    </AppButton>
                </template>
            </AppButtonGroup>
        </template>
    </LayoutForm>
</template>
