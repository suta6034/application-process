<script setup>
import {
    formatDate,
} from '../../../utils/filter';
import {
    STATUS,
} from '../../../services/application';

import AppIcon from '../../atoms/app/AppIcon';

const STATUS_ICON_MAP = {
    [STATUS.applied]: 'check-default',
    [STATUS.confirmed]: 'check-default',
    [STATUS.invited]: 'tag',
    [STATUS.rejected]: 'cross',
    [STATUS.archived]: 'check-default',
};

defineProps({
    applicationCreateDate: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <ul class="c-appApplicationTimelineItems">
        <template v-for="(applicationStatus, i) in items">
            <li
                :key="applicationStatus.id"
                class="c-appApplicationTimelineItems__item k-o-media"
                data-qa="timeline item"
            >
                <div class="c-appApplicationTimelineItems__figure k-o-media__figure">
                    <AppIcon :name="STATUS_ICON_MAP[applicationStatus.attributes.status]"/>
                </div>
                <div class="c-appApplicationTimelineItems__body k-o-media__body">
                    <strong data-qa="status text">
                        <template v-if="applicationStatus.attributes.status === STATUS.invited">
                            Status „{{ $t(`application.status.${applicationStatus.attributes.status.toLowerCase()}`) }}“
                        </template>
                        <template v-else>
                            {{ $t(`application.status.${applicationStatus.attributes.status.toLowerCase()}`) }}
                        </template>
                    </strong>
                    <div
                        class="c-appApplicationTimelineItems__date"
                        data-qa="status date"
                    >
                        {{ formatDate({
                            date: i === 0 ? applicationCreateDate : applicationStatus.meta.createDate,
                            format: 'd. F Y',
                        }) }}
                    </div>
                </div>
            </li>
            <li
                v-if="applicationStatus.attributes.status === STATUS.invited && applicationStatus.attributes.statusDate"
                :key="`${applicationStatus.id}-extra`"
                class="c-appApplicationTimelineItems__item k-o-media"
                data-qa="timeline item"
            >
                <div class="c-appApplicationTimelineItems__figure k-o-media__figure">
                    <AppIcon name="calendar"/>
                </div>
                <div class="c-appApplicationTimelineItems__body k-o-media__body">
                    <strong data-qa="status text">
                        Gespräch am
                        {{ formatDate({ date: applicationStatus.attributes.statusDate, format: 'd.m.Y' }) }}
                    </strong>
                    <div
                        class="c-appApplicationTimelineItems__date"
                        data-qa="status date"
                    >
                        {{ formatDate({ date: applicationStatus.meta.changeDate, format: 'd. F Y' }) }}
                    </div>
                </div>
            </li>
        </template>
    </ul>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appApplicationTimelineItems {
    $root: &;
    $color-background: $k-color-gray--100;
    $size-figure: 25px;

    overflow: hidden;

    &__item {
        position: relative;
        background-color: $color-background;

        &:not(:first-child) {
            margin-top: $k-spacing--xl;
        }

        &:not(:last-child) {
            &::before {
                position: absolute;
                top: $size-figure;
                left: math.floor(math.div($size-figure, 2));
                width: 1px;
                height: 100%;
                background-color: $k-color-gray--300;
                content: '';
            }
        }
    }

    &__figure {
        display: flex;
        justify-content: center;
        align-items: center;
        width: $size-figure;
        height: $size-figure;
        border-radius: 50%;
        background-color: $k-color-gray--500;
        color: $k-color-white;
    }

    &__date {
        color: $k-color-gray--700;
    }
}
</style>
