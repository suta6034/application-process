<script setup>
import AppButtonIconOnly from '../../atoms/app/AppButtonIconOnly';
import AppDropdown from '../../molecules/app/AppDropdown';
import DropdownMotivationLetterOptions from '../dropdown/applications/DropdownMotivationLetterOptions';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const props = defineProps({
    id: {
        required: true,
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['remove', 'open', 'set-as-default']);

const { SHOW_POPUP: showModal } = useMutations('popup');

function openDeleteModal() {
    if (props.isDefault) {
        showModal({
            componentName: 'ModalMotivationLetterForbiddenDelete',
            componentProps: {
                id: props.id,
            },
        });
        return;
    }

    showModal({
        componentName: 'ModalMotivationLetterDelete',
        componentProps: {
            id: props.id,
            confirmedCallback: () => emit('remove'),
        },
    });
}
</script>

<template>
    <AppDropdown class="c-appMotivationLetterActions">
        <template #trigger>
            <AppButtonIconOnly
                icon="dots"
                size="l"
                aria-label="Optionen"
                class="c-appMotivationLetterActions__button"
                data-qa="options"
                @click="emit('open')"
            />
        </template>
        <template #default="{ close }">
            <DropdownMotivationLetterOptions
                :id="id"
                :is-default="isDefault"
                class="c-appMotivationLetterActions__dropdown"
                @set-as-default="emit('set-as-default'); close()"
                @remove="openDeleteModal(); close()"
            />
        </template>
    </AppDropdown>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/z-index';

.c-appMotivationLetterActions {
    // 1. TODO: width of dropdown should be defined by the content (currently length of "Als Standard markieren ") 🫣
    $status-form-width: 15.8rem; // 1.
    $dropdown-top-position: 1.5rem;

    position: relative;

    &__button {
        &:focus,
        &:active {
            color: $k-color-green--800;
        }
    }

    &__dropdown {
        position: absolute;
        top: $dropdown-top-position;
        right: 0;
        z-index: $z-index-dropdown;
        padding: $k-spacing--xl;
        width: $status-form-width;
        border-radius: $k-border-radius--s;
        background: $k-color-white;
        box-shadow: 0 0 $k-spacing--s rgba($k-color-gray--900, 0.2);
    }
}
</style>
