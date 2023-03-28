<script setup>
import {
    computed,
} from 'vue';
import AppIcon from '../app/AppIcon';
import {
    useUniqueId,
} from '../../../composables/unique-id';

const props = defineProps({
    name: {
        type: String,
    },
    checked: {
        type: [Boolean, String, Number, Array],
        default: false,
    },
    error: {
        type: Boolean,
        default: false,
    },
    trueValue: {
        type: [Boolean, String, Number],
        default: true,
    },
    falseValue: {
        type: [Boolean, String, Number],
        default: false,
    },
});

const emit = defineEmits(['change']);

const shouldBeChecked = computed(() => props.checked === (props.trueValue));

const updateInput = (e) => {
    const isChecked = e.target.checked;
    emit('change', isChecked ? props.trueValue : props.falseValue);
};

const { id } = useUniqueId();
</script>

<template>
    <label
        class="k-c-checkbox"
        :class="{'k-c-checkbox--error': error}"
        :for="id"
    >
        <input
            :id="id"
            :name="name"
            :checked="shouldBeChecked"
            class="k-c-checkbox__input"
            type="checkbox"
            @change="updateInput"
        >
        <div
            :class="{
                'is-checked': shouldBeChecked
            }"
            class="k-c-checkbox__box"
            data-qa="icon"
        >
            <AppIcon
                class="k-c-checkbox__icon"
                name="check"
            />
        </div>
        <div class="k-c-checkbox__label">
            <slot/>
        </div>
    </label>
</template>
