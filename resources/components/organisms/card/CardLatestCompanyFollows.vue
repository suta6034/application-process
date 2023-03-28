<script setup>
import {
    computed,
    onMounted,
    ref, watch,
} from 'vue';

import * as companyFollowService from '../../../services/company-follow';
import * as mailSubscription from '../../../services/mail-subscription';

import AppBadge from '../../atoms/app/AppBadge';
import AppCompanyViewsItem from '../app/AppCompanyViewsItem';
import AppIcon from '../../atoms/app/AppIcon';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useResourceEndpointGet,
} from '../../../composables/resource-endpoint';
import {
    showSnackbar,
} from '../../../utils/snackbar';

const {
    data,
    error,
    get: fetch,
    isLoading,
} = useResourceEndpointGet({
    endpoint: companyFollowService.latest,
    type: 'companyFollowCard',
    requestKey: `GET|${companyFollowService.baseUrl}`,
});

onMounted(() => fetch());

const companies = computed(() => data.value?.data || []);
const reformatCompanies = companiesToReformat => companiesToReformat.map(company => (
    {
        id: company.id,
        name: company.attributes?.name,
        image: company.attributes?.image,
        previewVideo: company.attributes?.previewVideo,
        typeId: company.attributes?.typeId,
        branches: company.attributes?.jobFields.join(', '),
        jobCount: company.attributes?.jobCount,
        logo: company.attributes?.logos?.companysmall,
        url: {
            ...company.attributes?.url,
        },
        locations: company.attributes?.locations.join(', '),
        isActive: true,
    }
));

const followCount = computed(() => data.value?.meta.count || 0);

// Array of company-ids of followed jobs as a workaround for Vue 2 reactivity caveats (no new key)
const subscribedCompanies = ref([]);

watch(companies, (retrievedCompanies) => {
    retrievedCompanies.forEach(company => subscribedCompanies.value.push(company.id));
});

const mailNotificationInterval = async () => {
    const { data: { subscriptionInterval } } = await mailSubscription.getCompanyAlarmSubscriptionInterval();
    return subscriptionInterval;
};

const unSubscribe = async (id) => {
    // Optimistic UI: Update star without waiting for API response first
    const index = subscribedCompanies.value.indexOf(id);
    subscribedCompanies.value.splice(index, 1);

    await companyFollowService.unwatch(id);
    const text = await mailNotificationInterval() === mailSubscription.MAIL_NEVER
        ? 'Du folgst dieser Firma ab sofort nicht mehr.'
        : 'Du erhältst ab sofort keine Jobs dieser Firma mehr per E-Mail.';
    showSnackbar({
        text,
        icon: 'check',
    });
};

