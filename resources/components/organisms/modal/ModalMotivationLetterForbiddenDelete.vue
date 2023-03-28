<script setup>
import '../../../directives/debounce-click';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

defineProps({
    id: {
        required: true,
        type: String,
    },
});

// Exposing for unit test
defineExpose({ hide });
</script>

<template>
    <LayoutModal class="c-modalMotivationLetterForbiddenDelete">
        <template #headline>
            Löschen nicht möglich
        </template>
        <p data-qa="text default">
            Sorry, das hat nicht funktioniert.
            Deine Standard-Bewerbungsvorlage kann nicht gelöscht werden. Diese kannst du jederzeit anpassen.
        </p>
        <template #actions>
            <AppButton
                :to="{ name: 'page-motivation-letter-edit', params: { id }, }"
                data-qa="edit link"
            >
                Okay, verstanden
            </AppButton>
            <AppLink
                v-debounce-click
                tag="button"
                secondary
                data-qa="cancel button"
                @click="hide"
            >
                Abbrechen
            </AppLink>
        </template>
    </LayoutModal>
</template>
