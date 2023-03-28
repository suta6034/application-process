<script setup>
import {
    ref,
} from 'vue';

import {
    CATEGORIES,
} from '../../../utils/tracking';
import {
    useBreakpoints,
} from '../../../composables/breakpoint';

import categories from '../../../data/motivation-letter-assembly-kit.json';

import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import AppInfoBox from '../../molecules/app/AppInfoBox';
import AppMotivationLetterAssemblyKitAccordion from './AppMotivationLetterAssemblyKitAccordion';
import AppPill from '../../atoms/app/AppPill';
import AppStack from './AppStack';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useTrackClick,
} from '../../../composables/track-click';
import {
    showSnackbar,
} from '../../../utils/snackbar';

const emit = defineEmits(['insert']);

const { isMediumScreen } = useBreakpoints();
const activeItem = ref(isMediumScreen.value ? categories[0].label : null);
const infoboxVisible = ref(true);

/* istanbul ignore next */
const { trackClick } = useTrackClick(CATEGORIES.page.motivationLetter);

function close() {
    infoboxVisible.value = false;
}

async function copyTextToClipboard(text) {
    await navigator.clipboard.writeText(text);
    showSnackbar({
        text: 'In Zwischenablage kopiert',
    });
}

function setActiveItem(label) {
    activeItem.value = label;
}
</script>

<template>
    <AppStack
        gap="xl"
        class="c-appMotivationLetterAssemblyKit"
    >
        <AppStack>
            <TextHeadline
                :level="2"
                bold
            >
                Textbausteine einfügen
            </TextHeadline>
            <AppInfoBox
                v-if="infoboxVisible"
                hint
                data-qa="infobox"
            >
                Die Textbausteine kannst du beliebig anpassen.
                <template
                    #suffix
                >
                    <AppIcon
                        name="cross"
                        size="m"
                        class="c-appMotivationLetterAssemblyKit__icon"
                        data-qa="close infobox"
                        @click.native="close(); trackClick('application-letter-close-infobox')"
                    />
                </template>
            </AppInfoBox>
            <AppStack
                tag="ul"
                gap="s"
                direction="row"
                :class="{'c-appMotivationLetterAssemblyKit__infobox': infoboxVisible}"
            >
                <!--Accessibility Hack: Because the AppPill is not able to native perform the tab actions.
                Gets resolved in KSPECK-3976, when the Pill becomes a dynamic Component-->
                <li
                    v-for="category in categories"
                    :key="category.label"
                    tabindex="0"
                    @keydown.enter="setActiveItem(category.label)"
                    @keydown.space="setActiveItem(category.label)"
                >
                    <AppPill
                        outline
                        :status="activeItem === category.label ? 'active' : undefined"
                        :data-qa="`tab ${category.label}`"
                        @click.native="setActiveItem(category.label)"
                    >
                        {{ category.label }}
                    </AppPill>
                </li>
            </AppStack>
        </AppStack>
        <template v-for="category in categories">
            <AppStack
                v-if="activeItem === category.label"
                :key="category.label"
                :data-qa="`tab-content ${category.label}`"
                tag="ul"
                gap="xs"
            >
                <li
                    v-for="(subCategory, index) in category.subCategories"
                    :key="subCategory.label"
                >
                    <AppMotivationLetterAssemblyKitAccordion
                        :is-active-initially="index === 0 && category.label !== 'Hauptteil'"
                        :label="subCategory.label"
                        :items="subCategory.items"
                    >
                        <template
                            v-if="category.label === 'Intelligente Felder'"
                            #infobox
                        >
                            <AppInfoBox
                                hint
                                class="c-appMotivationLetterAssemblyKit__infobox"
                            >
                                Diese Felder werden später im Bewerbungsformular
                                automatisch mit den korrekten Daten befüllt.
                            </AppInfoBox>
                        </template>
                        <template #item="{ text, label, tracking }">
                            <template v-if="label">
                                <AppLink
                                    v-if="isMediumScreen"
                                    neutral
                                    icon-dynamic
                                    tag="button"
                                    data-qa="insert text placeholder"
                                    class="c-appMotivationLetterAssemblyKit__item"
                                    @click="emit('insert', text); trackClick(tracking)"
                                >
                                    <template #icon>
                                        <AppIcon name="plus"/>
                                    </template>
                                    {{ label }} einfügen
                                </AppLink>
                                <AppLink
                                    v-else
                                    mixed
                                    icon-dynamic
                                    tag="button"
                                    data-qa="copy text placeholder"
                                    @click="copyTextToClipboard(text); trackClick(tracking)"
                                >
                                    <template #icon>
                                        <AppIcon
                                            name="two-documents"
                                            size="l"
                                        />
                                    </template>
                                    {{ label }} kopieren
                                </AppLink>
                            </template>
                            <AppStack
                                v-else
                                gap="s"
                            >
                                <p>{{ text }}</p>
                                <AppLink
                                    v-if="isMediumScreen"
                                    icon-dynamic
                                    tag="button"
                                    data-qa="insert text template"
                                    @click="emit('insert', text); trackClick(tracking)"
                                >
                                    <template #icon>
                                        <AppIcon name="plus"/>
                                    </template>
                                    An Textposition einfügen
                                </AppLink>
                                <AppLink
                                    v-else
                                    icon-dynamic
                                    tag="button"
                                    data-qa="copy text template"
                                    @click="copyTextToClipboard(text); trackClick(tracking)"
                                >
                                    <template #icon>
                                        <AppIcon
                                            name="two-documents"
                                            size="l"
                                        />
                                    </template>
                                    Text kopieren
                                </AppLink>
                            </AppStack>
                        </template>
                    </AppMotivationLetterAssemblyKitAccordion>
                </li>
            </AppStack>
        </template>
    </AppStack>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appMotivationLetterAssemblyKit {
    &__icon {
        &:hover,
        &:focus {
            color: $k-color-gray--900;
        }
    }

    &__infobox {
        margin-top: $k-spacing--xs;
    }

    &__item {
        text-align: left;
    }
}
</style>
