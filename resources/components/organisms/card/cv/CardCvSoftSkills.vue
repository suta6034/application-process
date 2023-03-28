<script setup>
import {
    ref,
} from 'vue';
import AppButtonIconOnly from '../../../atoms/app/AppButtonIconOnly';
import AppCard from '../../../molecules/app/AppCard';
import AppCvItem from '../../app/AppCvItem';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import FormCvSoftSkills from '../../form/cv/FormCvSoftSkills';
import TextHeadline from '../../../atoms/text/TextHeadline';

import AppPill from '../../../atoms/app/AppPill';
import {
    useSoftSkills,
} from '../../../../composables/resource-soft-skills';
import {
    useCvPills,
} from '../../../../composables/cv-pills';
import {
    useCvCard,
} from '../../../../composables/cv-card';

const MAX_ELEMENTS = 3;

const {
    softSkillGroups,
    activeSoftSkillsInGroup,
    getSoftSkillGroupDescriptionName,
    hasActiveSoftSkillsInGroup,
    emptySoftSkillGroupsCount,
    hasEmptySoftSkillGroups,
} = useSoftSkills();

const cardKey = 'SOFTSKILLS';
const element = ref(null);

const {
    isInEditMode,
    resetEditAndScroll,
    openEdit,
} = useCvCard({ cardKey, element });

const {
    addMorePill,
} = useCvPills();

const activeSoftSkillsInGroupWithPills = (group) => {
    const activeItems = activeSoftSkillsInGroup(group);

    return activeItems.length > MAX_ELEMENTS
        ? addMorePill(activeItems, MAX_ELEMENTS)
        : activeItems;
};

// Exposing for unit test
defineExpose({ openEdit });
</script>

<template>
    <AppCard
        ref="element"
        class="c-cardCvSoftSkills"
        data-qa="softSkills card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
            >
                Soft Skills und Werte
            </TextHeadline>
        </template>
        <AppInfoBox
            v-if="hasEmptySoftSkillGroups"
            class="c-cardCvSoftSkills__infoBox"
            data-qa="info box"
        >
            {{ emptySoftSkillGroupsCount }} von {{ softSkillGroups.length }}
            Kategorien fehlen noch.
            Erhöhe deine Chance auf ein Bewerbungsgespräch um 60 % mit der Angabe deiner Soft Skills und Werte.
        </AppInfoBox>

        <template v-for="group in softSkillGroups">
            <AppCvItem
                :key="group.id"
                :has-figure="false"
                class="c-cardCvSoftSkills__appCvItem"
                data-gtm-element="PR_L: Soft Skills"
                data-gtm-element-detail="Edit"
                @selected="openEdit('profile-list-soft-skills-edit', parseInt(group.id, 10), true)"
            >
                <template #headline>
                    {{ group.label }}
                </template>

                <template #snippet>
                    <template
                        v-if="!hasActiveSoftSkillsInGroup(group) && !isInEditMode(parseInt(group.id, 10))"
                    >
                        Du hast deine {{ getSoftSkillGroupDescriptionName(group.id) }}
                        noch nicht eingetragen.
                    </template>
                    <template
                        v-else-if="!isInEditMode(parseInt(group.id, 10))"
                    >
                        <div
                            class="c-cardCvSoftSkills__pillList"
                            data-qa="soft skill list"
                        >
                            <AppPill
                                v-for="item in activeSoftSkillsInGroupWithPills(group)"
                                :key="item.id"
                                :label="item.label"
                                class="c-cardCvSoftSkills__pill"
                                data-qa="soft skill"
                            />
                        </div>
                    </template>
                </template>
                <template #action>
                    <AppButtonIconOnly
                        v-if="!hasActiveSoftSkillsInGroup(group) && !isInEditMode(parseInt(group.id, 10))"
                        class="c-cardCvSoftSkills__appCvItemAddIcon"
                        size="l"
                        icon="plus"
                        aria-label="Hinzufügen"
                        data-qa="add softSkills"
                        data-gtm-element="PR_L: Soft Skills"
                        data-gtm-element-detail="Add"
                        @click.native="openEdit('profile-list-soft-skills-add', parseInt(group.id, 10), true)"
                    />
                    <AppButtonIconOnly
                        v-else-if="!isInEditMode(parseInt(group.id, 10))"
                        class="c-cardCvSoftSkills__appCvItemEditIcon"
                        size="l"
                        icon="pen"
                        aria-label="Edit"
                        data-qa="edit softSkills"
                        data-gtm-element="PR_L: Soft Skills"
                        data-gtm-element-detail="Edit"
                        @click.native="openEdit('profile-list-soft-skills-edit', parseInt(group.id, 10), true)"
                    />
                </template>
                <template #form>
                    <FormCvSoftSkills
                        v-if="isInEditMode(parseInt(group.id, 10))"
                        :id="parseInt(group.id, 10)"
                        :items="group.items"
                        data-qa="new form"
                        @closeEdit="resetEditAndScroll"
                    />
                </template>
            </AppCvItem>
        </template>
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/objects/ladder/mixins';

.c-cardCvSoftSkills {
    &__infoBox {
        margin-bottom: $k-spacing--xl;
    }

    &__categoryHeader {
        display: flex;
        justify-content: space-between;
    }

    &__appCvItem {
        @include k-o-ladder__rung($k-spacing--xl);
    }

    &__appCvItemAddIcon,
    &__appCvItemEditIcon {
        color: $k-color-green--700;
    }

    &__pillList {
        display: flex;
        column-gap: $k-spacing--xs;
        row-gap: $k-spacing--s;
        flex-wrap: wrap;
        margin-top: $k-spacing--l;
    }
}
</style>
