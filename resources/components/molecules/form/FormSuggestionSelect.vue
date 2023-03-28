<script setup>
import uniqBy from 'lodash/uniqBy';
import {
    required,
} from '@vuelidate/validators';

import useVuelidate from '@vuelidate/core';
import {
    computed, nextTick, ref,
} from 'vue';
import AppIcon from '../../atoms/app/AppIcon';
import AppPillGroup from '../../atoms/app/AppPillGroup';
import FormElement from './FormElement';
import FormFilterSelect from './FormFilterSelect';
import FormMessage from '../../atoms/form/FormMessage';
import FormPillSelect from './FormPillSelect';
import {
    formOptionSelectEvents,
    formOptionSelectProps, useFormOptionSelect,
} from '../../../composables/form-option-select';

const props = defineProps({
    ...formOptionSelectProps,
    value: {
        type: Array,
    },
    placeholder: {
        type: String,
    },
    endpoint: {
        type: String,
    },
    status: {
        type: String,
    },
    allowNew: {
        type: Boolean,
        default: false,
    },
    max: {
        type: Number,
    },
    enablePrimaryAction: {
        type: Boolean,
        default: true,
    },
    autocompleteAdapter: {
        type: Function,
    },
    labelDefinitionAdapter: {
        type: Function,
        default: () => undefined,
    },
    noResultMessage: {
        type: String,
    },
    autoSelectOnSeparator: {
        type: Boolean,
        default: false,
    },
    inputLimit: {
        type: Number,
        default: 100,
    },
    // An object of functions
    inputValidationRules: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['pillPrimaryAction', 'add', 'input', ...formOptionSelectEvents]);

const {
    updateValue,
    adaptedValue,
    trimAdaptedOption,
} = useFormOptionSelect(props, emit);

const newValue = ref({});
const removedAdaptedOptions = ref([]);
const warning = ref({
    distinct: false,
    max: false,
});

const selectedAdaptedOptions = computed(() => uniqBy(adaptedValue.value, 'label'));

const unselectedOptions = computed(() => props.options
    .filter(option => !adaptedValue.value
        .find(({ label }) => label === props.optionAdapter(option).label))
    .filter(option => !removedAdaptedOptions.value
        .find(({ label }) => label === props.optionAdapter(option).label)));

const maxReached = computed(() => props.max && adaptedValue.value.length >= props.max);

const currentErrors = computed(() => Object.keys(v$.value.newValue)
    .filter(possibleKey => !possibleKey.startsWith('$') && v$.value.newValue[possibleKey] === false));

function add(adaptedOption) {
    const trimmedAdaptedOption = trimAdaptedOption(adaptedOption);
    if (!trimmedAdaptedOption || trimmedAdaptedOption.label === '') return;

    updateDistinctWarning(trimmedAdaptedOption);
    v$.value.$reset();
    nextTick(updateMaxWarning);
    if (warning.value.distinct || maxReached.value) return;

    updateValue(trimmedAdaptedOption);
    emit('add', adaptedOption);
}

function addNew() {
    v$.value.newValue.$touch();
    if (v$.value.newValue.$error) return;

    add(props.optionAdapter(newValue.value));
    // The FormFilterSelect component updates the input value asynchronously,
    // we wait for the next tick to compensate for that.
    nextTick(() => {
        newValue.value = {};
        resetFormFilterSelect();
    });
}

function remove(adaptedOption) {
    removedAdaptedOptions.value.push(adaptedOption);
    const newAdaptedValue = adaptedValue.value.filter(({ id }) => id !== adaptedOption.id);

    emit('change', newAdaptedValue.map(x => x.value));
    nextTick(updateMaxWarning);
}

function updateDistinctWarning(adaptedOption) {
    warning.value.distinct = selectedAdaptedOptions.value
        .find(option => option.label.toLowerCase() === adaptedOption.label.toLowerCase()) !== undefined;
}

function updateMaxWarning() {
    warning.value.max = props.max && adaptedValue.value.length >= props.max;
}

const newValueSelect = ref(null);
function resetFormFilterSelect() {
    if (!newValueSelect.value) return;

    newValueSelect.value.$el.querySelector('input').value = '';
    newValueSelect.value.$el.querySelector('input')
        .dispatchEvent(new CustomEvent('input', { detail: 'custom' }));
}

const validations = {
    newValue: {
        required,
        ...props.inputValidationRules,
    },
};
const v$ = useVuelidate(validations, { newValue }, { $scope: false });

defineExpose({ warning });
</script>

<script>
export default {
    model: {
        event: 'change',
    },
};
</script>

<template>
    <div
        :class="{
            'has-warning': warning.distinct || warning.max,
        }"
        class="c-formSuggestionSelect"
    >
        <ul
            v-if="selectedAdaptedOptions.length"
            class="c-formSuggestionSelect__selectedOptions"
            data-qa="selected options"
        >
            <li
                v-for="adaptedOption in selectedAdaptedOptions"
                :key="adaptedOption.id"
                class="c-formSuggestionSelect__selectedOption"
                data-qa="selected option"
            >
                <AppPillGroup
                    :tag="enablePrimaryAction ? 'button' : undefined"
                    v-bind="adaptedOption"
                    :label-definition="labelDefinitionAdapter(adaptedOption.value)"
                    @primaryAction="emit('pillPrimaryAction', adaptedOption.value)"
                    @secondaryAction="remove(adaptedOption)"
                >
                    {{ adaptedOption.label }}
                    <template #secondaryAction>
                        <span class="u-screen-reader-only">
                            Auswahl "{{ adaptedOption.label }}" entfernen
                        </span>
                        <AppIcon
                            name="cross"
                            size="xs"
                        />
                    </template>
                </AppPillGroup>
            </li>
        </ul>
        <div class="c-formSuggestionSelect__newValue">
            <FormElement>
                <FormFilterSelect
                    ref="newValueSelect"
                    v-model="newValue"
                    :status="status"
                    :placeholder="placeholder"
                    :endpoint="endpoint"
                    :allow-new="!warning.max && allowNew"
                    :disabled="warning.max"
                    :disable-dropdown="!endpoint"
                    :auto-select-on-focus-lost="false"
                    :auto-select-on-separator="autoSelectOnSeparator"
                    :autocomplete-adapter="autocompleteAdapter"
                    :value-adapter="valueAdapter"
                    :no-result-message="noResultMessage"
                    :input-limit="inputLimit"
                    data-qa="new value"
                    @input.native="warning.distinct = false"
                    @change="addNew"
                >
                    <template #icon>
                        <AppIcon name="plus"/>
                    </template>
                </FormFilterSelect>
                <template #end>
                    <FormMessage
                        v-if="warning.distinct || warning.max || (v$.$dirty && currentErrors.length > 0)"
                        type="warning"
                    >
                        <li v-if="warning.distinct">
                            <slot name="warning-distinct"/>
                        </li>
                        <li
                            v-if="warning.max"
                            data-qa="warning max"
                        >
                            <slot name="warning-max"/>
                        </li>
                        <template v-if="v$.$dirty">
                            <li
                                v-for="error in currentErrors"
                                :key="error"
                            >
                                {{ $t('validation.' + error, {}) }}
                            </li>
                        </template>
                    </FormMessage>
                </template>
            </FormElement>
        </div>
        <div
            v-if="unselectedOptions.length"
            class="c-formSuggestionSelect__suggestedOptions"
        >
            <FormPillSelect
                :status="warning.max ? 'disabled' : undefined"
                :option-adapter="optionAdapter"
                :options="unselectedOptions"
                type="checkbox"
                data-qa="suggested options"
                @change="add(optionAdapter($event))"
            />
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/layout';

.c-formSuggestionSelect {
    // 1. Because the spacing should only apply if there are any selected options,
    //    margin bottom on this element is used over margin top on the following element.
    // 2. Overriding this component is necessary since its default alignment does not
    //    apply to this specific use case.
    &__selectedOptions {
        @include k-layout($k-spacing--s, $k-spacing--xs);

        margin-bottom: $k-spacing--l; // 1
    }

    &__selectedOption {
        @include k-layout__item('min');

        display: inline-flex;
        max-width: 100%;
    }

    &__suggestedOptions {
        margin-top: $k-spacing--m;

        .has-warning & {
            margin-top: $k-spacing--l;
        }

        .c-formPillSelect { // 2
            justify-content: flex-start;
        }
    }
}
</style>
