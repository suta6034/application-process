<script setup>
import {
    computed,
    inject,
} from 'vue';
import {
    emitUserAction,
} from '../../../services/user-actions';
import {
    STATES,
    useApplicationList,
} from '../../../composables/resource-application';
import AppApplicationItem from '../app/AppApplicationItem';
import AppBadge from '../../atoms/app/AppBadge';
import AppCupcake from '../../atoms/app/AppCupcake';
import AppLink from '../../atoms/app/AppLink';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import IllustrationEmptyApplication from '../../illustrations/IllustrationEmptyApplication';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useBreakpoints,
} from '../../../composables/breakpoint';
import {
    track,
} from '../../../utils/tracking';

defineProps({
    hasProfile: {
        required: true,
        type: Boolean,
    },
});

const router = inject('router');
const {
    data: applications,
    pagination,
    refetch: refetchApplications,
    state,
} = useApplicationList({ pageSize: 3 });

const { isMobile } = useBreakpoints();

const isError = computed(() => state.value === STATES.isError);
const isLoading = computed(() => state.value === STATES.isLoading);

const openPageApplications = async (application) => {
    await router.push({
        name: 'page-applications',
        params: {
            id: application.id,
        },
    });
    track({
        element: 'DB: Applications',
        elementDetail: 'Open Detail',
        ga4Event: true,
    });
};

const openPageApplicationMemo = async (application) => {
    await router.push({
        name: isMobile.value ? 'page-application-detail' : 'page-applications',
        params: {
            id: application.id,
            subNavId: 'memo',
        },
    });
    track({
        element: 'DB: Applications',
        elementDetail: 'Add Note',
        ga4Event: true,
    });
};
</script>

<template>
    <div class="c-cardLatestApplications k-c-card k-c-card--noBorder">
        <div class="k-c-card__header">
            <div class="k-o-media k-o-media--s">
                <TextHeadline
                    :level="2"
                    size="l"
                    class="k-o-media__body _flexbox-min-width-fix"
                >
                    <span class="c-cardLatestApplications__headlineOptional">
                        Meine
                    </span>
                    Bewerbungen
                </TextHeadline>
                <div class="k-o-media__figure">
                    <SkeletonBox
                        v-if="isLoading"
                        width="1.875em"
                        height="1.375em"
                    />
                    <AppBadge
                        v-else-if="!isError && pagination"
                        data-qa="counter"
                    >
                        {{ pagination.total }}
                    </AppBadge>
                </div>
            </div>
            <AppLink
                v-if="applications && applications.length"
                :to="{ name: 'page-applications' }"
                data-qa="show all link"
                data-gtm-element="DB: Applications"
                data-gtm-element-detail="Show All"
                @click.native="emitUserAction('show-all-applications')"
            >
                Alle anzeigen
            </AppLink>
        </div>
        <div class="k-c-card__body">
            <AppRefreshPrompt
                v-if="isError"
                :fetch="refetchApplications"
                data-qa="error state"
            />
            <AppCupcake v-if="!isLoading && applications && applications.length === 0">
                <template #cherry>
                    <IllustrationEmptyApplication data-qa="empty state illustration"/>
                </template>
                <p>
                    Verwalte deine Bewerbungen an einem Ort:
                    <AppLink
                        :to="{ name: 'page-applications' }"
                        data-qa="application link"
                        data-gtm-element="DB: Applications"
                        data-gtm-element-detail="Add Manual Application"
                        @click.native="emitUserAction('emptystate-add-application')"
                    >
                        Bewerbung hinzufügen.
                    </AppLink>
                    <!--
                    <template v-if="hasProfile">
                        Oder nutze die Zeit, um dein
                        <AppLink
                            :to="{ name: 'page-motivation-letters' }"
                            data-qa="motivation letter link"
                            @click.native="emitUserAction('emptystate-add-application-letter')"
                        >
                            Bewerbungsschreiben
                        </AppLink>
                        vorzubereiten.
                        Unsere Textbausteine helfen dir dabei.
                    </template>
                    -->
                    <!-- TODO Add v-else below if you add the above component back in -->
                    <!-- eslint-disable-next-line vue/no-lone-template -->
                    <template>
                        Nutze auch unsere
                        <AppLink
                            :to="{ name: 'page-tips-application' }"
                            data-qa="tip link"
                            @click.native="emitUserAction('emptystate-tipps')"
                        >
                            Tipps<!--
                            -->
                        </AppLink>, damit du bei deiner Bewerbung nichts vergisst.
                    </template>
                </p>
            </AppCupcake>
            <ul
                v-else
                class="k-o-ladder k-o-ladder--l"
            >
                <template v-if="isLoading">
                    <li
                        v-for="i in 3"
                        :key="i"
                        class="c-cardLatestApplications__listItem k-o-ladder__rung"
                    >
                        <AppApplicationItem/>
                    </li>
                </template>
                <li
                    v-for="application in applications"
                    v-else
                    :key="application.id"
                    class="c-cardLatestApplications__listItem k-o-ladder__rung"
                    data-qa="application item"
                >
                    <AppApplicationItem
                        :application="application"
                        :has-remove="false"
                        @memo="openPageApplicationMemo(application)"
                        @clicked="openPageApplications(application)"
                        @status="track({
                            element: 'DB: Applications',
                            elementDetail: 'Change State',
                            ga4Event: true,
                        });"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

// 1. Overwriting .k-c-card{ overflow: hidden } here, otherwise .c-appApplicationActions__dropdown is cut
.c-cardLatestApplications {
    overflow: unset; // 1

    &__headlineOptional {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: inline;
        }
    }

    &__listItem {
        &:not(:last-child) {
            padding-bottom: $k-spacing--l;
            border-bottom: 1px solid $k-color-gray--100;
        }
    }
}
</style>