const subscribe = async (id) => {
    // Optimistic UI: Update star without waiting for API response first
    subscribedCompanies.value.push(id);

    await companyFollowService.watch(id);
    const text = await mailNotificationInterval() === mailSubscription.MAIL_WEEKLY
        ? 'Ab sofort erhältst du wöchentlich neue Jobs dieser Firma per E-Mail.'
        : 'Ab sofort erhältst du täglich neue Jobs dieser Firma per E-Mail.';
    showSnackbar({
        text,
        icon: 'check',
    });
};
</script>
<template>
    <div class="c-cardLatestCompanyFollows">
        <div class="c-cardLatestCompanyFollows__header k-o-distributeSpace">
            <div class="k-o-media k-o-media--s">
                <TextHeadline
                    :level="2"
                    size="l"
                    class="k-o-media__body _flexbox-min-width-fix"
                >
                    Mein Firmen-Alarm
                </TextHeadline>
                <div class="k-o-media__figure">
                    <SkeletonBox
                        v-if="isLoading"
                        width="1.875em"
                        height="1.375em"
                    />
                    <AppBadge
                        v-else-if="!error"
                        data-qa="counter"
                    >
                        {{ followCount }}
                    </AppBadge>
                </div>
            </div>
            <router-link
                v-if="companies && companies.length"
                :to="{ name: 'page-companyalarm' }"
                class="k-c-link"
                data-qa="show all link"
                data-gtm-element="DB: Company Alarm"
                data-gtm-element-detail="Show All"
            >
                Alle anzeigen
            </router-link>
        </div>
        <div>
            <AppRefreshPrompt
                v-if="error"
                :fetch="fetch"
                data-qa="error state"
            />
            <div
                v-else-if="!isLoading && companies && companies.length === 0"
                class="empty state"
                data-qa="empty state"
            >
                <p class="c-cardLatestCompanyFollows__text">
                    Du willst die neuesten Jobausschreibungen deines Wunscharbeitgebers nicht verpassen?
                    Dann folge ihren Profilen, damit wir dich topaktuell per E-Mail informieren können!
                </p>
                <div>
                    <ul class="c-cardLatestCompanyFollows__cardsWarp">
                        <li
                            v-for="n in 3"
                            :key="n"
                            class="c-cardLatestCompanyFollows__content c-cardLatestCompanyFollows__empty"
                            data-qa="empty company"
                        >
                            <AppCompanyViewsItem has-no-border>
                                <template #footer>
                                    <AppIcon
                                        name="heart-filled"
                                        size="l"
                                        class="c-cardLatestCompanyFollows__icon"
                                        data-qa="disabled"
                                    />
                                    <span data-qa="disabled">
                                        0 Jobs
                                    </span>
                                </template>
                            </AppCompanyViewsItem>
                        </li>
                    </ul>
                    <div class="c-cardLatestCompanyFollows__center">
                        <router-link
                            :to="{ name: 'page-company' }"
                            class="k-c-link"
                            data-qa="search companies button"
                        >
                            Jetzt Firmen suchen
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-else>
                <ul class="c-cardLatestCompanyFollows__cardsWarp">
                    <template v-if="isLoading">
                        <li
                            v-for="n in 3"
                            :key="n"
                            class="c-cardLatestCompanyFollows__content"
                        >
                            <AppCompanyViewsItem :is-loading="isLoading"/>
                        </li>
                    </template>
                    <template v-else>
                        <li
                            v-for="company in reformatCompanies(companies)"
                            :key="company.id"
                            class="c-cardLatestCompanyFollows__content"
                            data-qa="company"
                        >
                            <AppCompanyViewsItem
                                :to="{ path: company.url.company }"
                                :company="company"
                                has-no-border
                                data-qa="company2"
                                data-gtm-element="DB: Company Alarm"
                                data-gtm-element-detail="Open Detail"
                            >
                                <template #footer>
                                    <span>
                                        <button
                                            v-show="subscribedCompanies.includes(company.id)"
                                            class="c-cardLatestCompanyFollows__watchToggle"
                                            data-qa="unwatch"
                                            data-gtm-element="DB: Company Alarm"
                                            data-gtm-element-detail="Unfollow Click"
                                            aria-label="Nicht mehr beobachten"
                                            @click.prevent="unSubscribe(company.id)"
                                        >
                                            <AppIcon
                                                name="heart-filled"
                                                size="l"
                                                class="c-cardLatestCompanyFollows__icon"
                                            />
                                            <span class="c-cardLatestCompanyFollows__label">
                                                Firma gefolgt
                                            </span>
                                        </button>
                                        <button
                                            v-show="!subscribedCompanies.includes(company.id)"
                                            class="c-cardLatestCompanyFollows__watchToggle"
                                            data-qa="watch"
                                            data-gtm-element="DB: Company Alarm"
                                            data-gtm-element-detail="Follow Click"
                                            aria-label="Beobachten"
                                            @click.prevent="subscribe(company.id)"
                                        >
                                            <AppIcon
                                                name="heart"
                                                size="l"
                                                class="c-cardLatestCompanyFollows__icon"
                                            />
                                            <span class="c-cardLatestCompanyFollows__label">
                                                Firma folgen
                                            </span>
                                        </button>
                                    </span>
                                    <span>
                                        <router-link
                                            v-if="company.jobCount"
                                            :to="{ path: company.url.jobs }"
                                            class="k-c-link"
                                            data-qa="jobs link"
                                        >
                                            <template v-if="company.jobCount === 1">
                                                {{ company.jobCount }} Job
                                            </template>
                                            <template v-else>
                                                {{ company.jobCount }} Jobs
                                            </template>
                                        </router-link>
                                    </span>
                                </template>
                            </AppCompanyViewsItem>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/tools/surface-boost';
@import '../../../assets/scss/tools/wrap';
@import '~@karriereat/global-styles/scss/tools/layout';

.c-cardLatestCompanyFollows {
    &__header {
        padding-top: $k-spacing--m;
        padding-bottom: $k-spacing--m;
    }

    &__text {
        margin-bottom: $k-spacing--l;
        color: $k-color-gray--500;
    }

    &__cardsWarp {
        @include k-layout;

        margin-bottom: $k-spacing--l;
    }

    &__content {
        @include k-layout__item(math.div(12, 12));

        list-style: none;

        @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
            @include k-layout__item(math.div(4, 12));
        }
    }

    &__empty {
        &:not(:first-child) {
            display: none;
        }

        @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
            &:not(:first-child) {
                display: block;
            }
        }
    }

    &__label {
        margin-left: $k-spacing--2xs;
    }

    &__icon {
        margin-bottom: $k-spacing--2xs;
    }

    &__center {
        display: flex;
        justify-content: center;
        margin-top: $k-spacing--xl;
    }

    &__watchToggle {
        @include surface-boost;

        border: none;
        background-color: transparent;
        color: $k-color-primary--dark;
        cursor: pointer;
        transition: color 0.2s;

        &:focus,
        &:hover {
            color: $k-color-green--800;
        }
    }
}
</style>
