<script setup>
import {
    computed,
} from 'vue';

import {
    STATES,
    useProfileViewList,
} from '../../../composables/resource-profile-views';

import AppBadge from '../../atoms/app/AppBadge';
import AppLink from '../../atoms/app/AppLink';
import AppProfileViews from '../../molecules/app/AppProfileViews';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';

const MAX_DISPLAY_PROFILE_VIEWS = 3;

const {
    data: profileViews,
    pagination,
    refetch,
    state,
} = useProfileViewList();

const isError = computed(() => state.value === STATES.isError);
const isLoading = computed(() => state.value === STATES.isLoading);

const uniqueTopThreeProfileViews = computed(() => {
    if (profileViews?.value?.length < MAX_DISPLAY_PROFILE_VIEWS) return profileViews.value;
    return profileViews?.value?.slice(0, MAX_DISPLAY_PROFILE_VIEWS);
});
</script>

<template>
    <div class="c-cardLatestProfileViews k-c-card k-c-card--noBorder">
        <div class="k-c-card__header">
            <div class="k-o-media k-o-media--s">
                <TextHeadline
                    :level="2"
                    size="l"
                    class="k-o-media__body _flexbox-min-width-fix"
                >
                    Aufrufe
                </TextHeadline>
                <div
                    v-if="!isError"
                    class="k-o-media__figure"
                >
                    <SkeletonBox
                        v-if="isLoading"
                        width="1.875em"
                        height="1.375em"
                    />
                    <AppBadge
                        v-else
                        data-qa="counter"
                    >
                        {{ pagination ? pagination.total : 0 }}
                    </AppBadge>
                </div>
            </div>
            <AppLink
                v-if="pagination && pagination.total"
                :to="{ name: 'page-views' }"
                data-qa="show all link"
                data-gtm-element="DB: Profile Views"
                data-gtm-element-detail="Show All"
            >
                Alle anzeigen
            </AppLink>
        </div>
        <div class="k-c-card__body">
            <AppRefreshPrompt
                v-if="isError"
                :fetch="refetch"
                data-qa="error state"
            />
            <AppProfileViews
                v-else
                :profile-views="uniqueTopThreeProfileViews"
                :is-loading="isLoading"
                :total="pagination && pagination.total"
                data-qa="profile views dashboard"
            />
        </div>
    </div>
</template>
