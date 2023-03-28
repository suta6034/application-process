<script setup>
import {
    computed,
} from 'vue';

import NavHorizontalOverflow from './NavHorizontalOverflow';
import {
    useState,
} from '../../../composables/vuex-helpers';

const {
    messages: messagesHasNotification,
    cv: statsHasNotification,
} = useState('notification');

const items = computed(() => ([
    {
        id: 'dashboard',
        name: 'Übersicht',
        tag: 'router-link',
        to: { name: 'page-dashboard' },
        trackingName: 'Dashboard',
    },
    {
        id: 'cv',
        name: 'Lebenslauf',
        tag: 'router-link',
        to: { name: 'page-cv' },
        trackingName: 'Profile',
    },
    {
        id: 'stats',
        name: 'Aufrufe',
        notification: statsHasNotification.value && {
            label: 'Dein Lebenslauf wurde aufgerufen',
        },
        tag: 'router-link',
        to: { name: 'page-views' },
        trackingName: 'Profile Views',
    },
    {
        id: 'messages',
        name: 'Nachrichten',
        notification: messagesHasNotification.value && {
            label: 'Du hast neue Nachrichten',
        },
        tag: 'router-link',
        to: { name: 'page-conversations' },
        trackingName: 'Messages',
    },
    {
        id: 'applications',
        name: 'Bewerbungen',
        tag: 'router-link',
        to: { name: 'page-applications' },
        trackingName: 'Applications',
    },
    /*
    {
        id: 'motivation-letter',
        name: 'Bewerbungsschreiben',
        tag: 'router-link',
        to: { name: 'page-motivation-letters' },
    },
     */
]));

const emit = defineEmits(['click-link']);
</script>

<template>
    <NavHorizontalOverflow
        :items="items"
        is-centered
        is-sticky
        data-qa="sub navigation"
        @click-link="emit('click-link', $event)"
    />
</template>
