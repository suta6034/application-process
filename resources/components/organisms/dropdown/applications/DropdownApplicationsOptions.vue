<script setup>
import AppIcon from '../../../atoms/app/AppIcon';
import AppLink from '../../../atoms/app/AppLink';

defineProps({
    id: {
        required: true,
        type: String,
    },
    isEditable: {
        type: Boolean,
        default: false,
    },
    hasMemo: {
        type: Boolean,
        default: false,
    },
    hasRemove: {
        default: true,
        type: Boolean,
    },
    gaPrefix: {
        type: String,
    },
});
const emit = defineEmits(['edit', 'memo', 'open-modal-remove']);
</script>

<template>
    <div class="c-dropdownApplicationsOptions">
        <AppLink
            tag="button"
            class="c-dropdownApplicationsOptions__link"
            mixed
            data-qa="status button"
            :data-gtm-element="gaPrefix ? `${gaPrefix}: Application State` : undefined"
            :data-gtm-element-detail="gaPrefix ? 'Edit' : undefined"
            @click="emit('status')"
        >
            <template #icon>
                <AppIcon
                    name="tag"
                    class="u-gray-hover-green c-dropdownApplicationsOptions__linkIcon"
                    size="l"
                    fixed-width
                />
            </template><!--
            prevent whitespace characters at hover state
            -->Status bearbeiten
        </AppLink>
        <AppLink
            v-if="isEditable"
            :to="{ name: 'page-application-edit', params: { id } }"
            class="c-dropdownApplicationsOptions__link"
            mixed
            data-qa="edit button"
            :data-gtm-element="gaPrefix ? `${gaPrefix}: Manual Application` : undefined"
            :data-gtm-element-detail="gaPrefix ? 'Edit' : undefined"
            @click.native="emit('edit')"
        >
            <template #icon>
                <AppIcon
                    name="pen"
                    class="u-gray-hover-green c-dropdownApplicationsOptions__linkIcon"
                    size="l"
                    fixed-width
                />
            </template><!--
            prevent whitespace characters at hover state
            -->Bewerbung bearbeiten
        </AppLink>
        <AppLink
            tag="button"
            class="c-dropdownApplicationsOptions__link"
            mixed
            data-qa="memo button"
            :data-gtm-element="gaPrefix ? `${gaPrefix}: Note` : undefined"
            :data-gtm-element-detail="gaPrefix ? 'Edit' : undefined"
            @click="emit('memo', hasMemo ? 'edit' : 'add')"
        >
            <template #icon>
                <AppIcon
                    name="notepad"
                    class="u-gray-hover-green c-dropdownApplicationsOptions__linkIcon"
                    size="l"
                    fixed-width
                />
            </template>
            <template v-if="hasMemo">
                Notiz bearbeiten
            </template>
            <template v-else>
                Notiz schreiben
            </template>
        </AppLink>
        <AppLink
            v-if="hasRemove && isEditable"
            class="c-dropdownApplicationsOptions__link c-dropdownApplicationsOptions__delete"
            secondary
            tag="button"
            data-qa="delete button"
            :data-gtm-element="gaPrefix ? `${gaPrefix}: Manual Application` : undefined"
            :data-gtm-element-detail="gaPrefix ? 'Delete - Click' : undefined"
            @click="emit('open-modal-remove')"
        >
            Bewerbung löschen
        </AppLink>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

.c-dropdownApplicationsOptions {
    $root: &;

    top: 25px;

    &__link {
        display: block;

        &:not(:first-child) {
            margin-top: $k-spacing--s;
        }

        &:hover,
        &:focus {
            #{$root}__linkIcon {
                color: $k-c-link-color-hover;
            }
        }

        &#{$root}__delete {
            margin-top: $k-spacing--xl;
        }
    }

    &__linkIcon {
        color: $k-color-gray--600;
    }
}
</style>
