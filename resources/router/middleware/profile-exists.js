import {
    FETCH_PROFILE,
} from '../../store/action-types';
import {
    HIDE_POPUP,
    SHOW_POPUP,
} from '../../store/mutation-types';

export default async function profileExists({ next, store }) {
    if (store.state.profile.exists) return next();

    store.commit(`popup/${SHOW_POPUP}`, {
        componentName: 'ProgressPopup',
        type: 'progress',
    });
    await store.dispatch(`profile/${FETCH_PROFILE}`);
    store.commit(`popup/${HIDE_POPUP}`);

    if (store.state.profile.exists) return next();

    return next({ name: 'cv-landing-page' });
}
