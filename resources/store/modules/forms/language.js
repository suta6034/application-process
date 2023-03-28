import {
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createLanguage,
    languageLevelById,
    DEFAULT_LEVEL_ID,
} from '../../../models/Language';
import {
    createAdaptedOption,
} from '../../../utils/AdaptedOption';

import * as mutationTypes from '../../mutation-types';

export const DEFAULT_ROW = {
    id: null,
    label: '',
    languageId: null,
    level: {},
};
const DEFAULT_LANGUAGE = { ...DEFAULT_ROW, level: languageLevelById(DEFAULT_LEVEL_ID) };

const mutations = {
    [mutationTypes.UPDATE](state, { path, value }) {
        if (path !== 'rows') return updateField(state, { path, value });

        const normalizedData = value.map((language) => {
            const existingLanguage = state.rows.find(({ id }) => id === language.id);

            return { ...DEFAULT_LANGUAGE, ...existingLanguage, ...language };
        });

        return updateField(state, { path, value: normalizedData });
    },
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // The default row is merged to make sure all necessary fields are initialized.
        // eslint-disable-next-line no-param-reassign
        state.rows = data.map(language => ({
            ...DEFAULT_ROW,
            id: language.id,
            label: language.title,
            languageId: language.languageId,
            level: language.skillLevel ? {
                id: language.skillLevel,
                label: language.skillLevelLabel,
            } : {},
        }));
    },
    [mutationTypes.UPDATE_LEVEL](state, { label, levelId }) {
        // eslint-disable-next-line no-param-reassign
        state.rows.find(skill => skill.label === label).level = languageLevelById(levelId);
    },
};

const getters = {
    getField,
    models(state) {
        return state.rows.map(x => createLanguage(x));
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

export function labelDefinitionAdapter(language) {
    return language.level.label;
}

export function optionAdapter(language) {
    return createAdaptedOption({
        id: language.id,
        label: language.label,
        value: language,
    });
}

export function autocompleteAdapter(item) {
    return { ...DEFAULT_LANGUAGE, label: item.label, languageId: item.id };
}

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
