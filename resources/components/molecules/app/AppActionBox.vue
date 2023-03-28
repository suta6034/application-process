<script setup>
import AppButtonIconOnly from '../../atoms/app/AppButtonIconOnly';

defineProps({
    isClosable: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['hide']);
</script>

<template>
    <div class="c-appActionBox k-c-actionBox">
        <div
            v-if="$slots.header || isClosable"
            class="k-c-actionBox__header"
        >
            <slot name="header"/>
            <AppButtonIconOnly
                v-if="isClosable"
                icon="cross"
                aria-label="Schließen"
                class="k-c-actionBox__close"
                data-qa="close button"
                @click="emit('hide')"
            />
        </div>
        <div class="k-c-actionBox__actions">
            <slot/>
        </div>
    </div>
</template>
