<script setup>
defineProps({
    status: {
        type: String,
    },
    value: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['input']);
const updateValue = (e) => {
    emit('input', e.target.value);
};
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <textarea
        :class="{
            [`k-c-input--${status}`]: status,
        }"
        :value="value"
        class="c-formTextarea k-c-input"
        v-on="{
            ...$listeners,
            input: event => updateValue(event),
        }"
    />
</template>

<style lang="scss">
.c-formTextarea {
    vertical-align: middle;
    resize: vertical;
}
</style>
