import {
    getField,
    updateField,
} from 'vuex-map-fields';

import {
    createContact,
} from '../../../models/Contact';
import {
    createLocation,
} from '../../../models/Location';
import {
    createProfileBasics,
} from '../../../models/Basics';
import {
    createAdaptedOption,
} from '../../../utils/AdaptedOption';
import {
    formatUrl,
} from '../../../utils/filter';

import * as mutationTypes from '../../mutation-types';
import salutationTypes from '../../../data/salutation-types.json';

const DEFAULT = {
    birthdate: null,
    country: {},
    email: '',
    firstname: '',
    mobile: '',
    nationality: '',
    salutation: {},
    state: {},
    street: '',
    suffix: '',
    surname: '',
    title: '',
    town: '',
    web: [],
    zip: null,
};

const mutations = {
    updateField,
    [mutationTypes.CLEAR_EMAIL](state) {
        // eslint-disable-next-line no-param-reassign
        state.email = '';
    },
    [mutationTypes.RESET_STATE](state) {
        Object.keys(state).forEach((key) => {
            state[key] = DEFAULT[key];
        });
    },
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        /* eslint-disable no-param-reassign */
        state.birthdate = data.birthdate;
        state.country = data.location.country ? {
            id: data.location.country,
            label: data.location.countryLabel,
        } : {};
        state.email = data.contact.email;
        state.firstname = data.firstname;
        state.mobile = data.contact.mobile; // B2C-users only use the mobile telephone field
        state.nationality = data.nationality;
        state.salutation = salutationTypes.find(type => type.id === data.salutation) || {};
        state.state = data.location.state ? {
            id: data.location.state,
            label: data.location.stateLabel,
        } : {};
        state.street = data.location.street;
        state.suffix = data.suffix;
        state.surname = data.surname;
        state.title = data.title;
        state.town = data.location.town || '';
        state.web = data.contact.web;
        state.zip = data.location.zip;
        /* eslint-enable */
    },
};

const getters = {
    getField,
    model(state) {
        return createProfileBasics({
            birthdate: state.birthdate,
            contact: createContact({
                email: state.email,
                mobile: state.mobile,
                web: state.web,
            }),
            firstname: state.firstname,
            location: createLocation({
                country: state.country,
                state: state.state,
                street: state.street,
                town: state.town,
                zip: state.zip,
            }),
            nationality: state.nationality,
            salutation: state.salutation,
            suffix: state.suffix,
            surname: state.surname,
            title: state.title,
        });
    },
};

const state = () => ({ ...DEFAULT });

export function nationalityOptionAdapter(nationality) {
    const adaptedLabel = nationality.label !== undefined ? nationality.label : nationality;
    return createAdaptedOption({
        label: adaptedLabel,
        value: adaptedLabel,
    });
}

export function nationalityValueAdapter(nationality) {
    return { label: nationality };
}

export function townOptionAdapter(town) {
    const adaptedLabel = typeof town === 'string' ? town : town.label;
    return createAdaptedOption({
        label: adaptedLabel,
        value: adaptedLabel,
    });
}

export function townValueAdapter(town) {
    return { label: town };
}

export function countryAutocompleteAdapter(item) {
    return {
        id: item.id,
        label: item.label,
    };
}

export function webAddressOptionAdapter(webAddress) {
    return createAdaptedOption({
        label: formatUrl(webAddress),
        value: webAddress,
    });
}

export function webAddressValueAdapter(webAddress) {
    return webAddress;
}

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
