import {
    onUnmounted,
    ref,
    unref,
} from 'vue';

import router from '../router';

export function useNavigationGuard({ isDirty }) {
    const proceedRef = ref(() => new Error('Proceeding not possible before route change is attempted!'));
    const isGuarded = ref(false);
    const unguard = () => {
        isGuarded.value = false;
    };
    const proceed = () => {
        unguard();
        proceedRef.value();
    };
    const routerHook = (to, from, next) => {
        proceedRef.value = next;

        if (unref(isDirty)) {
            isGuarded.value = true;
            return;
        }

        next();
    };
    const removeRouterHook = router.beforeEach(routerHook);
    onUnmounted(() => removeRouterHook && removeRouterHook());

    return {
        isGuarded,
        proceed,
        unguard,
    };
}
