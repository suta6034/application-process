import mitt from '../utils/mitt';

import * as logger from '../utils/logger';

const userActions = new Set([
    'application-add-application-cancel',
    'application-add-application-infobox',
    'application-add-application-save',
    'application-add-note-detail',
    'application-add-note',
    'application-delete-cancel',
    'application-delete-delete',
    'application-delete-detail',
    'application-delete',
    'application-edit-application-detail',
    'application-edit-application-tab-application',
    'application-edit-application',
    'application-edit-note-detail',
    'application-edit-note',
    'application-empty-add-application',
    'application-empty-create-cv',
    'application-empty-job-search',
    'application-empty-saved-job',
    'application-filter-open',
    'application-filter-reset-detail',
    'application-filter-sort-newest',
    'application-filter-sort-oldest',
    'application-filter-state-applied',
    'application-filter-state-confirmed',
    'application-filter-state-invited',
    'application-filter-state-rejected',
    'application-filter-state-archived',
    'application-invited-date-cancel',
    'application-open-popover-detail',
    'application-open-popover',
    'application-pagination-first',
    'application-pagination-next',
    'application-pagination-previous',
    'application-select-invited-date',
    'application-state-changeto-applied',
    'application-state-changeto-cancel',
    'application-state-changeto-confirmed',
    'application-state-changeto-invited',
    'application-state-changeto-rejected',
    'application-state-edit',
    'application-status-detail',
    'application-status',
    'application-tab-application',
    'application-tab-company',
    'application-tab-job',
    'application-tab-memo',
    'emptystate-add-application-letter',
    'emptystate-add-application',
    'modal-why-not-cancel',
    'profile-list-document-upload',
    'show-all-applications',
]);

export const emitUserAction = (name, type = 'click') => {
    mitt.emit('userAction', { name, type });
};

const isInValidUserAction = ({ userAction }) => {
    if (userActions.has(userAction.name)) return false;

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`${userAction.name} is not a defined userAction`);
    } else {
        logger.warning({ message: `${userAction.name} is not a defined userAction` });
    }
    return true;
};

export const onUserAction = (callback) => {
    mitt.on('userAction', (userAction) => {
        if (isInValidUserAction({ userAction })) return;
        callback(userAction);
    });
};
