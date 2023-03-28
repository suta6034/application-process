<script setup>
/* istanbul ignore file */
import {
    onBeforeMount, onMounted, inject, watchEffect,
} from 'vue';
import {
    ACTIONS,
    CATEGORIES,
    LABELS,
    track,
} from '../../utils/tracking';
import * as authService from '../../services/auth';

import LayoutMinimal from '../layouts/LayoutMinimal';
import NavProgressTracker from '../molecules/nav/NavProgressTracker';
import {
    useActions, useMutations, useState,
} from '../../composables/vuex-helpers';

const router = inject('router');
const {
    exists: profileExists,
} = useState('profile');
const {
    SET_ORIGIN: setOrigin,
} = useMutations('profileCreate/origin');
const {
    FETCH_PROFILE: fetchProfile,
} = useActions('profile');

const steps = [
    {
        name: 'Vorlage wählen',
        key: 'TEMPLATE',
        locked: false,
        completed: false,
        routerName: 'slider-cv-templates',
    },
    {
        name: 'Daten eingeben',
        key: 'DATA',
        locked: false,
        completed: false,
        routerName: 'form-profile-create-onepage',
    },
];

onBeforeMount(async () => {
    if (await authService.isUserLoggedIn()) fetchProfile();
});

onMounted(() => {
    setOrigin('TEMPLATE_MANUAL');

    track({
        category: CATEGORIES.page.profileCreate,
        action: ACTIONS.cvCreate,
        label: LABELS.evaluate,
    });
});

watchEffect(() => {
    if (profileExists.value) router.push({ name: 'page-cv' });
});
</script>

<template>
    <LayoutMinimal>
        <div class="c-pageProfileCreateTemplate">
            <div class="c-pageProfileCreateTemplate__progressTracker">
                <NavProgressTracker
                    :steps="steps"
                    data-qa="progress tracker"
                />
            </div>
            <router-view/>
        </div>
    </LayoutMinimal>
</template>

<style lang="scss">
@import '../../assets/scss/settings/spacing';

.c-pageProfileCreateTemplate {
    padding-top: $k-spacing--xl;

    &__progressTracker {
        text-align: center;
    }
}
</style>
