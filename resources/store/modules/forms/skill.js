import {
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createSkill,
    DEFAULT_LEVEL_ID,
    skillLevelById,
} from '../../../models/Skill';
import {
    createAdaptedOption,
} from '../../../utils/AdaptedOption';

import * as mutationTypes from '../../mutation-types';

export const DEFAULT_ROW = {
    id: null,
    label: '',
    level: {},
};
const DEFAULT_SKILL = { ...DEFAULT_ROW, level: skillLevelById(DEFAULT_LEVEL_ID) };

const mutations = {
    [mutationTypes.RESET_STATE](state) {
        Object.keys(state.rows).forEach((key) => {
            state[key] = DEFAULT_ROW[key];
        });
    },
    [mutationTypes.UPDATE](state, { path, value }) {
        if (path !== 'rows') return updateField(state, { path, value });

        const normalizedData = value.map((skill) => {
            const existingSkill = state.rows.find(({ id }) => id === skill.id);

            return { ...DEFAULT_SKILL, ...existingSkill, ...skill };
        });

        return updateField(state, { path, value: normalizedData });
    },
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // The default row is merged to make sure all necessary fields are initialized.
        // eslint-disable-next-line no-param-reassign
        state.rows = data.map(skill => ({
            ...DEFAULT_ROW,
            id: skill.id,
            label: skill.name,
            level: skill.level ? {
                id: skill.level,
                label: skill.levelLabel,
            } : {},
        }));
    },
    [mutationTypes.UPDATE_LEVEL](state, { label, levelId }) {
        // eslint-disable-next-line no-param-reassign
        state.rows.find(skill => skill.label === label).level = skillLevelById(levelId);
    },
};

const getters = {
    getField,
    models(state) {
        return state.rows.map(x => createSkill(x));
    },
    count(state) {
        return state.rows.length;
    },
    filled(state) {
        return state.rows.length > 0;
    },
};

const state = () => ({
    rows: [],
});

export function labelDefinitionAdapter(skill) {
    return skill.level.label;
}

export function optionAdapter(skill) {
    return createAdaptedOption({
        id: skill.id,
        label: skill.label,
        value: skill,
    });
}

export function skillValueAdapter(label) {
    return { ...DEFAULT_SKILL, label };
}

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
