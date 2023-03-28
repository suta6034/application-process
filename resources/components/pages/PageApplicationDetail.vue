<script setup>
import {
    computed,
    inject,
    ref,
} from 'vue';

// eslint-disable-next-line import/no-cycle
import {
    STATES,
    useApplication,
} from '../../composables/resource-application';
import {
    useBreakpoints,
} from '../../composables/breakpoint';
import {
    emitUserAction,
} from '../../services/user-actions';
import {
    formatDate,
} from '../../utils/filter';
import '../../lang/application';

import AppApplicationActions from '../organisms/app/AppApplicationActions';
import AppApplicationDetail from '../organisms/app/AppApplicationDetail';
import AppBadge from '../atoms/app/AppBadge';
import AppBrandline from '../atoms/app/AppBrandline';
import AppButtonIconOnly from '../atoms/app/AppButtonIconOnly';
import AppRefreshPrompt from '../molecules/app/AppRefreshPrompt';
import LayoutDefault from '../layouts/LayoutDefault';
import LayoutDefaultDetail from '../layouts/LayoutDefaultDetail';
import LayoutMinimal from '../layouts/LayoutMinimal';
import ModalApiError from '../organisms/modal/ModalApiErrorAutoOpen';
import PageNotFound from './PageNotFound';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    subNavId: {
        default: null,
        type: String,
    },
});

const router = inject('router');
const {
    data: application,
    state,
    refetch,
    error,
} = useApplication({
    id: props.id,
});
const hasNotFoundPage = computed(() => error.value?.response?.status === 404);
const localSubNavId = ref(props.subNavId || 'application');
const { isMediumScreen } = useBreakpoints();
const isApplicationStateError = computed(() => state.value === STATES.isError);

const navigateBack = () => {
    if (router.currentRoute.meta.referrer.name === null) {
        let route = {
            name: 'page-applications',
        };

        if (application.value.status) {
            route = {
                ...route,
                query: { filter: application.value.status.toLowerCase() },
            };
        }

        return router.push(route);
    }

    return router.back();
};

async function confirmedDeleteCallback() {
    await router.push({ name: 'page-applications' });
}

</script>
<template>
    <Component
        :is="isMediumScreen ? LayoutDefault : LayoutMinimal"
        v-if="!hasNotFoundPage"
        :has-background-gray="isMediumScreen"
        :has-header="isMediumScreen"
        :has-footer="isMediumScreen"
        :is-content-full-height="isMediumScreen"
    >
        <ModalApiError :error="error"/>
        <Component
            :is="isMediumScreen ? LayoutDefaultDetail : 'div'"
            class="c-pageApplicationDetail"
        >
            <div
                v-if="application"
                class="c-pageApplicationDetail__header"
            >
                <AppBrandline/>
                <AppButtonIconOnly
                    icon="arrow-left"
                    size="l"
                    aria-label="Zurück"
                    data-qa="close detail"
                    @click.native="navigateBack"
                />
                <div class="c-pageApplicationDetail__headerTitle">
                    <span v-if="application.createDate">
                        {{ formatDate({
                            date: application.createDate,
                            format: `d.m.Y${application.isManual ? `` : `, h:i`}`,
                        }) }}
                    </span>
                    <AppBadge
                        v-if="application.status"
                        class="c-pageApplicationDetail__headerTitleStatus"
                        :dark="application.isRejected"
                        small
                    >
                        <template v-if="application.isRejected">
                            {{ $t(`application.status.rejected`) }}
                        </template>
                        <template v-else>
                            {{ $t(`application.status.${application.status.toLowerCase()}`) }}
                        </template>
                    </AppBadge>
                </div>
                <AppApplicationActions
                    v-if="!application.isRejected"
                    :application="application"
                    :has-callback-before-destroy="false"
                    @edit="emitUserAction('application-edit-application-detail')"
                    @memo="localSubNavId = 'memo'; emitUserAction(`application-${$event}-note-detail`)"
                    @open-modal-remove="emitUserAction('application-delete-detail')"
                    @open-popover="emitUserAction('application-open-popover-detail')"
                    @remove="confirmedDeleteCallback"
                    @status="emitUserAction('application-status-detail')"
                />
            </div>
            <div class="c-pageApplicationDetail__body">
                <div
                    v-if="isApplicationStateError"
                    class="c-pageApplicationDetail__refreshPrompt"
                >
                    <AppRefreshPrompt
                        data-qa="application state error"
                        :fetch="refetch"
                    />
                </div>
                <AppApplicationDetail
                    v-else
                    :application="application"
                    :is-loading="state === STATES.isLoading"
                    :active-sub-nav="localSubNavId"
                    :has-callback-before-destroy="false"
                    class="c-pageApplicationDetail__detail"
                    @click-link-sub-nav="localSubNavId = $event"
                    @memo="localSubNavId = 'memo'"
                    @remove="confirmedDeleteCallback"
                />
            </div>
        </Component>
    </Component>
    <PageNotFound
        v-else
        headline="Wir konnten diese Bewerbung nicht finden"
        text="Komisch, da ist was schief gelaufen, tut uns leid!
        Vielleicht findest du sie ja doch bei deinen restlichen Bewerbungen?"
        link-text="Zur Bewerbungsübersicht"
        to="page-applications"
    />
</template>

<style lang="scss">
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/font-size';
@import '../../assets/scss/settings/spacing';

.c-pageApplicationDetail {
    $refresh-prompt-padding-top: 3rem;

    &__header {
        display: flex;
        align-items: center;
        padding: $k-spacing--l $k-spacing--m;
        border-bottom: 1px solid $k-color-gray--100;

        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__headerTitle {
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
    }

    &__headerTitleStatus {
        margin-left: $k-spacing--s;
    }

    &__body {
        padding: $k-spacing--xl $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            padding: 0;
        }
    }

    &__detail {
        flex-grow: 1;
    }

    &__refreshPrompt {
        padding-top: $refresh-prompt-padding-top;
    }
}
</style>
