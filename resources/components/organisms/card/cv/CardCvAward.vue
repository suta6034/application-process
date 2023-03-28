<script setup>
import {
    ref,
    computed,
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
import AppList from '../../../atoms/app/AppList';
import AppInfoBox from '../../../molecules/app/AppInfoBox';
import AppShowMore from '../../../molecules/app/AppShowMore';
import CardCvControls from './CardCvControls';
import FormCvAward from '../../form/cv/FormCvAward';
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

const cardKey = 'AWARD';
const element = ref(null);
const module = 'profile/award';

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

const { rows: awards } = useState(module);

const storedAwards = computed(() => awards.value.filter(x => x.id || x.submitted));
const awardsCounter = computed(() => storedAwards.value.length);
const awardsExist = computed(() => storedAwards.value.length > 0);

const { trackClick } = useTrackClick(CATEGORIES.page.applications);

</script>
<template>
    <AppCard
        ref="element"
        class="c-cardCvAward"
        data-qa="award card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
                :class="{ 'k-o-media__body': awardsExist }"
            >
                Auszeichnungen
            </TextHeadline>
            <div class="k-o-media__figure">
                <AppBadge
                    v-if="awardsExist"
                    data-qa="counter"
                >
                    {{ awardsCounter }}
                </AppBadge>
            </div>
        </template>
        <template #action>
            <AppLink
                v-if="awardsExist && !newFormIsActive || awardsExist && activeForm !== cardKey"
                tag="button"
                data-qa="add award"
                data-gtm-element="PR_L: Awards"
                data-gtm-element-detail="Add"
                @click="openEdit('profile-list-award-add', 'NEW')"
            >
                Hinzufügen
            </AppLink>
        </template>
        <AppInfoBox
            v-if="newFormIsActive && activeForm === cardKey"
            hint
        >
            Du hast eine Auszeichnung wie z.B. ein Stipendium oder einen Preis bei einem Wettbewerb erhalten? Dann
            ist hier der richtige Platz dafür.
            <template #more>
                <p>Wichtig dabei:</p>
                <AppList>
                    <li class="k-c-list__item k-c-list__item--disc">
                        <span>Nur Auszeichnungen angeben, die für dein Karriereleben relevant sind.</span>
                    </li>
                    <li class="k-c-list__item k-c-list__item--disc">
                        <span>Beschränke dich auf die wichtigsten Auszeichnungen und übertreibe nicht.</span>
                    </li>
                </AppList>
            </template>
        </AppInfoBox>
        <AppCvItem
            v-if="newFormIsActive && activeForm === cardKey"
            :horizontal-line="awardsExist"
            class="c-cardCvAward__newForm"
        >
            <template #figure>
                <AppIcon
                    name="tools"
                    size="2xl"
                />
            </template>
            <template #form>
                <FormCvAward
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
                trackClick('profile-list-awards-showall');
                track(
                    {
                        element: 'DB: Awards',
                        elementDetail: 'Show all',
                        ga4Event: true,
                    });"
        >
            <AppCvItem
                v-if="!awardsExist && activeForm !== cardKey"
                empty-state
                data-qa="empty state"
                data-gtm-element="PR_L: Awards"
                data-gtm-element-detail="Add"
                @click.native="openEdit('profile-list-awards-add', 'NEW')"
            >
                <template #figure>
                    <AppIcon
                        name="plus"
                        size="2xl"
                        data-qa="add award"
                    />
                </template>
                <template #headline>
                    <AppButtonUnstyled>
                        Auszeichnungen hinzufügen
                    </AppButtonUnstyled>
                </template>
                <template #snippet>
                    Du hast noch keine Auszeichnungen eingetragen
                </template>
                <template #form>
                    <FormCvAward
                        v-if="newFormIsActive && activeForm === cardKey"
                        data-qa="new form"
                        @closeEdit="resetEditAndScroll"
                    />
                </template>
            </AppCvItem>
            <ListWrapper
                v-else
                ladder-size="xl"
            >
                <ListWrapperItem
                    v-for="(award, index) in storedAwards.slice(0,PREVIEW_ITEMS)"
                    :key="award.id"
                    data-qa="award item"
                >
                    <AppCvItem
                        :horizontal-line="isInEditMode(award.id) && index !== awardsCounter - 1"
                        :hover-partial="!isInEditMode(award.id)"
                        @selected="openEdit('profile-list-award-edit', award.id)"
                    >
                        <template #figure>
                            <AppIcon
                                name="trophy"
                                size="2xl"
                            />
                        </template>
                        <template #headline>
                            {{ award.name }}
                        </template>
                        <template
                            v-if="award.url"
                            #snippet
                        >
                            {{ formatUrl(award.url) }}
                        </template>
                        <template #meta-end>
                            <time data-qa="award date">
                                <template v-if="award.date">
                                    {{ formatDate({ date: award.date, format: 'Y'}) }}
                                </template>
                            </time>
                        </template>
                        <template #action>
                            <CardCvControls
                                ga-element="Awards"
                                :is-editable="!isInEditMode(award.id)"
                                @edit="openEdit('profile-list-awards-edit', award.id)"
                                @delete="handleDelete('profile-list-awards-delete', award.id)"
                            />
                        </template>
                        <template #form>
                            <FormCvAward
                                v-if="isInEditMode(award.id)"
                                :id="award.id"
                                data-qa="edit form"
                                @closeEdit="resetEditAndScroll"
                            />
                        </template>
                    </AppCvItem>
                </ListWrapperItem>
            </ListWrapper>
            <template #more>
                <ListWrapper
                    v-if="awardsCounter > PREVIEW_ITEMS"
                    ladder-size="xl"
                    class="c-cardCvAward__more"
                >
                    <ListWrapperItem
                        v-for="(award, index) in storedAwards.slice(PREVIEW_ITEMS)"
                        :key="award.id"
                        data-qa="award item more"
                    >
                        <AppCvItem
                            :horizontal-line="isInEditMode(award.id) && index + PREVIEW_ITEMS !== awardsCounter - 1"
                            :hover-partial="!isInEditMode(award.id)"
                            @selected="
                                openEdit('profile-list-award-edit', award.id, true);
                                track({ element: 'DB: Awards', elementDetail: 'Edit', ga4Event: true });"
                        >
                            <template #figure>
                                <AppIcon
                                    name="trophy"
                                    size="2xl"
                                />
                            </template>
                            <template #headline>
                                {{ award.name }}
                            </template>
                            <template
                                v-if="award.url"
                                #snippet
                            >
                                {{ formatUrl(award.url) }}
                            </template>
                            <template #meta-end>
                                <time data-qa="award date">
                                    <template v-if="award.date">
                                        {{ formatDate({ date: award.date, format: 'Y'}) }}
                                    </template>
                                </time>
                            </template>
                            <template #action>
                                <CardCvControls
                                    ga-element="Awards"
                                    :is-editable="!isInEditMode(award.id)"
                                    @edit="openEdit('profile-list-awards-edit', award.id, true)"
                                    @delete="handleDelete('profile-list-awards-delete', award.id)"
                                />
                            </template>
                            <template #form>
                                <FormCvAward
                                    v-if="isInEditMode(award.id)"
                                    :id="award.id"
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

.c-cardCvAward {
    &__more {
        margin-top: $k-spacing--xl;
    }

    &__newForm {
        margin-top: $k-spacing--2xl;
    }
}
</style>
