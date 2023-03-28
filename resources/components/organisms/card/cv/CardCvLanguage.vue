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
import FormCvLanguage from '../../form/cv/FormCvLanguage';
import TextHeadline from '../../../atoms/text/TextHeadline';
import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useCvPills,
} from '../../../../composables/cv-pills';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const cardKey = 'LANGUAGE';
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
    rows: languages,
} = useState('profile/language');
</script>

<template>
    <AppCard
        ref="element"
        class="c-cardCvLanguage"
        data-qa="language card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
                :class="{ 'k-o-media__body': languages && languages.length }"
            >
                Sprachen
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="languages && languages.length"
                    data-qa="counter"
                >
                    {{ languages.length }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppButtonIconOnly
                v-if="languages && languages.length && activeForm !== cardKey"
                size="xl"
                icon="pen"
                aria-label="Bearbeiten"
                data-qa="edit languages"
                data-gtm-element="PR_L: Language"
                data-gtm-element-detail="Edit"
                @click="openEdit('profile-list-language-edit')"
            />
        </template>
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
        <div
            v-if="activeForm !== cardKey && languages && languages.length"
            data-gtm-element="PR_L: Language"
            data-gtm-element-detail="Edit"
            @click="openEdit('profile-list-language-edit')"
        >
            <ul
                class="c-cardCvLanguage__pillList"
                data-qa="languages pills"
            >
                <li
                    v-for="language in prepareLevelPillsArray(languages, 5)"
                    :key="language.id"
                    class="c-cardCvLanguage__pillListItem"
                    data-qa="pill list item"
                >
                    <AppPill
                        :label="language.label"
                        :label-definition="language.level"
                        status="checked"
                        class="c-cardCvLanguage__pill"
                        :data-qa="language.qa"
                    />
                </li>
            </ul>
        </div>
        <AppCvItem
            v-if="languages.length === 0 && activeForm !== cardKey"
            empty-state
            data-qa="empty state"
            data-gtm-element="PR_L: Language"
            data-gtm-element-detail="Add"
            @click.native="openEdit('profile-list-language-add')"
        >
            <template #figure>
                <AppIcon
                    name="plus"
                    size="2xl"
                    data-qa="add language"
                />
            </template>
            <template #headline>
                <AppButtonUnstyled>
                    Sprachen hinzufügen
                </AppButtonUnstyled>
            </template>
            <template #snippet>
                Vervollständigt dein Profil um 10%
            </template>
        </AppCvItem>
        <FormCvLanguage
            v-if="activeForm === cardKey"
            class="c-cardCvLanguage__form"
            data-qa="language form"
            @closeEdit="resetEditAndScroll"
        />
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

.c-cardCvLanguage {
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
