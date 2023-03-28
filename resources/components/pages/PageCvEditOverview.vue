<script setup>
import {
    inject,
} from 'vue';
import AppIcon from '../atoms/app/AppIcon';
import AppTile from '../molecules/app/AppTile';
import LayoutFullscreen from '../layouts/LayoutFullscreen';
import TextHeadline from '../atoms/text/TextHeadline';

const router = inject('router');

async function close() {
    await router.push({ name: 'page-cv' });
}

</script>

<template>
    <LayoutFullscreen
        @close="close"
    >
        <template #headline>
            Bearbeiten
        </template>
        <div
            class="c-pageCvEditOverview"
        >
            <TextHeadline
                :level="1"
                size="2xl"
                class="c-pageCvEditOverview__headline"
            >
                Was möchtest du ändern?
            </TextHeadline>
            <TextHeadline
                :level="3"
                size="xl"
                class="c-pageCvEditOverview__subheading"
            >
                Wähle schnell ein passendes Lebenslauf-Design für deine Bewerbung
                oder ändere noch Angaben in deinem Lebenslauf.
            </TextHeadline>
            <div class="c-pageCvEditOverview__itemsWrap">
                <div
                    class="c-pageCvEditOverview__items"
                    data-qa="edit overview"
                >
                    <div class="c-pageCvEditOverview__item">
                        <AppTile
                            :to="{ name: 'page-cv-file-edit', params: { reset: true }}"
                            :highlighted="true"
                            class="c-pageCvEditOverview__tile"
                            data-qa="design edit tile"
                        >
                            <div class="c-pageCvEditOverview__tileContent">
                                <AppIcon
                                    class="c-pageCvEditOverview__tileIcon"
                                    name="bucket"
                                    size="3xl"
                                />
                                <TextHeadline
                                    :level="3"
                                    size="l"
                                    class="c-pageCvEditOverview__tileTitle"
                                >
                                    Design ändern
                                </TextHeadline>
                            </div>
                        </AppTile>
                    </div>
                    <div class="c-pageCvEditOverview__item">
                        <AppTile
                            :to="{ name: 'page-cv' }"
                            :highlighted="true"
                            class="c-pageCvEditOverview__tile"
                            data-qa="cv edit tile"
                        >
                            <div class="c-pageCvEditOverview__tileContent">
                                <AppIcon
                                    class="c-pageCvEditOverview__tileIcon"
                                    name="pen"
                                    size="3xl"
                                />
                                <TextHeadline
                                    :level="3"
                                    size="l"
                                    class="c-pageCvEditOverview__tileTitle"
                                >
                                    Lebenslauf bearbeiten
                                </TextHeadline>
                            </div>
                        </AppTile>
                    </div>
                </div>
            </div>
        </div>
    </LayoutFullscreen>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/layout';

// 1. IE horizontal alignment fix.
.c-pageCvEditOverview {
    @include wrap(math.div(5, 12));

    width: 100%; // 1

    &__headline,
    &__subheading {
        text-align: center;
    }

    &__headline {
        margin-top: $k-spacing--xl;
    }

    &__subheading {
        margin-top: $k-spacing--s;
        color: $k-color-gray--600;
    }

    &__itemsWrap {
        margin-top: $k-spacing--2xl;
    }

    &__items {
        @include k-layout($k-spacing--s, $k-spacing--s);
    }

    &__item {
        @include k-layout__item(math.div(12, 12));

        @media (min-width: $k-breakpoint--m) {
            @include k-layout__item(math.div(6, 12));
        }

        &:hover,
        &:focus {
            color: $k-color-green--800;
        }
    }

    &__tileContent {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 6em;
        text-align: center;
    }

    &__tileIcon {
        color: $k-color-primary--dark;
        transition: color 0.2s;

        .c-pageCvEditOverview__item:hover &,
        .c-pageCvEditOverview__item:focus & {
            color: $k-color-green--800;
        }
    }

    &__tileTitle {
        margin-top: $k-spacing--s;
        text-align: center;
    }
}
</style>
