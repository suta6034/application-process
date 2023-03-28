import * as logger from './logger';
import * as mutationTypes from '../store/mutation-types';
// eslint-disable-next-line import/no-cycle
import store from '../store';

export const modalProperties = {
    ariaLabel: 'Es ist ein Fehler aufgetreten',
    componentName: 'ModalApiError',
    componentProps: {},
};

export function commitAndShowModal(commit, exception, data = {}, properties = {}) {
    /* istanbul ignore next */
    modalProperties.componentProps.eventId = logger.error({
        exception,
        extra: {
            state: {
                // Log some important (non-personal) parts of the state.
                profileCreate: store.state.profileCreate ? {
                    profileExists: store.state.profileCreate.profileExists,
                    userWithEmailExists: store.state.profileCreate.userWithEmailExists,
                } : null,
            },
            data,
        },
        tags: {
            user_info: logger.userInfoTags.MODAL,
        },
    });

    commit(`popup/${mutationTypes.SHOW_POPUP}`, { ...modalProperties, ...properties }, { root: true });
}
