<script setup>
import {
    emitUserAction,
} from '../../../services/user-actions';

import {
    STATES,
    useApplicationStatusList,
} from '../../../composables/resource-application-status';

import AppApplicationTimelineItems from './AppApplicationTimelineItems';
import AppButton from '../../atoms/app/AppButton';
import AppCollapsible from '../../molecules/app/AppCollapsible';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import {
    useMutations,
} from '../../../composables/vuex-helpers';

const props = defineProps({
    application: {
        type: Object,
        required: true,
    },
});

const {
    data,
    refetch,
    state,
} = useApplicationStatusList({ id: props.application.id });

const { SHOW_POPUP: showModal } = useMutations('popup');

function openStatusApplicationModal() {
    showModal({
        componentName: 'ModalApplicationsItemStatus',
        componentProps: {
            applicationId: props.application.id,
            status: props.application.status,
            statusDate: props.application.statusDate,
            gaPrefix: 'AP_D',
        },
    });
}
</script>

<template>
    <div
        class="c-appApplicationTimeline"
        data-qa="application timeline"
    >
        <AppCollapsible class="c-appApplicationTimeline__collapsible">
            <template #label>
                <span class="c-appApplicationTimeline__collapsibleLabel">
                    Bewerbungsverlauf ansehen
                </span>
            </template>
            <template #content>
                <AppButton
                    width="full"
                    class="c-appApplicationTimeline__editStatusButton"
                    size="s"
                    outline="outlineGray"
                    data-qa="edit status button"
                    data-gtm-element="AP_D: Application State"
                    data-gtm-element-detail="Edit"
                    @click="openStatusApplicationModal(); emitUserAction('application-state-edit')"
                >
                    Status bearbeiten
                </AppButton>
                <div class="c-appApplicationTimeline__collapsibleContent">
                    <AppApplicationTimelineItems
                        v-if="data"
                        :application-create-date="application.createDate"
                        :items="data"
                    />
                    <AppRefreshPrompt
                        v-if="state === STATES.isError"
                        :fetch="refetch"
                        data-qa="error state"
                    />
                </div>
            </template>
        </AppCollapsible>
        <div class="c-appApplicationTimeline__column">
            <AppButton
                size="s"
                outline="outlineGray"
                data-qa="edit status button"
                data-gtm-element="AP_D: Application State"
                data-gtm-element-detail="Edit"
                @click="openStatusApplicationModal(); emitUserAction('application-state-edit')"
            >
                Status bearbeiten
            </AppButton>
            <AppApplicationTimelineItems
                v-if="data"
                class="c-appApplicationTimeline__itemList"
                :application-create-date="application.createDate"
                :items="data"
            />
            <AppRefreshPrompt
                v-if="state === STATES.isError"
                :fetch="refetch"
                data-qa="error state"
            />
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appApplicationTimeline {
    $color-background: $k-color-gray--100;

    background-color: $color-background;

    &__collapsible {
        padding: $k-spacing--m $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__collapsibleLabel {
        font-weight: bold;
    }

    &__collapsibleContent,
    &__editStatusButton,
    &__itemList {
        margin-top: $k-spacing--xl;
    }

    &__column {
        display: none;
        padding: $k-spacing--xl;
        padding-bottom: $k-spacing--2xl;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
    }
}
</style>
