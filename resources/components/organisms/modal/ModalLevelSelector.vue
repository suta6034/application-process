<script setup>
import {
    inject,
} from 'vue';
import {
    AdaptedOption,
} from '../../../utils/AdaptedOption';
import FormPillSelect from '../../molecules/form/FormPillSelect';
import LayoutModal from '../../layouts/LayoutModal';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const props = defineProps({
    adaptedOption: {
        type: AdaptedOption,
        required: true,
    },
    levels: {
        type: Array,
        required: true,
    },
    mutation: {
        type: String,
        required: true,
    },
});

const store = inject('store');

function updateLevel(level) {
    store.commit(props.mutation, {
        label: props.adaptedOption?.label,
        levelId: level.id,
    });
    hide();
}

// Exposing for unit test
defineExpose({ updateLevel });
</script>

<template>
    <LayoutModal class="c-modalLevelSelector">
        <template #headline>
            Wie gut kannst du {{ adaptedOption.label }}?
        </template>

        <template #actions>
            <div
                class="c-modalLevelSelector__pillSelectWrap"
                data-qa="pill select wrap"
            >
                <FormPillSelect
                    type="checkbox"
                    :options="levels"
                    :centered="true"
                    data-qa="levels"
                    @change="updateLevel"
                />
            </div>
        </template>
    </LayoutModal>
</template>

<style lang="scss">
.c-modalLevelSelector {
    // 1. Make sure there are at least two rows of pills.
    &__pillSelectWrap {
        margin-right: auto;
        margin-left: auto;
        max-width: 20em; // 1
    }
}
</style>
