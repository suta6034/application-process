<script setup>
import {
    computed, ref,
} from 'vue';
import {
    formatDate,
    formatUrl,
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
import FormCvProject from '../../form/cv/FormCvProject';
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

const cardKey = 'PROJECTS';
const module = 'profile/project';
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

const { rows: projects } = useState(module);

const storedProjects = computed(() => projects.value.filter(x => x.id || x.submitted));
const projectsExist = computed(() => storedProjects.value.length > 0);

const { trackClick } = useTrackClick(CATEGORIES.page.applications);

</script>
<template>
    <AppCard
        ref="element"
        class="c-cardCvProjects"
        data-qa="projects card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
                :class="{ 'k-o-media__body': projectsExist }"
            >
                Projekte
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="projectsExist"
                    data-qa="counter"
                >
                    {{ storedProjects.length }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppLink
                v-if="projectsExist && !newFormIsActive || projectsExist && activeForm !== cardKey"
                tag="button"
                data-qa="add project"
                data-gtm-element="PR_L: Project"
                data-gtm-element-detail="Add"
                @click="openEdit('profile-list-project-add', 'NEW')"
            >
                Hinzufügen
            </AppLink>
        </template>
        <AppInfoBox
            v-if="newFormIsActive && activeForm === cardKey"
            hint
        >
            Hier hast du Platz für Projekte, die du umgesetzt oder begleitet
            hast und die für potenzielle Arbeitgeber von Interesse sein können.
            <template #more>
                Ganz egal ob aus bisherigen Jobs, deiner Ausbildung oder deinem Privatleben –
                Hauptsache mit Herzblut.
            </template>
        </AppInfoBox>
        <AppCvItem
            v-if="newFormIsActive && activeForm === cardKey"
            :horizontal-line="newFormIsActive && activeForm === cardKey && projectsExist"
            class="c-cardCvProjects__newForm"
        >
            <template #figure>
                <AppIcon
                    name="tools"
                    size="2xl"
                />
            </template>
            <template #form>
                <FormCvProject
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
                trackClick('profile-list-project-showall');
                track({ element: 'DB: Project', elementDetail: 'Show all', ga4Event: true });"
        >
            <AppCvItem
                v-if="storedProjects.length === 0 && activeForm !== cardKey"
                empty-state
                data-qa="empty state"
                data-gtm-element="PR_L: Project"
                data-gtm-element-detail="Add"
                @click.native="openEdit('profile-list-project-add','NEW')"
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
                        Projekt hinzufügen
                    </AppButtonUnstyled>
                </template>
                <template #snippet>
                    Du hast noch keine Projekte eingetragen
                </template>
            </AppCvItem>
            <ListWrapper
                v-else
                ladder-size="xl"
            >
                <ListWrapperItem
                    v-for="(project, index) in storedProjects.slice(0,PREVIEW_ITEMS)"
                    :key="project.id"
                    data-qa="project item"
                >
                    <AppCvItem
                        :horizontal-line="isInEditMode(project.id) && index !== storedProjects.length - 1"
                        :hover-partial="!isInEditMode(project.id)"
                        @selected="
                            openEdit('profile-list-project-edit', project.id, );
                            track({ element: 'DB: Project', elementDetail: 'Edit', ga4Event: true });"
                    >
                        <template #figure>
                            <AppIcon
                                name="tools"
                                size="2xl"
                            />
                        </template>
                        <template #headline>
                            {{ project.name }}
                        </template>
                        <template #snippet>
                            {{ formatUrl(project.url) }}
                        </template>
                        <template #meta-end>
                            <time data-qa="project dates">
                                <template v-if="project.start">
                                    {{ formatDate({ date: project.start, format: 'M Y'}) }} -
                                </template>
                                <template v-if="project.end">
                                    {{ formatDate({ date: project.end, format: 'M Y'}) }}
                                </template>
                                <template v-else>
                                    heute
                                </template>
                            </time>
                        </template>
                        <template #action>
                            <CardCvControls
                                ga-element="Project"
                                :is-editable="!isInEditMode(project.id)"
                                @edit="openEdit('profile-list-project-edit', project.id)"
                                @delete="handleDelete('profile-list-project-delete', project.id)"
                            />
                        </template>
                        <template #form>
                            <FormCvProject
                                v-if="isInEditMode(project.id)"
                                :id="project.id"
                                @closeEdit="resetEditAndScroll"
                            />
                        </template>
                    </AppCvItem>
                </ListWrapperItem>
            </ListWrapper>
            <template #more>
                <div
                    v-if="storedProjects.length > PREVIEW_ITEMS"
                    class="c-cardCvProjects__more k-o-ladder k-o-ladder--xl"
                >
                    <AppCvItem
                        v-for="(project, index) in storedProjects.slice(PREVIEW_ITEMS)"
                        :key="project.id"
                        :horizontal-line="isInEditMode(project.id)
                            && index + PREVIEW_ITEMS !== storedProjects.length - 1"
                        :hover-partial="!isInEditMode(project.id)"
                        class="k-o-ladder__rung"
                        data-qa="project item more"
                        @selected="
                            openEdit('profile-list-project-edit', project.id, true);
                            track({ element: 'DB: Project', elementDetail: 'Edit', ga4Event: true });"
                    >
                        <template #figure>
                            <AppIcon
                                name="tools"
                                size="2xl"
                            />
                        </template>
                        <template #headline>
                            {{ project.name }}
                        </template>
                        <template #snippet>
                            {{ formatUrl(project.url) }}
                        </template>
                        <template #meta-end>
                            <time data-qa="project dates">
                                <template v-if="project.start">
                                    {{ formatDate({ date: project.start, format: 'M Y'}) }} -
                                </template>
                                <template v-if="project.end">
                                    {{ formatDate({ date: project.end, format: 'M Y'}) }}
                                </template>
                                <template v-else>
                                    heute
                                </template>
                            </time>
                        </template>
                        <template #action>
                            <CardCvControls
                                ga-element="Project"
                                :is-editable="!isInEditMode(project.id)"
                                @edit="openEdit('profile-list-project-edit', project.id, true)"
                                @delete="handleDelete('profile-list-project-delete', project.id)"
                            />
                        </template>
                        <template #form>
                            <FormCvProject
                                v-if="isInEditMode(project.id)"
                                :id="project.id"
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

.c-cardCvProjects {
    &__more {
        margin-top: $k-spacing--xl;
    }

    &__newForm {
        margin-top: $k-spacing--2xl;
    }
}
</style>
