<script setup>
import AppCollapseBox from '../../molecules/app/AppCollapseBox';
import IllustrationMinitaskSuccess from '../../illustrations/IllustrationMinitaskSuccess';

const emit = defineEmits(['hide']);
</script>

<template>
    <AppCollapseBox
        closeable
        @hide="emit('hide')"
    >
        <template #media>
            <IllustrationMinitaskSuccess data-qa="illustration"/>
        </template>
        <template #headline>
            Danke für deine Eingabe.
        </template>
        <template #content>
            Du kannst deinen Lebenslauf jederzeit einfach vervollständigen.
        </template>
    </AppCollapseBox>
</template>
