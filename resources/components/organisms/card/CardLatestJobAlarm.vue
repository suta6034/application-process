<script setup>
import AppBadge from '../../atoms/app/AppBadge';
import AppCupcake from '../../atoms/app/AppCupcake';
import AppLink from '../../atoms/app/AppLink';
import AppJobAlarmItem from '../app/AppJobAlarmItem';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import IllustrationEmptyJobAlarm from '../../illustrations/IllustrationEmptyJobAlarm';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useLatestJobAlarms,
} from '../../../composables/latest-job-alarms';

const {
    jobAlarmItems,
    jobAlarmCount,
    error,
    isLoading,
    fetch,
} = useLatestJobAlarms();
</script>

<template>
    <div class="c-cardLatestJobAlarm k-c-card k-c-card--noBorder">
        <div class="k-c-card__header">
            <div class="k-o-media k-o-media--s">
                <TextHeadline
                    :level="2"
                    size="l"
                    class="k-o-media__body _flexbox-min-width-fix"
                >
                    <span class="c-cardLatestJobAlarm__headlineOptional">
                        Mein
                    </span>
                    Job-Alarm
                </TextHeadline>
                <div
                    v-if="!error"
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
                        {{ jobAlarmCount }}
                    </AppBadge>
                </div>
            </div>
            <AppLink
                v-if="jobAlarmItems && jobAlarmItems.length"
                :to="{ name: 'page-job-alarm' }"
                data-qa="show all link"
                data-gtm-element="DB: Job Alarm"
                data-gtm-element-detail="Show All"
            >
                Alle anzeigen
            </AppLink>
        </div>
        <div class="k-c-card__body">
            <AppRefreshPrompt
                v-if="error"
                :fetch="fetch"
                data-qa="error state"
            />
            <AppCupcake
                v-else-if="!isLoading && jobAlarmItems && jobAlarmItems.length === 0"
                data-qa="empty state"
            >
                <template #cherry>
                    <IllustrationEmptyJobAlarm/>
                </template>
                <p>
                    Job-Alarm aktivieren und täglich neue passende Jobs bequem per E-Mail gesendet bekommen.
                </p>
                <template #action>
                    <AppLink
                        :to="{ name: 'page-job-alarm' }"
                        data-qa="job alarm link"
                    >
                        Zum Job-Alarm
                    </AppLink>
                </template>
            </AppCupcake>
            <ul
                v-else
                class="k-o-ladder k-o-ladder--l"
            >
                <template v-if="isLoading">
                    <li
                        v-for="n in 3"
                        :key="n"
                        class="k-o-ladder__rung"
                    >
                        <AppJobAlarmItem loading/>
                    </li>
                </template>
                <template v-else>
                    <li
                        v-for="jobAlarm in jobAlarmItems"
                        :key="jobAlarm.id"
                        class="k-o-ladder__rung"
                        data-qa="job alarm"
                    >
                        <AppJobAlarmItem :to="{ name: 'page-job-alarm-detail', params: { id: jobAlarm.id } }">
                            <template #headline>
                                {{ jobAlarm.attributes.title }}
                            </template>
                            <template
                                v-if="jobAlarm.meta.newJobsCount > 0"
                                #counter
                            >
                                <AppBadge primary>
                                    {{ jobAlarm.meta.newJobsCount }} Neu
                                </AppBadge>
                            </template>
                            <div class="k-o-chain k-o-chain--noWrap">
                                <span
                                    v-for="filter in jobAlarm.attributes.subtitle.split('•')"
                                    :key="filter"
                                    class="c-cardLatestJobAlarm__chainLink k-o-chain__link u-ellipsis"
                                >
                                    {{ filter }}
                                </span>
                            </div>
                        </AppJobAlarmItem>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/breakpoint';

.c-cardLatestJobAlarm {
    $min-chain-link-width: 2.625em;

    &__chainLink {
        display: inline-block !important;
        min-width: $min-chain-link-width;
    }

    &__headlineOptional {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: inline;
        }
    }
}
</style>
