<script>
import FormSuggestionSelect from '../molecules/form/FormSuggestionSelect';
import {
    useSkillForm,
} from '../../composables/skill-form';

export default {
    components: {
        FormSuggestionSelect,
    },
    setup() {
        const {
            skills,
            skillLabelDefinitionAdapter,
            skillOptionAdapter,
            skillValueAdapter,
            suggestedSkills,
            updateSkills,
        } = useSkillForm('profile');

        return {
            skills,
            skillLabelDefinitionAdapter,
            skillOptionAdapter,
            skillValueAdapter,
            suggestedSkills,
            updateSkills,
        };
    },
};
</script>

<template>
    <FormSuggestionSelect
        :value="skills"
        :options="suggestedSkills"
        :allow-new="true"
        :label-definition-adapter="skillLabelDefinitionAdapter"
        :option-adapter="skillOptionAdapter"
        :value-adapter="skillValueAdapter"
        data-qa="suggestion select"
        @change="updateSkills"
    />
</template>
