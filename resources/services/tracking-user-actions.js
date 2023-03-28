import {
    track,
    ACTIONS,
    LABELS,
} from '../utils/tracking';

import * as logger from '../utils/logger';

import {
    onUserAction,
} from './user-actions';

const hasCategory = (category) => {
    if (!category) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('trackingCategory is missing in the route meta object');
        } else {
            /* istanbul ignore next */
            logger.warning({ message: 'trackingCategory is missing in route meta object' });
        }
        return false;
    }
    return true;
};

export const initUserActionTracking = ({ getCurrentCategory }) => {
    onUserAction((userAction) => {
        const category = getCurrentCategory();
        if (!hasCategory(category)) return;

        track({
            category,
            action: ACTIONS.clickWithName(userAction.name),
            label: userAction.type !== null ? LABELS[userAction.type] : undefined,
        });
    });
};
