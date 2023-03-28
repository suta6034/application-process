<script setup>
import {
    computed, ref,
} from 'vue';
import {
    formatDate,
} from '../../../../utils/filter';
import {
    CATEGORIES,
    track,
} from '../../../../utils/tracking';

import AppBadge from '../../../atoms/app/AppBadge';
import AppButtonUnstyled from '../../../atoms/app/AppButtonUnstyled';
import AppCard from '../../../molecules/app/AppCard';
import AppCvItem from '../../app/AppCvItem';
import AppIcon from '../../../atoms/app/AppIcon';
import AppLink from '../../../atoms/app/AppLink';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import AppShowMore from '../../../molecules/app/AppShowMore';
import CardCvControls from './CardCvControls';
import FormCvTraining from '../../form/cv/FormCvTraining';
import ListWrapper from '../../../molecules/list/ListWrapper';
import ListWrapperItem from '../../../molecules/list/ListWrapperItem';
import TextHeadline from '../../../atoms/text/TextHeadline';

import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useState,
} from '../../../../composables/vuex-helpers';
import {
    useTrackClick,
} from '../../../../composables/track-click';

const cardKey = 'TRAINING';
const module = 'profile/training';
const element = ref(null);

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

const { rows: trainings } = useState(module);

const storedTrainings = computed(() => trainings.value.filter(x => x.id || x.submitted));
const trainingsExist = computed(() => storedTrainings.value.length > 0);

const { trackClick } = useTrackClick(CATEGORIES.page.applications);
</script>
<template>
    <AppCard
        ref="element"
        class="c-cardCvTraining"
        data-qa="training card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
                :class="{ 'k-o-media__body': trainingsExist }"
            >
                Weiterbildung
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="trainingsExist"
                    data-qa="counter"
                >
                    {{ storedTrainings.length }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppLink
                v-if="trainingsExist && !newFormIsActive || trainingsExist && activeForm !== cardKey"
                tag="button"
                data-qa="add training"
                data-gtm-element="PR_L: Training"
                data-gtm-element-detail="Add"
                @click="openEdit('profile-list-training-add', 'NEW')"
            >
                Hinzufügen
            </AppLink>
        </template>
        <AppInfoBox
            v-if="newFormIsActive && activeForm === cardKey"
            hint
        >
            Erwähne hier nur Weiterbildungen, die für deinen Wunschjob relevant sind.
            Dass du deine Kompetenzen vertieft hast, solltest du mittels Zeugnissen und
            Zertifikaten belegen können. Füge diese im Bereich „Dokumente“ hinzu.
        </AppInfoBox>
        <AppCvItem
            v-if="newFormIsActive && activeForm === cardKey"
            :horizontal-line="trainingsExist"
            class="c-cardCvTraining__newForm"
        >
            <template #figure>
                <AppIcon
                    name="tools"
                    size="2xl"
                />
            </template>
            <template #form>
                <FormCvTraining
                    data-qa="new form"
                    @closeEdit="resetEditAndScroll"
                />
            </template>
        </AppCvItem>
        <AppShowMore
            label="Alle anzeigen"
            button-in-list
            @showLess="showLessCallback"
            @showMore="
                trackClick('profile-list-training-showall');
                track({ element: 'DB: Training', elementDetail: 'Show all', ga4Event: true });"
        >
            <AppCvItem
                v-if="storedTrainings.length === 0 && activeForm !== cardKey"
                empty-state
                data-qa="empty state"
                data-gtm-element="PR_L: Training"
                data-gtm-element-detail="Add"
                @click.native="openEdit('profile-list-training-add','NEW')"
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
                        Weiterbildung hinzufügen
                    </AppButtonUnstyled>
                </template>
                <template #snippet>
                    Vervollständigt dein Profil um 5%
                </template>
            </AppCvItem>
            <ListWrapper
                v-else
                ladder-size="xl"
            >
                <ListWrapperItem
                    v-for="(training, index) in storedTrainings.slice(0,PREVIEW_ITEMS)"
                    :key="training.id"
                    data-qa="training item"
                >
                    <AppCvItem
                        :horizontal-line="isInEditMode(training.id) && index !== storedTrainings.length - 1"
                        :hover-partial="!isInEditMode(training.id)"
                        @selected="
                            openEdit('profile-list-training-edit', training.id);
                            track({ element: 'DB: Training', elementDetail: 'Edit', ga4Event: true });"
                    >
                        <template #figure>
                            <AppIcon
                                name="tools"
                                size="2xl"
                            />
                        </template>
                        <template #headline>
                            {{ training.title }}
                        </template>
                        <template #snippet>
                            {{ training.institute }}
                        </template>
                        <template #meta-end>
                            <time data-qa="training date">
                                <template v-if="training.date">
                                    {{ formatDate({ date: training.date, format: 'Y'}) }}
                                </template>
                            </time>
                        </template>
                        <template #action>
                            <CardCvControls
                                ga-element="Training"
                                :is-editable="!isInEditMode(training.id)"
                                @edit="openEdit('profile-list-training-edit', training.id)"
                                @delete="handleDelete('profile-list-training-delete', training.id)"
                            />
                        </template>
                        <template #form>
                            <FormCvTraining
                                v-if="isInEditMode(training.id)"
                                :id="training.id"
                                data-qa="edit form"
                                @closeEdit="resetEditAndScroll"
                            />
                        </template>
                    </AppCvItem>
                </ListWrapperItem>
            </ListWrapper>
            <template #more>
                <div
                    v-if="storedTrainings.length > PREVIEW_ITEMS"
                    class="c-cardCvTraining__more k-o-ladder k-o-ladder--xl"
                >
                    <AppCvItem
                        v-for="(training, index) in storedTrainings.slice(PREVIEW_ITEMS)"
                        :key="training.id"
                        :horizontal-line="isInEditMode(training.id)
                            && index + PREVIEW_ITEMS !== storedTrainings.length - 1"
                        :hover-partial="!isInEditMode(training.id)"
                        class="k-o-ladder__rung"
                        data-qa="training item more"
                        @selected="
                            openEdit('profile-list-training-edit', training.id, true);
                            track({ element: 'DB: Training', elementDetail: 'Edit', ga4Event: true });"
                    >
                        <template #figure>
                            <AppIcon
                                name="tools"
                                size="2xl"
                            />
                        </template>
                        <template #headline>
                            {{ training.title }}
                        </template>
                        <template #snippet>
                            {{ training.institute }}
                        </template>
                        <template #meta-end>
                            <time data-qa="training date">
                                <template v-if="training.date">
                                    {{ formatDate({ date: training.date, format: 'Y'}) }}
                                </template>
                            </time>
                        </template>
                        <template #action>
                            <CardCvControls
                                ga-element="Training"
                                :is-editable="!isInEditMode(training.id)"
                                @edit="openEdit('profile-list-training-edit', training.id, true)"
                                @delete="handleDelete('profile-list-training-delete', training.id)"
                            />
                        </template>
                        <template #form>
                            <FormCvTraining
                                v-if="isInEditMode(training.id)"
                                :id="training.id"
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

.c-cardCvTraining {
    &__more {
        margin-top: $k-spacing--xl;
    }

    &__newForm {
        margin-top: $k-spacing--2xl;
    }
}
</style>
