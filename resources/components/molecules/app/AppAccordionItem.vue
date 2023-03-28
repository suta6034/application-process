<script setup>
import {
    ref,
} from 'vue';

const props = defineProps({
    isActiveInitially: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['open', 'close']);
const isActive = ref(props.isActiveInitially);
const toggle = () => {
    isActive.value = !isActive.value;
    if (isActive.value === true) emit('open');
    else emit('close');
};
</script>

<template>
    <div class="c-appAccordionItem">
        <slot
            :is-active="isActive"
            :toggle="toggle"
        />
    </div>
</template>
