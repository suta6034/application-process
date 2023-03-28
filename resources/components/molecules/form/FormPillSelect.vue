<script setup>
import FormPill from '../../atoms/form/FormPill';
import {
    formOptionSelectEvents,
    formOptionSelectProps, useFormOptionSelect,
} from '../../../composables/form-option-select';

const props = defineProps({
    ...formOptionSelectProps,
    name: {
        type: String,
    },
    status: {
        type: String,
    },
    type: {
        type: String,
        default: 'radio',
    },
    centered: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['trackClick', ...formOptionSelectEvents]);

const {
    adaptedOptions,
    updateValue,
    adaptedValue,
} = useFormOptionSelect(props, emit);
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
        class="c-formPillSelect"
        :class="{'c-formPillSelect__centered': centered}"
    >
        <FormPill
            v-for="adaptedOption in adaptedOptions"
            :key="adaptedOption.id"
            :name="name"
            :checked="adaptedValue.id"
            :status="status"
            :type="type"
            v-bind="adaptedOption"
            :value="adaptedOption.id"
            :true-value="adaptedOption.id"
            class="c-formPillSelect__pill"
            data-qa="pill"
            @change="updateValue(adaptedOption); emit('trackClick', adaptedOption)"
        />
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/layout';

.c-formPillSelect {
    @include k-layout($k-spacing--s, $k-spacing--xs);

    &__pill {
        @include k-layout__item('min');

        max-width: 100%;
    }

    &__reviewPill {
        display: block;
    }

    &__centered {
        justify-content: center;
    }
}
</style>
