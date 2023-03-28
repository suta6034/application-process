import {
    createNamespacedHelpers,
} from 'vuex';
import * as mutationTypes from '../mutation-types';
import * as actionTypes from '../action-types';
import * as CvFileService from '../../services/cv-file';
// eslint-disable-next-line import/no-cycle
import {
    commitAndShowModal,
} from '../../utils/error';
import availableTemplateSettings from '../../data/template-settings.json';

/**
 * Sanitize impossible template settings (e.g., non existing template and color combination).
 * @param {Record<string, any>} settings
 */
function sanitizeTemplateSettings(settings) {
    const activeTemplate = availableTemplateSettings.find(template => template.key === settings.template);
    const isColorInTemplate = Boolean(activeTemplate.colors.find(color => color.id === settings.color));
    // If the current template does not have the currently selected color, the
    // first color of the template is used as a fallback color.
    const defaultColor = activeTemplate.colors[0].id;

    return {
        ...settings,
        color: isColorInTemplate ? settings.color : defaultColor,
    };
}

const mutations = {
    [mutationTypes.SET_TEMPLATE_SETTINGS](state, settings) {
        state.settings.template = settings.template;
        state.settings.color = settings.color;
        state.settings.font = settings.font;
        state.settings.educationFirst = settings.educationFirst;
    },
    [mutationTypes.SET_TEMPLATE_SETTINGS_BY_KEY](state, settings) {
        state.settings[settings.key] = settings.value;
    },
    [mutationTypes.SET_MODIFIED](state, modified) {
        state.modified = modified;
    },
};

const DEFAULT = {
    modified: false,
    settings: {
        template: 'vegan',
        color: 'blu-gre',
        font: 'not-not',
        educationFirst: false,
    },
};

const state = () => ({ ...DEFAULT });

const getters = {
    templateSettings(localState) {
        return sanitizeTemplateSettings(localState.settings);
    },
};

const actions = {
    async [actionTypes.FETCH_TEMPLATE_SETTINGS]({ state: localState, commit }, profileCreate) {
        let templateSettings;
        if (!localState.modified && !profileCreate) {
            try {
                const response = await CvFileService.getTemplateSettings();
                templateSettings = response.data.data.attributes;
            } catch (error) {
                // eslint-disable no-empty
            }
        }
        if (!templateSettings) {
            templateSettings = localState.settings;
        }
        commit(mutationTypes.SET_TEMPLATE_SETTINGS, templateSettings);
        commit(mutationTypes.SET_MODIFIED, true);
    },
    async [actionTypes.CREATE_TEMPLATE_SETTINGS]({ commit }, { templateSettings, hash = null }) {
        try {
            const queryParameters = hash && { hash };
            await CvFileService.postTemplateSettings(templateSettings, queryParameters);
            commit(mutationTypes.SET_MODIFIED, false);
        } catch (error) {
            // eslint-disable-next-line no-lone-blocks
            {
                commitAndShowModal(commit, error);
            }
        }
    },
    async [actionTypes.UPDATE_TEMPLATE_SETTINGS]({ commit }, { templateSettings, hash = null }) {
        try {
            const queryParameters = hash && { hash };
            await CvFileService.patchTemplateSettings(templateSettings, queryParameters);
            commit(mutationTypes.SET_MODIFIED, false);
        } catch (error) {
            // eslint-disable-next-line no-lone-blocks
            {
                commitAndShowModal(commit, error);
            }
        }
    },
};

export const { mapState: mapTemplateSettingsState } = createNamespacedHelpers('templateSettings');

export const templateSettings = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
};
