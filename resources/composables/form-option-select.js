import {
    computed,
} from 'vue';

export const formOptionSelectProps = {
    options: {
        type: Array,
        default: () => [],
    },
    optionAdapter: {
        type: Function,
        default: option => ({
            id: (option.id === 0 || option.id) ? option.id : option.label,
            label: option.label,
            value: option,
            icon: option.icon,
        }),
    },
    value: {
        type: [Array, Object, String, Number],
        default: () => ({}),
    },
    valueAdapter: {
        type: Function,
        default: string => ({
            id: null,
            label: string,
        }),
    },
};
export const formOptionSelectEvents = ['update:invalid', 'change'];

export function useFormOptionSelect(props, emit) {
    const hasMultipleValues = computed(() => Array.isArray(props.value));
    const adaptedOptions = computed(() => props.options.map(x => props.optionAdapter(x)));
    const adaptedValue = computed(() => (hasMultipleValues.value
        ? props.value.map(x => props.optionAdapter(x))
        : props.optionAdapter(props.value)));

    const emptyValue = computed(() => {
        if (Array.isArray(props.value)) return [];
        if (typeof props.value === 'string') return '';
        if (props.value === null) return null;
        return {};
    });

    const updateValue = (adaptedOption, isInvalid = false) => {
        let newValue = emptyValue.value;

        if (hasMultipleValues.value) {
            newValue = adaptedOption ? [...props.value, adaptedOption.value] : [];
        } else if (adaptedOption) {
            newValue = adaptedOption.value;
        }

        emit('update:invalid', isInvalid);
        emit('change', newValue);
    };

    const trimAdaptedOption = (adaptedOption) => {
        if (!adaptedOption) return false;

        return {
            ...adaptedOption,
            label: adaptedOption.label.trim(),
        };
    };

    /**
     * Validates an adapted option by trimming its label and checking if it isn't empty.
     *
     * @param {object} adaptedOption
     * @returns {boolean}
     */
    const isValidAdaptedOption = (adaptedOption) => {
        if (!adaptedOption) return false;
        return adaptedOption.label.trim() !== '';
    };

    return {
        adaptedOptions,
        isValidAdaptedOption,
        trimAdaptedOption,
        updateValue,
        emptyValue,
        adaptedValue,
        hasMultipleValues,
    };
}
