<script setup>
import {
    ref,
    computed,
} from 'vue';
import {
    WORK_CATEGORY,
} from '../../../../store/modules/forms/work';

import AppBadge from '../../../atoms/app/AppBadge';
import AppButtonUnstyled from '../../../atoms/app/AppButtonUnstyled';
import AppCard from '../../../molecules/app/AppCard';
import AppCvItem from '../../app/AppCvItem';
import AppIcon from '../../../atoms/app/AppIcon';
import AppLink from '../../../atoms/app/AppLink';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import AppShowMore from '../../../molecules/app/AppShowMore';
import CardCvControls from './CardCvControls';
import FormCvWorkExperience from '../../form/cv/FormCvWorkExperience';
import ListWrapper from '../../../molecules/list/ListWrapper';
import ListWrapperItem from '../../../molecules/list/ListWrapperItem';
import TextHeadline from '../../../atoms/text/TextHeadline';

import {
    formatDate,
} from '../../../../utils/filter';
import {
    CATEGORIES,
} from '../../../../utils/tracking';
import {
    useTrackClick,
} from '../../../../composables/track-click';
import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const WORK_CATEGORY_ICON = {
    Berufserfahrung: 'briefcase',
    Elternzeit: 'pram',
    Grundwehrdienst: 'military',
    Zivildienst: 'hand-heart',
    Sonstiges: 'wayfinder',
};
const module = 'profile/work';
const cardKey = 'WORK';
const element = ref(null);

const { rows: workExperiences } = useState(module);
const { hasWorkExperience } = useState('profile');

const storedWorkExperiences = computed(() => workExperiences.value.filter(x => x.id || x.submitted));
const workExperiencesCounter = computed(() => storedWorkExperiences.value.length);
const workExperiencesExist = computed(() => storedWorkExperiences.value.length > 0);

const {
    isInEditMode,
    resetEditAndScroll,
    openEdit,
    showLessCallback,
    handleDelete,
    PREVIEW_ITEMS,
    activeForm,
    newFormIsActive,
} = useCvCard({ cardKey, element, module });

const getWorkExperienceIcon = label => WORK_CATEGORY_ICON[label] ?? '';
const title = (work) => {
    if (work.category.label === WORK_CATEGORY.SONSTIGES
        || work.category.label === WORK_CATEGORY.BERUFSERFAHRUNG) {
        return work.title.label || work.title;
    }
    return work.category.label;
};

const { trackClick } = useTrackClick(CATEGORIES.page.profile);

