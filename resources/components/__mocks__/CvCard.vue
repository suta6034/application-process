<script setup>
import {
    ref,
} from 'vue';
import {
    useCvCard,
} from '../../composables/cv-card';

const cardKey = 'CARDKEY';
const element = ref(null);
const mockId = 1;

const {
    resetEdit,
    openEdit,
    handleDelete,
    handleForbiddenDelete,
} = useCvCard({ cardKey, element });

</script>
<template>
    <div
        ref="element"
    >
        <button
            data-qa="edit button"
            @click="openEdit('')"
        >
            Bearbeiten
        </button>
        <button
            data-qa="delete"
            @click="handleDelete('', mockId)"
        >
            Löschen
        </button>
        <button
            data-qa="delete forbidden"
            @click="handleForbiddenDelete('', mockId)"
        >
            Löschen
        </button>
        <button
            data-qa="close button"
            @click="resetEdit"
        >
            Abbrechen
        </button>
    </div>
</template>
