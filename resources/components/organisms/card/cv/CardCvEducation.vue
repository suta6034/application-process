<script setup>
import {
    computed,
    ref,
} from 'vue';
import AppBadge from '../../../atoms/app/AppBadge';
import AppButtonUnstyled from '../../../atoms/app/AppButtonUnstyled';
import AppCard from '../../../molecules/app/AppCard';
import AppCvItem from '../../app/AppCvItem';
import AppIcon from '../../../atoms/app/AppIcon';
import AppLink from '../../../atoms/app/AppLink';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import AppShowMore from '../../../molecules/app/AppShowMore';
import CardCvControls from './CardCvControls';
import FormCvEducation from '../../form/cv/FormCvEducation';
import ListWrapper from '../../../molecules/list/ListWrapper';
import ListWrapperItem from '../../../molecules/list/ListWrapperItem';
import TextHeadline from '../../../atoms/text/TextHeadline';

import {
    formatDate,
} from '../../../../utils/filter';
import {
    CATEGORIES,
    track,
} from '../../../../utils/tracking';
import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useState,
} from '../../../../composables/vuex-helpers';
import {
    useTrackClick,
} from '../../../../composables/track-click';

const cardKey = 'EDUCATION';
const module = 'profile/education';
const element = ref(null);

const {
    isInEditMode,
    resetEditAndScroll,
    openEdit,
    showLessCallback,
    handleDelete,
    handleForbiddenDelete,
    PREVIEW_ITEMS,
    activeForm,
    newFormIsActive,
} = useCvCard({ cardKey, element, module });

const { rows: educations } = useState(module);

const storedEducations = computed(() => educations.value.filter(x => x.id || x.submitted));
const educationsCounter = computed(() => storedEducations.value.length);
const educationsExist = computed(() => storedEducations.value.length > 0);

const subHeadline = (education) => {
    if (!education.focus) return null;
    return education.trainingCompany || education.name;
};
const deleteItem = (trackingName, education) => {
    if (educationsCounter.value === 1) handleForbiddenDelete(trackingName, education.id);
    else handleDelete(trackingName, education.id);
};

const { trackClick } = useTrackClick(CATEGORIES.page.profile);

