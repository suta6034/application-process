import {
    required,
    minLength,
} from '@vuelidate/validators';

import useVuelidate from '@vuelidate/core';
import {
    ref, watch, inject,
} from 'vue';
import * as skillRecommender from '../services/skill-recommender';
import * as authService from '../services/auth';

import {
    LEVELS,
} from '../models/Skill';
import {
    labelDefinitionAdapter as skillLabelDefinitionAdapter,
    optionAdapter as skillOptionAdapter,
    skillValueAdapter,
} from '../store/modules/forms/skill';
import {
    useMutations,
    useState,
} from './vuex-helpers';
import {
    UPDATE_LEVEL,
} from '../store/mutation-types';

const MIN_SKILLS = 3;
const MAX_SKILLS = 25;

export function useSkillForm(storeModule = '') {
    const suggestedSkills = ref([]);
    const store = inject('store');
    const {
        fetched,
        exists: profileExists,
    } = useState('profile');

    const { rows: skills } = useState(`${storeModule}/skill`);

    const {
        jobFields,
        objectives,
    } = useState(`${storeModule}/desiredJob`);

    const {
        SHOW_POPUP: showModal,
    } = useMutations('popup');

    function showLevelSelection(option) {
        /* istanbul ignore next */
        const skill = skills.value.find(x => x.label === option.label);

        /* istanbul ignore next */
        showModal({
            ariaLabel: `Wie gut kannst du ${skill.label}?`,
            componentName: 'ModalLevelSelector',
            componentProps: {
                adaptedOption: skillOptionAdapter(skill),
                levels: LEVELS,
                mutation: `${storeModule}/skill/${UPDATE_LEVEL}`,
            },
        });
    }

    const updateSkills = (value) => {
        store.commit(`${storeModule}/skill/UPDATE`, {
            path: 'rows',
            value,
        });
    };

    async function getSkills() {
        const givenSkills = skills.value.map(skill => skill.label);
        let config = { skills: givenSkills.join() };

        if (jobFields.value) {
            const givenJobFields = jobFields.value.map(field => field.id);
            config = { jobFields: givenJobFields.join(), ...config };
        }

        if (objectives.value) {
            const givenObjectives = objectives.value.map(field => field.name);
            config = { objectives: givenObjectives.join(), ...config };
        }

        return skillRecommender.get(config);
    }

    watch(skills, async () => {
        // this prevents the skill suggestions from being loaded before the profile is fetched
        // the suggestions are loaded immediately if a user is in the profile create process
        if (fetched.value || !await authService.isUserLoggedIn()) {
            suggestedSkills.value = await getSkills();
        }
    }, { immediate: true });

    watch(fetched, async () => {
        // make sure users without a profile get skills, too
        // they would not be served by the skills watcher because their skill will remain unchanged
        if (!profileExists.value) {
            suggestedSkills.value = await getSkills();
        }
    });

    const rules = {
        skills: {
            required,
            minLength: minLength(MIN_SKILLS),
        },
    };

    const v$ = useVuelidate(rules, { skills });

    return {
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
    };
}
