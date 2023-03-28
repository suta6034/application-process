<script setup>
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';

defineProps({
    loading: {
        default: false,
        type: Boolean,
    },
    to: {
        type: [Object, String],
    },
});
</script>

<template>
    <div
        :is="to ? 'a' : 'div'"
        :href="to"
        class="c-appArticleCard k-c-card"
    >
        <div class="c-appArticleCard__img">
            <SkeletonBox
                v-if="loading"
                aspect-ratio="16/9"
                data-qa="skeleton box"
            />
            <slot
                v-else
                name="img"
            />
        </div>
        <div class="c-appArticleCard__body k-c-card__body">
            <div>
                <SkeletonBox
                    v-if="loading"
                    :min-width="60"
                    :max-width="90"
                    data-qa="skeleton box"
                />
                <slot
                    v-else
                    name="headline"
                />
            </div>
            <div>
                <SkeletonBox
                    v-if="loading"
                    :min-width="50"
                    :max-width="80"
                    data-qa="skeleton box"
                />
                <slot
                    v-else
                    name="text"
                />
            </div>
        </div>
        <div class="c-appArticleCard__footer k-c-card__footer">
            <div>
                <SkeletonBox
                    v-if="loading"
                    :min-width="30"
                    :max-width="90"
                    data-qa="skeleton box"
                />
                <slot
                    v-else
                    name="type"
                />
            </div>
            <div class="c-appArticleCard__meta">
                <SkeletonBox
                    v-if="loading"
                    :min-width="20"
                    :max-width="80"
                    data-qa="skeleton box"
                />
                <slot
                    v-else
                    name="meta"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appArticleCard {
    $body-height: 10em;

    display: block;
    flex-grow: 1;
    flex-shrink: 1;

    &__img {
        aspect-ratio: 16 / 9;
        overflow: hidden;

        > * {
            width: 100%;
            object-fit: cover;
        }
    }

    &__body {
        height: $body-height;
    }

    &__footer {
        display: flex;
        justify-content: start;
        margin-top: $k-spacing--m;
    }

    &__meta {
        margin-left: $k-spacing--s;
        color: $k-color-gray--100;
    }
}
</style>
