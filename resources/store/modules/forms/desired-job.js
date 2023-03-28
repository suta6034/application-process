import {
    getField,
    updateField,
} from 'vuex-map-fields';

import {
    createAdaptedOption,
} from '../../../utils/AdaptedOption';
import {
    createDesiredJob, WORKFROMHOME_OPTIONS,
    TERM_OF_NOTICE_OPTIONS, TRAVEL_READINESS_OPTIONS,
} from '../../../models/DesiredJob';

import * as mutationTypes from '../../mutation-types';

function mapEmploymentTypeLabel(employmentTypes) {
    employmentTypes.forEach((employment) => {
        // eslint-disable-next-line no-param-reassign
        employment.title = employment.title.replace('Teilzeit/geringfügig', 'Teilzeit');
    });
    return employmentTypes;
}

const DEFAULT = {
    branches: [],
    employment: [],
    jobFields: [],
    locations: [],
    migrate: 0,
    objectives: [],
    salary: 0,
    termOfNotice: {},
    travelReadiness: { value: null },
    workFromHome: { value: null },
};

const mutations = {
    updateField,
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        /* eslint-disable no-param-reassign */
        state.branches = data.branches;
        state.employment = mapEmploymentTypeLabel(data.employment);
        state.jobFields = data.jobFields;
        state.locations = data.locations;
        state.migrate = data.migrate;
        state.objectives = data.objectives;
        state.salary = data.salary;
        state.termOfNotice = {
            id: data.termOfNotice,
            label: TERM_OF_NOTICE_OPTIONS.find(x => data.termOfNotice === x.id).label,
            value: data.termOfNotice,
        };

        state.travelReadiness = {
            value: null,
            ...TRAVEL_READINESS_OPTIONS.find(({ value }) => value === data.travelReadiness),
        };

        state.workFromHome = {
            value: null,
            ...WORKFROMHOME_OPTIONS.find(({ value }) => value === data.workFromHome),
        };
        /* eslint-enable */
    },
};

const getters = {
    getField,
    model(state) {
        return createDesiredJob(state);
    },
};

const state = () => ({ ...DEFAULT });

/**
 * Generic options adapter for branches, job-fields and employments.
 *
 * @param {object} option
 */
export function desiredJobOptionsAdapter(option) {
    return createAdaptedOption({
        id: option.id,
        label: option.title,
        value: {
            id: option.id,
            title: option.title,
        },
    });
}

export function desiredJobValueAdapter(option) {
    return { id: option.id, title: option.label };
}

export function locationAutocompleteAdapter(location) {
    return location;
}

export function objectiveOptionAdapter(objective) {
    return createAdaptedOption({
        id: objective.id,
        label: objective.name,
        value: objective,
    });
}

export function objectiveValueAdapter(name) {
    return { id: null, name };
}

export function salaryFormatAdapter(salary) {
    const salaryInt = Number.isNaN(parseInt(salary, 10)) ? 0 : parseInt(salary, 10);
    return salaryInt === 0 ? '' : salaryInt.toLocaleString('de');
}

export function salaryValueAdapter(salary) {
    return (Number.isNaN(parseInt(salary, 10)) ? 0 : parseInt(salary.replace('.', ''), 10));
}

export function termOfNoticeValueAdapter(termOfNotice) {
    return termOfNotice.value;
}

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
