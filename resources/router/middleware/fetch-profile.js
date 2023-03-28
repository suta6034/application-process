import {
    FETCH_PROFILE,
} from '../../store/action-types';

export default async function fetchProfile({ next, store }) {
    if (store.state.profile.exists) return next();

    store.dispatch(`profile/${FETCH_PROFILE}`);

    return next();
}
