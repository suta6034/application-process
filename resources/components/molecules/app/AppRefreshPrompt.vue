<script setup>
import AppCupcake from '../../atoms/app/AppCupcake';
import AppLink from '../../atoms/app/AppLink';
import IllustrationReload from '../../illustrations/IllustrationReload';

defineProps({
    fetch: {
        required: true,
        type: Function,
    },
});
</script>

<template>
    <AppCupcake class="c-appRefreshPrompt">
        <template #cherry>
            <IllustrationReload @click.native="fetch"/>
        </template>
        <p>
            Dieser Inhalt kann gerade nicht angezeigt werden – bitte
            lade die Seite neu oder klicke auf „Jetzt neu laden“.
        </p>
        <template #action>
            <AppLink
                tag="button"
                data-qa="reload"
                @click="fetch"
            >
                Jetzt neu laden
            </AppLink>
        </template>
    </AppCupcake>
</template>
