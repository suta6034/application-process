<script setup>
import {
    ref,
} from 'vue';

import AppBadge from '../../../atoms/app/AppBadge';
import AppButtonIconOnly from '../../../atoms/app/AppButtonIconOnly';
import AppButtonUnstyled from '../../../atoms/app/AppButtonUnstyled';
import AppCard from '../../../molecules/app/AppCard';
import AppCvItem from '../../app/AppCvItem';
import AppIcon from '../../../atoms/app/AppIcon';
import AppPill from '../../../atoms/app/AppPill';
import FormCvSkill from '../../form/cv/FormCvSkill';
import TextHeadline from '../../../atoms/text/TextHeadline';
import {
    useCvPills,
} from '../../../../composables/cv-pills';
import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const cardKey = 'SKILLS';
const element = ref(null);
const {
    resetEditAndScroll,
    openEdit,
    activeForm,
} = useCvCard({ cardKey, element });

const {
    prepareLevelPillsArray,
} = useCvPills();

const {
    rows: skills,
} = useState('profile/skill');
</script>

<template>
    <AppCard
        ref="element"
        class="c-cardCvSkills"
        data-qa="skills card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
                :class="{ 'k-o-media__body': skills && skills.length }"
            >
                Kenntnisse
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="skills && skills.length"
                    data-qa="counter"
                >
                    {{ skills.length }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppButtonIconOnly
                v-if="skills && skills.length && activeForm !== cardKey"
                size="xl"
                icon="pen"
                aria-label="Bearbeiten"
                data-qa="edit skills"
                data-gtm-element="PR_L: Skills"
                data-gtm-element-detail="Edit"
                @click="openEdit('profile-list-skills-edit')"
            />
        </template>
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
        <div
            data-gtm-element="PR_L: Skills"
            data-gtm-element-detail="Edit"
            @click="openEdit('profile-list-skills-edit')"
        >
            <ul
                v-if="skills && skills.length && activeForm !== cardKey"
                class="c-cardCvSkills__pillList"
                data-qa="skill pills"
            >
                <li
                    v-for="skill in prepareLevelPillsArray(skills, 5)"
                    :key="skill.id"
                    class="c-cardCvSkills__pillListItem"
                    data-qa="pill list item"
                >
                    <AppPill
                        :label="skill.label"
                        :label-definition="skill.level"
                        status="checked"
                        class="c-cardCvSkills__pill"
                        :data-qa="skill.qa"
                    />
                </li>
            </ul>
        </div>
        <AppCvItem
            v-if="skills.length === 0 && activeForm !== cardKey"
            empty-state
            data-qa="empty state"
            data-gtm-element="PR_L: Skills"
            data-gtm-element-detail="Add"
            @click.native="openEdit('profile-list-skills-add')"
        >
            <template #figure>
                <AppIcon
                    name="plus"
                    size="2xl"
                    data-qa="add skills"
                />
            </template>
            <template #headline>
                <AppButtonUnstyled>
                    Kenntnisse hinzufügen
                </AppButtonUnstyled>
            </template>
            <template #snippet>
                Vervollständigt dein Profil um 15%
            </template>
        </AppCvItem>
        <FormCvSkill
            v-if="activeForm === cardKey"
            class="c-cardCvSkills__form"
            @closeEdit="resetEditAndScroll"
        />
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

.c-cardCvSkills {
    &__pillList {
        display: flex;
        flex-wrap: wrap;
        margin-top: -$k-spacing--s;
    }

    &__pillListItem {
        max-width: 100%;
    }

    &__pill {
        margin-top: $k-spacing--s;
        margin-right: $k-spacing--xs;
    }

    &__form {
        padding-bottom: $k-spacing--xl;
    }
}
</style>
