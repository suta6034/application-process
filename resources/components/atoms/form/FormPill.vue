<script setup>
import {
    computed, ref,
} from 'vue';
import AppPill from '../app/AppPill';

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    value: {
        type: [Array, Boolean, Number, String],
    },
    checked: {
        type: [Array, Boolean, Number, String],
        default: false,
    },
    trueValue: {
        type: [Boolean, Number, String],
        default: true,
    },
    falseValue: {
        type: [Boolean, Number, String],
        default: false,
    },
    status: {
        type: String,
    },
    type: {
        type: String,
        default: 'radio',
    },
});

const allowMultiple = ref(props.checked instanceof Array);

const shouldBeChecked = computed(() => {
    if (allowMultiple.value) return props.checked.includes(props.value);

    return (props.checked === props.trueValue || props.status === 'active');
});

if (process.env.NODE_ENV === 'development') {
    const isRadioInputWithoutName = props.type === 'radio' && !props.name;
    if (isRadioInputWithoutName) throw new Error('Radio inputs require a `name`!');
}

const emit = defineEmits(['change']);

const updateInput = (e) => {
    const isChecked = e.target.checked;

    if (allowMultiple.value) {
        const newValue = props.checked;

        if (isChecked) {
            newValue.push(props.value);
        } else {
            newValue.splice(newValue.indexOf(props.value), 1);
        }

        emit('change', newValue);
    } else {
        emit('change', isChecked ? props.trueValue : props.falseValue);
    }
};
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label
        :class="{
            [`has-status-${status}`]: status,
        }"
        class="c-formPill"
    >
        <AppPill
            :status="shouldBeChecked ? 'active' : undefined"
            outline
            class="c-formPill__label"
            data-qa="label"
        >
            {{ label }}
            <input
                :name="name"
                :value="value"
                :checked="shouldBeChecked"
                :type="type"
                class="u-screen-reader-only"
                @change="updateInput"
            >
        </AppPill>
    </label>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';

.c-formPill {
    display: inline-block;
}
</style>
