<script setup>
import {
    CATEGORIES,
} from '../../../../utils/tracking';

import AppIcon from '../../../atoms/app/AppIcon';
import AppLink from '../../../atoms/app/AppLink';
import {
    useTrackClick,
} from '../../../../composables/track-click';

defineProps({
    id: {
        required: true,
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});
/* istanbul ignore next: Just for tracking */
const { trackClick } = useTrackClick(CATEGORIES.page.motivationLetter);

const emit = defineEmits(['set-as-default', 'remove']);
</script>

<template>
    <div class="c-dropdownMotivationLetterOptions">
        <AppLink
            :to="{ name: 'page-motivation-letter-edit', params: { id } }"
            class="c-dropdownMotivationLetterOptions__link"
            mixed
            data-qa="edit button"
            @click.native="trackClick('application-letter-edit-template')"
        >
            <template #icon>
                <AppIcon
                    name="pen"
                    class="u-gray-hover-green c-dropdownMotivationLetterOptions__linkIcon"
                    size="l"
                    fixed-width
                />
            </template><!--
            prevent whitespace characters at hover state
            -->Vorlage bearbeiten
        </AppLink>
        <AppLink
            v-if="!isDefault"
            tag="button"
            class="c-dropdownMotivationLetterOptions__link"
            mixed
            data-qa="set as default button"
            @click="emit('set-as-default');trackClick('application-letter-mark-default')"
        >
            <template #icon>
                <AppIcon
                    name="bookmark"
                    class="u-gray-hover-green c-dropdownMotivationLetterOptions__linkIcon"
                    size="l"
                    fixed-width
                />
            </template><!--
            prevent whitespace characters at hover state
            -->Als Standard markieren
        </AppLink>
        <AppLink
            tag="button"
            class="c-dropdownMotivationLetterOptions__link c-dropdownMotivationLetterOptions__delete"
            secondary
            data-qa="delete button"
            @click="emit('remove');trackClick('application-letter-delete-template')"
        >
            Vorlage löschen
        </AppLink>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

.c-dropdownMotivationLetterOptions {
    $root: &;

    &__link {
        display: block;

        &:not(:first-child, :last-child) {
            margin-top: $k-spacing--s;
        }

        &:hover,
        &:focus {
            #{$root}__linkIcon {
                color: $k-c-link-color-hover;
            }
        }
    }

    &__linkIcon {
        color: $k-color-gray--600;
    }

    &__delete {
        margin-top: $k-spacing--xl;
    }
}
</style>
