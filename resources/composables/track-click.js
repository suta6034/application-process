import {
    ACTIONS,
    LABELS, track,
} from '../utils/tracking';

export function useTrackClick(category = '') {
    const trackClick = (action) => {
        track({
            category,
            action: ACTIONS.clickWithName(action),
            label: LABELS.click,
        });
    };

    return {
        trackClick,
    };
}
