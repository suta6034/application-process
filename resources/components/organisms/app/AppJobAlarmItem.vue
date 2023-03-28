<script setup>
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';
import TextHeadline from '../../atoms/text/TextHeadline';

defineProps({
    loading: {
        default: false,
        type: Boolean,
    },
    to: {
        type: Object,
    },
});
</script>

<template>
    <div
        :is="to ? 'router-link' : 'div'"
        :to="to"
        class="c-appJobAlarmItem k-c-excerpt u-partial-hover-parent"
        data-gtm-element="DB: Job Alarm"
        data-gtm-element-detail="Open Detail"
    >
        <h3
            class="c-appJobAlarmItem__headline k-c-excerpt__headline u-partial-hover-child"
            data-qa="headline"
        >
            <SkeletonBox
                v-if="loading"
                :min-width="50"
                :max-width="70"
                data-qa="skeleton box"
            />
            <template v-else>
                <TextHeadline
                    :level="4"
                    size="l"
                    class="u-ellipsis"
                    bold
                >
                    <slot name="headline"/>
                </TextHeadline>
                <span
                    v-if="$slots.counter"
                    class="c-appJobAlarmItem__counter"
                    data-qa="counter"
                >
                    <slot name="counter"/>
                </span>
            </template>
        </h3>
        <div
            class="k-c-excerpt__snippet"
            data-qa="snippet"
        >
            <SkeletonBox
                v-if="loading"
                data-qa="skeleton box"
            />
            <slot v-else/>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/spacing';

.c-appJobAlarmItem {
    &__headline {
        display: flex;
        align-items: center;
    }

    &__counter {
        margin-left: $k-spacing--s;
    }
}
</style>
