import * as mutationTypes from '../../../mutation-types';

const mutations = {
    [mutationTypes.SHOW_POPUP]: jest.fn(),
    [mutationTypes.HIDE_POPUP]: jest.fn(),
};

const state = {
    active: false,
    ariaLabel: '',
    componentName: '',
    componentProps: {},
    focusElementSelector: null,
    showCloseButton: false,
};

export default {
    namespaced: true,
    mutations,
    state,
};
