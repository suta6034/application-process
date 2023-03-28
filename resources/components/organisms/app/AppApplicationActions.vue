<script setup>
import '../../../directives/debounce-click';
import AppButtonIconOnly from '../../atoms/app/AppButtonIconOnly';
import AppDropdown from '../../molecules/app/AppDropdown';
import DropdownApplicationsOptions from '../dropdown/applications/DropdownApplicationsOptions';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const props = defineProps({
    application: {
        type: Object,
        required: true,
    },
    hasCallbackBeforeDestroy: {
        type: Boolean,
        default: true,
    },
    hasRemove: {
        default: true,
        type: Boolean,
    },
    gaPrefix: {
        type: String,
    },
});

const emit = defineEmits(['remove', 'status', 'edit', 'memo', 'open-popover', 'open-modal-remove']);

const { SHOW_POPUP: showModal } = useMutations('popup');

function openStatusApplicationModal() {
    showModal({
        componentName: 'ModalApplicationsItemStatus',
        componentProps: {
            applicationId: props.application.id,
            status: props.application.status,
            statusDate: props.application.statusDate,
        },
    });
}

function openDeleteApplicationModal() {
    showModal({
        componentName: 'ModalApplicationsItemDelete',
        componentProps: {
            applicationId: props.application.id,
            hasCallbackBeforeDestroy: props.hasCallbackBeforeDestroy,
            confirmedCallback: () => emit('remove'),
        },
    });
}
</script>

<template>
    <AppDropdown
        v-if="application.isRejected === false"
        class="c-appApplicationActions"
    >
        <template #trigger>
            <AppButtonIconOnly
                icon="dots"
                size="l"
                aria-label="Optionen"
                class="c-appApplicationActions__button"
                data-qa="edit status"
                @click="emit('open-popover')"
            />
        </template>
        <template #default="{ close }">
            <DropdownApplicationsOptions
                :id="application.id"
                :has-remove="hasRemove"
                :has-memo="Boolean(application.memo)"
                :is-editable="application.isManual"
                :ga-prefix="gaPrefix"
                class="c-appApplicationActions__dropdown"
                @status="openStatusApplicationModal(); emit('status'); close()"
                @edit="emit('edit'); close()"
                @memo="emit('memo', $event); close()"
                @open-modal-remove="openDeleteApplicationModal(); emit('open-modal-remove'); close()"
            />
        </template>
    </AppDropdown>
    <AppButtonIconOnly
        v-else
        v-debounce-click
        icon="dustbin"
        size="xl"
        aria-label="Bewerbung löschen"
        class="c-appApplicationActions"
        data-qa="delete button"
        @click.prevent="openDeleteApplicationModal(application)"
    />
</template>

<style lang="scss">
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/z-index';

.c-appApplicationActions {
    $status-form-width: 15.5rem;
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
