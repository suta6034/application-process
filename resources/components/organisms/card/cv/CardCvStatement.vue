<script setup>
import {
    ref,
} from 'vue';
import AppButtonIconOnly from '../../../atoms/app/AppButtonIconOnly';
import AppButtonUnstyled from '../../../atoms/app/AppButtonUnstyled';
import AppCard from '../../../molecules/app/AppCard';
import AppCvItem from '../../app/AppCvItem';
import AppIcon from '../../../atoms/app/AppIcon';
import FormCvStatement from '../../form/cv/FormCvStatement';
import TextHeadline from '../../../atoms/text/TextHeadline';

import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const cardKey = 'STATEMENT';
const element = ref(null);

const { statement } = useState('profile/statement');
const {
    resetEditAndScroll,
    openEdit,
    activeForm,
} = useCvCard({ cardKey, element });

</script>
<template>
    <AppCard
        ref="element"
        class="c-cardCvStatement"
        data-qa="statement card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
            >
                Persönliches Statement
            </TextHeadline>
        </template>
        <template #action>
            <AppButtonIconOnly
                v-if="statement && statement.length && activeForm !== cardKey"
                size="xl"
                icon="pen"
                aria-label="Bearbeiten"
                data-qa="edit statement"
                data-gtm-element="PR_L: Statement"
                data-gtm-element-detail="Edit"
                @click="openEdit('profile-list-statement-edit')"
            />
        </template>
        <div>
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
            <div
                v-if="statement && activeForm !== cardKey"
                class="c-cardCvStatement__statement"
                data-qa="statement"
                data-gtm-element="PR_L: Statement"
                data-gtm-element-detail="Edit"
                @click="openEdit('profile-list-statement-edit')"
            >
                {{ statement }}
            </div>
            <AppCvItem
                v-if="!statement && activeForm !== cardKey"
                empty-state
                data-qa="empty state"
                data-gtm-element="PR_L: Statement"
                data-gtm-element-detail="Add"
                @click.native="openEdit('profile-list-statement-add')"
            >
                <template #figure>
                    <AppIcon
                        name="plus"
                        size="2xl"
                    />
                </template>
                <template #headline>
                    <AppButtonUnstyled>
                        Statement hinzufügen
                    </AppButtonUnstyled>
                </template>
                <template #snippet>
                    Du hast noch kein Statement eingetragen
                </template>
            </AppCvItem>
            <FormCvStatement
                v-if="activeForm === cardKey"
                class="c-cardCvStatement__form"
                data-qa="edit form"
                @closeEdit="resetEditAndScroll"
            />
        </div>
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

.c-cardCvStatement {
    &__form {
        padding-bottom: $k-spacing--xl;
    }

    &__statement {
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
