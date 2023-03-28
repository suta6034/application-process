import {
    getField,
} from 'vuex-map-fields';
import {
    createSoftSkill,
} from '../../../models/SoftSkill';
import * as mutationTypes from '../../mutation-types';

export const DEFAULT_ROW = {
    id: null,
    personalityTraitId: null,
};

const mutations = {
    [mutationTypes.UPDATE](state, { personalityTraitId, softSkillId = null }) {
        if (
            state.rows.find(row => parseInt(row.personalityTraitId, 10) === parseInt(personalityTraitId, 10))
        ) {
            state.rows = state.rows
                .filter(row => !(parseInt(row.personalityTraitId, 10) === parseInt(personalityTraitId, 10)));
        } else {
            state.rows.push({
                id: softSkillId,
                personalityTraitId,
            });
        }
    },
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // The default row is merged to make sure all necessary fields are initialized.
        // eslint-disable-next-line no-param-reassign
        state.rows = data.map(softSkill => ({
            ...DEFAULT_ROW,
            id: softSkill.id,
            personalityTraitId: softSkill.personalityTraitId,
        }));
    },
};

const getters = {
    getField,
    models(state) {
        return state.rows.map(x => createSoftSkill(x));
    },
};

const state = () => ({
    rows: [],
});

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