</script>
<template>
    <AppCard
        ref="element"
        class="c-cardCvEducation"
        data-qa="education card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
                :class="{ 'k-o-media__body': educationsExist }"
            >
                Ausbildung
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="educationsExist"
                    data-qa="counter"
                >
                    {{ educationsCounter }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppLink
                v-if="educationsExist && !newFormIsActive || educationsExist && activeForm !== cardKey"
                tag="button"
                data-qa="add education"
                data-gtm-element="PR_L: Education"
                data-gtm-element-detail="Add"
                @click="openEdit('profile-list-education-add', 'NEW')"
            >
                Hinzufügen
            </AppLink>
        </template>
        <AppInfoBox
            v-if="newFormIsActive && activeForm === cardKey"
            hint
        >
            Hier gibst du an, über welche Berufs- und Schulausbildung du verfügst.
            Je weniger Berufserfahrung du hast, desto mehr kannst du ins Detail gehen.
            Wenn du einen höheren Abschluss oder mehrjährige Berufserfahrung hast,
            lass Unter- und Oberstufe weg.
        </AppInfoBox>
        <AppCvItem
            v-if="newFormIsActive && activeForm === cardKey"
            :horizontal-line="newFormIsActive && activeForm === cardKey && educationsExist"
            class="c-cardCvEducation__newForm"
        >
            <template #figure>
                <AppIcon
                    name="tools"
                    size="2xl"
                />
            </template>
            <template #form>
                <FormCvEducation
                    data-qa="new form"
                    @closeEdit="resetEditAndScroll"
                />
            </template>
        </AppCvItem>

        <AppShowMore
            label="Alle anzeigen"
            button-in-list
            :hide-less-button="activeForm === cardKey"
            @showLess="showLessCallback"
            @showMore="
                trackClick('profile-list-education-showall');
                track({ element: 'PR_L: Education', elementDetail: 'Show All', ga4Event: true });"
        >
            <AppCvItem
                v-if="educationsCounter === 0 && activeForm !== cardKey"
                empty-state
                data-qa="empty state"
                data-gtm-element="PR_L: Education"
                data-gtm-element-detail="Add"
                @click.native="openEdit('profile-list-education-add', 'NEW')"
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
                        Ausbildung hinzufügen
                    </AppButtonUnstyled>
                </template>
                <template #snippet>
                    Vervollständigt dein Profil um 15%
                </template>
            </AppCvItem>
            <ListWrapper
                v-else
                ladder-size="xl"
            >
                <ListWrapperItem
                    v-for="(education, index) in storedEducations.slice(0,PREVIEW_ITEMS)"
                    :key="education.id"
                    data-qa="education item"
                >
                    <AppCvItem
                        :horizontal-line="isInEditMode(education.id) && index !== educationsCounter - 1"
                        :hover-partial="!isInEditMode(education.id)"
                        @selected="openEdit('profile-list-education-edit', education.id)"
                    >
                        <template #figure>
                            <AppIcon
                                name="cap"
                                size="2xl"
                            />
                        </template>
                        <template #headline>
                            {{ education.focus || education.name }}
                        </template>
                        <template
                            v-if="subHeadline(education)"
                            #snippet
                        >
                            <div data-qa="subheadline">
                                {{ subHeadline(education) }}
                            </div>
                        </template>
                        <template #meta-end>
                            <time data-qa="education dates">
                                <template v-if="education.start">
                                    {{ formatDate({ date: education.start, format: 'M Y' }) }} –
                                </template>
                                <template v-if="education.end">
                                    {{ formatDate({ date: education.end, format: 'M Y' }) }}
                                </template>
                                <template v-else>
                                    heute
                                </template>
                            </time>
                        </template>
                        <template #action>
                            <CardCvControls
                                ga-element="Education"
                                :is-editable="!isInEditMode(education.id)"
                                @edit="openEdit('profile-list-education-edit', education.id)"
                                @delete="deleteItem('profile-list-education-delete', education)"
                            />
                        </template>
                        <template #form>
                            <FormCvEducation
                                v-if="isInEditMode(education.id)"
                                :id="education.id"
                                data-qa="edit form"
                                @closeEdit="resetEditAndScroll"
                            />
                        </template>
                    </AppCvItem>
                </ListWrapperItem>
            </ListWrapper>
            <template #more>
                <ListWrapper
                    v-if="educationsCounter > PREVIEW_ITEMS"
                    ladder-size="xl"
                    class="c-cardCvEducation__more"
                >
                    <ListWrapperItem
                        v-for="(education, index) in storedEducations.slice(PREVIEW_ITEMS)"
                        :key="education.id"
                        data-qa="education item more"
                    >
                        <AppCvItem
                            :horizontal-line="isInEditMode(education.id)
                                && index + PREVIEW_ITEMS !== educationsCounter - 1"
                            :hover-partial="!isInEditMode(education.id)"
                            @selected="openEdit('profile-list-education-edit', education.id, true)"
                        >
                            <template #figure>
                                <AppIcon
                                    name="cap"
                                    size="2xl"
                                />
                            </template>
                            <template #headline>
                                {{ education.focus || education.name }}
                            </template>
                            <template
                                v-if="subHeadline(education)"
                                #snippet
                            >
                                <div data-qa="subheadline">
                                    {{ subHeadline(education) }}
                                </div>
                            </template>
                            <template #meta-end>
                                <time data-qa="education dates">
                                    <template v-if="education.start">
                                        {{ formatDate({ date: education.start, format: 'M Y' }) }} -
                                    </template>
                                    <template v-if="education.end">
                                        {{ formatDate({ date: education.end, format: 'M Y' }) }}
                                    </template>
                                    <template v-else>
                                        heute
                                    </template>
                                </time>
                            </template>
                            <template #action>
                                <CardCvControls
                                    ga-element="Education"
                                    :is-editable="!isInEditMode(education.id)"
                                    @edit="openEdit('profile-list-education-edit', education.id, true)"
                                    @delete="deleteItem('profile-list-education-delete', education)"
                                />
                            </template>
                            <template #form>
                                <FormCvEducation
                                    v-if="isInEditMode(education.id)"
                                    :id="education.id"
                                    data-qa="edit form"
                                    @closeEdit="resetEditAndScroll"
                                />
                            </template>
                        </AppCvItem>
                    </ListWrapperItem>
                </ListWrapper>
            </template>
        </AppShowMore>
    </AppCard>
</template>

<style lang="scss">
@import '../../../../assets/scss/settings/spacing';

.c-cardCvEducation {
    &__more {
        margin-top: $k-spacing--xl;
    }

    &__newForm {
        margin-top: $k-spacing--2xl;
    }
}
</style>
