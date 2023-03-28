<script setup>
import {
    inject,
} from 'vue';
import mitt from '../../../utils/mitt';

import AppButton from '../../atoms/app/AppButton';
import AppLink from '../../atoms/app/AppLink';
import LayoutModal from '../../layouts/LayoutModal';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const { HIDE_POPUP: hide } = useMutations('popup');

const router = inject('router');

const emit = defineEmits(['confirm']);

defineProps({
    email: {
        type: String,
        required: true,
    },
});

function decline() {
    mitt.emit('modal-profile-exists-decline');
    hide();
}

</script>

<template>
    <LayoutModal
        v-track-visibility="{ element: 'PROFILE: CREATE', elementDetail: 'Profile Exists Modal'}"
        class="c-modalProfileExists"
    >
        <template #headline>
            Anmelden und loslegen!
        </template>
        <p>
            Möchtest du dich gleich mit deinem karriere.at User einloggen?
            Dann kann's sofort weitergehen!
        </p>
        <template #actions>
            <!-- eslint-disable vuejs-accessibility/no-autofocus -->
            <AppButton
                :to="{
                    name: 'login',
                    query: {
                        email: email,
                        redirectUrl: router.resolve({ name: 'page-cv' }).href,
                    },
                }"
                autofocus
                data-qa="modal confirm button"
                @click="emit('confirm')"
            >
                Jetzt anmelden
            </AppButton>
            <!-- eslint-enable vuejs-accessibility/no-autofocus -->
            <AppLink
                tag="button"
                class="c-modalProfileExists__decline"
                data-qa="decline button"
                @click="decline"
            >
                Andere E-Mail-Adresse verwenden
            </AppLink>
        </template>
    </LayoutModal>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/components/link/index';

.c-modalProfileExists {
    &__decline {
        margin-top: $k-spacing--m;
    }
}
</style>
