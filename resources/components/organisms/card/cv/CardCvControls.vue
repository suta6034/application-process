<script setup>
import AppButtonIconOnly from '../../../atoms/app/AppButtonIconOnly';
import AppButtonIconOnlyGroup from '../../../molecules/app/AppButtonIconOnlyGroup';
import '../../../../directives/debounce-click';

defineProps({
    isEditable: {
        default: true,
        type: Boolean,
    },
    gaElement: {
        default: null,
        type: String,
    },
});

const emit = defineEmits(['edit', 'delete']);
</script>

<template>
    <AppButtonIconOnlyGroup class="c-cardCvControls">
        <AppButtonIconOnly
            v-if="isEditable"
            size="xl"
            icon="pen"
            aria-label="Bearbeiten"
            data-qa="edit link"
            :data-gtm-element="`PR_L: ${gaElement}`"
            data-gtm-element-detail="Edit"
            @click="emit('edit')"
        />
        <AppButtonIconOnly
            v-debounce-click
            size="xl"
            icon="dustbin"
            aria-label="Löschen"
            data-qa="delete link"
            :data-gtm-element="`PR_L: ${gaElement}`"
            data-gtm-element-detail="Delete"
            @click="emit('delete')"
        />
    </AppButtonIconOnlyGroup>
</template>
