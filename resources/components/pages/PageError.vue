<script setup>
import {
    onBeforeMount, ref,
} from 'vue';
import * as authService from '../../services/auth';

import AppLink from '../atoms/app/AppLink';
import LayoutDefault from '../layouts/LayoutDefault';
import TextHeadline from '../atoms/text/TextHeadline';

defineProps({
    headline: {
        type: String,
        default: 'Oh-oh, Es ist ein Fehler aufgetreten.',
    },
    text: {
        type: String,
        default: 'Unsere Programmierer werden dafür mit dem Entzug von lustigen Katzenvideos bestraft. Versprochen.',
    },
    linkText: {
        type: String,
        default: 'Zurück zum Dashboard',
    },
    to: {
        type: String,
        default: 'page-dashboard',
    },
});

const authenticated = ref(false);

onBeforeMount(async () => {
    authenticated.value = await authService.isUserLoggedIn();
});
</script>

<template>
    <LayoutDefault>
        <div class="c-pageError">
            <TextHeadline
                class="c-pageError__headline"
                :level="1"
                size="l"
                bold
            >
                {{ headline }}
            </TextHeadline>
            <p class="c-pageError__text">
                {{ text }}
            </p>
            <AppLink
                v-if="authenticated"
                class="c-pageError__link"
                :to="{ name: to }"
                data-qa="back to dashboard"
            >
                {{ linkText }}
            </AppLink>
            <AppLink
                v-else
                class="c-pageError__link"
                href="https://www.karriere.at/"
                data-qa="back home"
            >
                Zur Startseite
            </AppLink>
        </div>
    </LayoutDefault>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/tools/wrap';
@import '../../assets/scss/settings/spacing';

.c-pageError {
    @include wrap(math.div(5, 12));

    padding-top: $k-spacing--3xl;
    padding-bottom: $k-spacing--5xl;
    text-align: center;

    &__headline {
        margin-top: $k-spacing--l;
    }

    &__text {
        margin-top: $k-spacing--xs;
    }

    &__link {
        display: block;
        margin-top: $k-spacing--m;
    }
}
</style>