</script>
<template>
    <AppCard
        ref="element"
        class="c-cardCvWorkExperience"
        data-qa="work experience card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
                :class="{ 'k-o-media__body': workExperiencesExist }"
            >
                Berufserfahrung
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="workExperiencesExist"
                    data-qa="counter"
                >
                    {{ workExperiencesCounter }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppLink
                v-if="workExperiencesExist && !newFormIsActive || workExperiencesExist && activeForm !== cardKey"
                tag="button"
                data-qa="add work experience"
                data-gtm-element="PR_L: Experience"
                data-gtm-element-detail="Add"
                @click="openEdit('profile-list-experience-add', 'NEW')"
            >
                Hinzufügen
            </AppLink>
        </template>
        <AppInfoBox
            v-if="newFormIsActive && activeForm === cardKey"
            hint
        >
            Überleg dir gut, wie sehr du hier ins Detail gehst. Ein Praktikums- oder Ferialjob ist oft
            nicht mehr relevant, wenn du bereits mehrere Jahre in anderen Positionen tätig warst.
        </AppInfoBox>
        <AppCvItem
            v-if="newFormIsActive && activeForm === cardKey"
            :horizontal-line="newFormIsActive && activeForm === cardKey && workExperiencesExist"
            class="c-cardCvWorkExperience__newForm"
        >
            <template #figure>
                <AppIcon
                    name="tools"
                    size="2xl"
                />
            </template>
            <template #form>
                <FormCvWorkExperience
                    data-qa="new form"
                    @closeEdit="resetEditAndScroll"
                />
            </template>
        </AppCvItem>

        <AppShowMore
            label="Alle anzeigen"
            button-in-list
            @showLess="showLessCallback"
            @showMore="trackClick('profile-list-education-showall')"
        >
            <AppCvItem
                v-if="workExperiencesCounter === 0 && activeForm !== cardKey"
                empty-state
                data-qa="empty state"
                data-gtm-element="PR_L: Experience"
                data-gtm-element-detail="Add"
                @click.native="openEdit('profile-list-experience-add', 'NEW')"
            >
                <template #figure>
                    <AppIcon
                        name="plus"
                        size="2xl"
                        data-qa="add icon"
                    />
                </template>
                <template #headline>
                    <AppButtonUnstyled>
                        Berufserfahrung hinzufügen
                    </AppButtonUnstyled>
                </template>
                <template #snippet>
                    <span v-if="hasWorkExperience">
                        Vervollständigt dein Profil um 15%
                    </span>
                    <span v-if="!hasWorkExperience">
                        Sobald du Berufserfahrung vorweisen kannst, füge diese hinzu.
                    </span>
                </template>
            </AppCvItem>
            <ListWrapper
                v-else
                ladder-size="xl"
            >
                <ListWrapperItem
                    v-for="(work, index) in storedWorkExperiences.slice(0,PREVIEW_ITEMS)"
                    :key="work.id"
                    data-qa="work experience item"
                >
                    <AppCvItem
                        :horizontal-line="isInEditMode(work.id) && index !== workExperiencesCounter - 1"
                        :hover-partial="!isInEditMode(work.id)"
                        @selected="openEdit('profile-list-education-edit', work.id)"
                    >
                        <template #figure>
                            <AppIcon
                                :name="getWorkExperienceIcon(work.category.label)"
                                size="2xl"
                            />
                        </template>
                        <template #headline>
                            {{ title(work) }}
                        </template>
                        <template
                            v-if="work.company.label"
                            #snippet
                        >
                            {{ work.company.label }}
                        </template>
                        <template #meta-end>
                            <time data-qa="work dates">
                                <template v-if="work.start">
                                    {{ formatDate({ date: work.start, format: 'M Y'}) }} -
                                </template>
                                <template v-if="work.end">
                                    {{ formatDate({ date: work.end, format: 'M Y'}) }}
                                </template>
                                <template v-else>
                                    heute
                                </template>
                            </time>
                        </template>
                        <template #action>
                            <CardCvControls
                                ga-element="Experience"
                                :is-editable="!isInEditMode(work.id)"
                                @edit="openEdit('profile-list-experience-edit', work.id)"
                                @delete="handleDelete('profile-list-experience-delete', work.id)"
                            />
                        </template>
                        <template #form>
                            <FormCvWorkExperience
                                v-if="isInEditMode(work.id)"
                                :id="work.id"
                                data-qa="edit form"
                                @closeEdit="resetEditAndScroll"
                            />
                        </template>
                    </AppCvItem>
                </ListWrapperItem>
            </ListWrapper>
            <template #more>
                <div
                    v-if="workExperiencesCounter > PREVIEW_ITEMS"
                    class="c-cardCvWorkExperience__more k-o-ladder k-o-ladder--xl"
                >
                    <AppCvItem
                        v-for="(work, index) in storedWorkExperiences.slice(PREVIEW_ITEMS)"
                        :key="work.id"
                        :horizontal-line="isInEditMode(work.id) && index + PREVIEW_ITEMS !== workExperiencesCounter - 1"
                        :hover-partial="!isInEditMode(work.id)"
                        class="k-o-ladder__rung"
                        data-qa="work experience item more"
                        @selected="openEdit('profile-list-education-edit', work.id, true)"
                    >
                        <template #figure>
                            <AppIcon
                                :name="getWorkExperienceIcon(work.category.label)"
                                size="2xl"
                            />
                        </template>
                        <template #headline>
                            {{ title(work) }}
                        </template>
                        <template
                            v-if="work.company.label"
                            #snippet
                        >
                            {{ work.company.label }}
                        </template>
                        <template #meta-end>
                            <time data-qa="work dates">
                                <template v-if="work.start">
                                    {{ formatDate({ date: work.start, format: 'M Y'}) }} -
                                </template>
                                <template v-if="work.end">
                                    {{ formatDate({ date: work.end, format: 'M Y'}) }} -
                                </template>
                                <template v-else>
                                    heute
                                </template>
                            </time>
                        </template>
                        <template #action>
                            <CardCvControls
                                ga-element="Experience"
                                :is-editable="!isInEditMode(work.id)"
                                @edit="openEdit('profile-list-experience-edit', work.id, true)"
                                @delete="handleDelete('profile-list-experience-delete', work.id)"
                            />
                        </template>
                        <template #form>
                            <FormCvWorkExperience
                                v-if="isInEditMode(work.id)"
                                :id="work.id"
                                data-qa="edit form"
                                @closeEdit="resetEditAndScroll"
                            />
                        </template>
                    </AppCvItem>
                </div>
            </template>
        </AppShowMore>
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/spacing';

.c-cardCvWorkExperience {
    &__more {
        margin-top: $k-spacing--xl;
    }

    &__newForm {
        margin-top: $k-spacing--2xl;
    }
}
</style>
