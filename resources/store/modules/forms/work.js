import {
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createWork,
} from '../../../models/Work';
import {
    createAdaptedOption,
} from '../../../utils/AdaptedOption';

import * as mutationTypes from '../../mutation-types';

import jobFieldTypes from '../../../data/job-field-types.json';

export const WORK_CATEGORY = {
    BERUFSERFAHRUNG: 'Berufserfahrung',
    ELTERNZEIT: 'Elternzeit',
    GRUNDWEHRDIENST: 'Grundwehrdienst',
    ZIVILDIENST: 'Zivildienst',
    SONSTIGES: 'Sonstiges',
};

export const DEFAULT_ROW = {
    category: {
        id: 1,
        label: WORK_CATEGORY.BERUFSERFAHRUNG,
    },
    company: {},
    current: false,
    description: '',
    employmentType: {},
    end: null,
    id: null,
    jobfield: {},
    start: null,
    submitted: false,
    title: '',
};

const mutations = {
    updateField,
    [mutationTypes.CLEAR_NEW_ROWS](state) {
        // eslint-disable-next-line no-param-reassign
        state.rows = state.rows.map((work) => {
            if (!work.id) {
                return { ...DEFAULT_ROW };
            }

            return work;
        });
    },
    [mutationTypes.DELETE](state, id) {
        // eslint-disable-next-line no-param-reassign
        state.rows = state.rows.filter(x => x.id !== id);
    },
    [mutationTypes.RESET_STATE](state) {
        Object.keys(state.rows).forEach((key) => {
            state[key] = DEFAULT_ROW[key];
        });
    },
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // The default row is merged to make sure all necessary fields are initialized.
        data.forEach((work) => {
            // We miss jobfield label from job-extractor, so map here against id.
            if (work.jobfieldLabel === '') {
                // try to match jobfield id
                const type = jobFieldTypes.find(t => t.id === work.jobfield);
                // eslint-disable-next-line no-param-reassign
                work.jobfieldLabel = type ? type.title : '';
            }
        });

        state.rows = [
            ...data.map(work => ({
                ...DEFAULT_ROW,
                category: !work.profileExperienceCategoryId
                    ? { ...DEFAULT_ROW.category }
                    : {
                        id: work.profileExperienceCategoryId,
                        label: work.profileExperienceCategoryLabel,
                    },
                company: {
                    id: work.companyId,
                    label: work.company,
                },
                current: !work.end,
                description: work.description,
                employmentType: work.employmentType ? {
                    id: work.employmentType,
                    label: work.employmentTypeLabel.replace('Teilzeit/geringfügig', 'Teilzeit'),
                } : {},
                end: work.end,
                id: work.id,
                jobfield: work.jobfield ? {
                    id: work.jobfield,
                    label: work.jobfieldLabel,
                } : {},
                start: work.start,
                title: work.title,
            })),
            ...state.rows
                .filter(({ id }) => !id)
                .map((work) => {
                    // eslint-disable-next-line no-param-reassign
                    work.submitted = false;

                    return work;
                }),
        ];
    },
};

const getters = {
    getField,
    count(state) {
        return state.rows.filter(({ id }) => id).length;
    },
    filled(state) {
        return state.rows[0].id !== null;
    },
    models(state) {
        return state.rows
            .filter(x => x.id || x.submitted)
            .map(x => createWork(x));
    },
};

const state = () => ({
    rows: [{ ...DEFAULT_ROW }],
});

export function autocompleteAdapter(item) {
    return { label: item.label, id: item.id };
}

export function companyOptionAdapter(company) {
    return createAdaptedOption({
        label: company.label,
        value: company.id || null,
    });
}

export function titleOptionAdapter(title) {
    const adaptedLabel = typeof title === 'string' ? title : title.label;
    return createAdaptedOption({
        label: adaptedLabel,
        value: adaptedLabel,
    });
}

export function titleValueAdapter(title) {
    return { label: title };
}

export function workExperienceOptionsAdapter(option) {
    return createAdaptedOption({
        id: option.id,
        label: option.title || option.label,
        value: {
            id: option.id,
            title: option.title || option.label,
        },
    });
}

export function workExperienceValueAdapter(option) {
    return { id: option.id, title: option.label };
}

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
