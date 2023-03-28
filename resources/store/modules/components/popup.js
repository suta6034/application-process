import * as mutationTypes from '../../mutation-types';

const mutations = {
    [mutationTypes.SHOW_POPUP](state, {
        ariaLabel = '',
        componentName = '',
        componentProps = {},
        focusElementSelector = null,
        showCloseButton = true,
        title = '',
        type = 'modal',
    }) {
        /* eslint-disable no-param-reassign */
        state.active = true;
        state.ariaLabel = ariaLabel || title;
        state.componentName = componentName;
        state.componentProps = componentProps;
        state.focusElementSelector = focusElementSelector;
        state.showCloseButton = showCloseButton;
        state.title = title;
        state.type = type;
        /* eslint-enable */
    },
    [mutationTypes.HIDE_POPUP](state) {
        /* eslint-disable no-param-reassign */
        state.active = false;
        // Reset the component name so the `destroyed` hook gets called
        // on popup components, see `AppPopup.vue` for clarification.
        state.componentName = '';
        /* eslint-enable */
    },
};

const state = () => ({
    active: false,
    ariaLabel: '',
    componentName: '',
    componentProps: {},
    focusElementSelector: null,
    showCloseButton: false,
    title: '',
    type: 'modal',
});

export default {
    namespaced: true,
    mutations,
    state,
};
