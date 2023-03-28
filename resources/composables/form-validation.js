import {
    getCurrentInstance,
    nextTick, onMounted, ref, unref,
} from 'vue';
import {
    ERROR_CLASS,
    focusFirstStatus,
} from '../utils/form-focus';

export function useFormValidation(v$, el) {
    // If no validation or element have been supplied, set them via getCurrentInstance().
    // getCurrentInstance() is internal vue api, but it's documented in the advanced API section
    // and not deprecated. Still, this is a makeshift solution until we can upgrade vuelidate and provide
    // our own v$ from within script setup. Probably some time after mixin knots have been resolved.
    onMounted(() => {
        // eslint-disable-next-line no-param-reassign
        if (!v$) v$ = getCurrentInstance().proxy.$v;
        // eslint-disable-next-line no-param-reassign
        if (!el) el = ref(getCurrentInstance().proxy.$el);
    });

    const validate = () => {
        if (!unref(v$)) return true;
        unref(v$).$touch();
        if (unref(v$).$error) {
            nextTick(() => {
                const element = el.value?.$el ?? el.value;
                const firstErrorElement = element?.querySelector(ERROR_CLASS);
                focusFirstStatus(firstErrorElement);
            });
        }
        return !unref(v$).$error;
    };

    return {
        validate,
    };
}
