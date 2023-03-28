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
import FormCvInterests from '../../form/cv/FormCvInterests';
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

const cardKey = 'INTERESTS';
const element = ref(null);
const {
    resetEditAndScroll,
    openEdit,
    activeForm,
} = useCvCard({ cardKey, element });

const {
    preparePillsArray,
} = useCvPills();

const {
    rows: interests,
} = useState('profile/interest');
</script>

<template>
    <AppCard
        ref="element"
        class="c-cardCvInterests"
        data-qa="interests card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
                :class="{ 'k-o-media__body': interests && interests.length }"
            >
                Interessen
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="interests && interests.length"
                    data-qa="counter"
                >
                    {{ interests.length }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppButtonIconOnly
                v-if="interests && interests.length && activeForm !== cardKey"
                size="xl"
                icon="pen"
                aria-label="Bearbeiten"
                data-qa="edit interests"
                data-gtm-element="PR_L: Interests"
                data-gtm-element-detail="Edit"
                @click="openEdit('profile-list-interests-edit')"
            />
        </template>
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
        <div
            v-if="interests && interests.length && activeForm !== cardKey"
            data-gtm-element="PR_L: Interests"
            data-gtm-element-detail="Edit"
            @click="openEdit('profile-list-interests-edit')"
        >
            <ul
                class="c-cardCvInterests__pillList"
                data-qa="interests pills"
            >
                <li
                    v-for="interest in preparePillsArray(interests, 5)"
                    :key="interest.id"
                    class="c-cardCvInterests__pillListItem"
                    data-qa="pill list item"
                >
                    <AppPill
                        :label="interest.label"
                        :label-definition="interest.level"
                        status="checked"
                        class="c-cardCvInterests__pill"
                        :data-qa="interest.qa"
                    />
                </li>
            </ul>
        </div>
        <AppCvItem
            v-if="interests.length === 0 && cardKey !== activeForm"
            empty-state
            data-qa="empty state"
            data-gtm-element="PR_L: Interests"
            data-gtm-element-detail="Add"
            @click.native="openEdit('profile-list-interests-add')"
        >
            <template #figure>
                <AppIcon
                    name="plus"
                    size="2xl"
                    data-qa="add interests"
                />
            </template>
            <template #headline>
                <AppButtonUnstyled>
                    Interessen hinzufügen
                </AppButtonUnstyled>
            </template>
            <template #snippet>
                Du hast noch keine Interessen eingetragen.
            </template>
        </AppCvItem>
        <FormCvInterests
            v-if="activeForm === cardKey"
            class="c-cardCvInterests__form"
            data-qa="interests form"
            @closeEdit="resetEditAndScroll"
        />
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

.c-cardCvInterests {
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
