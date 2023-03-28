import {
    ref, nextTick, inject,
} from 'vue';
import '../lang/notification';
import {
    useActions, useGetters,
} from './vuex-helpers';
import {
    log,
} from '../utils/action-logger';
import {
    ACTIONS, LABELS, track,
} from '../utils/tracking';

export const minitaskEvents = ['updated', 'skipped'];

export function useMinitaskEditForm({ key = '', validate = () => true, emit, onSave, clickAction }) {
    const router = inject('router');
    const dirty = ref(false);

    const {
        model: profileModel,
    } = useGetters('profile');

    const {
        UPDATE_PROFILE: updateProfile,
    } = useActions('profile');

    function markAsDirty() {
        dirty.value = true;
    }

    async function save() {
        await nextTick();
        dirty.value = false;
        await updateProfile(profileModel.value);
    }

    /* istanbul ignore next */
    function trackClick(label) {
        track({
            category: router.currentRoute.meta?.trackingCategory,
            action: ACTIONS.clickWithName(`minitask-${clickAction ?? key}`),
            label: LABELS.eventWithName(label),
        });
    }

    function skipped() {
        emit('skipped');
        trackClick('skip');
        log('profile-minitask', {
            label: key,
            result: 'skip',
        });
    }

    function saveData() {
        if (validate()) {
            onSave?.();
            save();
            emit('updated');
            trackClick('save');
            log('profile-minitask', {
                label: key,
                result: 'save',
            });
        }
    }

    return {
        save,
        markAsDirty,
        dirty,
        skipped,
        saveData,
        trackClick,
    };
}
