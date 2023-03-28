<script setup>
import {
    truncate,
} from '../../../utils/filter';
import AppArticleCard from '../app/AppArticleCard';
import AppRefreshPrompt from '../../molecules/app/AppRefreshPrompt';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useLatestBlogArticles,
} from '../../../composables/latest-blog-articles';

const {
    articles,
    error,
    isLoading,
    fetch,
} = useLatestBlogArticles();
</script>

<template>
    <div>
        <AppRefreshPrompt
            v-if="error"
            :fetch="fetch"
            data-qa="error state"
        />
        <ul
            v-else
            class="c-sliderBlogArticle__slides"
        >
            <template v-if="isLoading">
                <li
                    v-for="n in 4"
                    :key="n"
                    class="c-sliderBlogArticle__slide"
                >
                    <AppArticleCard :is-loading="true"/>
                </li>
            </template>
            <template v-else>
                <li
                    v-for="article in articles"
                    :key="article.id"
                    class="c-sliderBlogArticle__slide"
                >
                    <AppArticleCard
                        :to="article.attributes.uri"
                        data-qa="article"
                    >
                        <template #img>
                            <img
                                v-if="article.attributes.images"
                                class="c-sliderBlogArticle__img"
                                :src="article.attributes.images.versions.default.medium"
                                :alt="article.attributes.title"
                                data-qa="article img"
                            >
                        </template>
                        <template #headline>
                            <TextHeadline
                                :level="3"
                                size="l"
                                class="k-c-excerpt__headline c-sliderBlogArticle__headline"
                                bold
                            >
                                {{ article.attributes.title }}
                            </TextHeadline>
                        </template>
                        <template #text>
                            <div class="k-c-excerpt__snippet c-sliderBlogArticle__snippet">
                                {{ truncate(article.attributes.snippet, 65) }}
                            </div>
                        </template>
                        <template #type>
                            <div class="k-c-excerpt__metaEnd">
                                karriere.blog
                            </div>
                        </template>
                        <template #meta>
                            <div class="k-c-excerpt__metaEnd">
                                {{ article.attributes.date }}
                            </div>
                        </template>
                    </AppArticleCard>
                </li>
            </template>
        </ul>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/layout';
@import '~@karriereat/global-styles/scss/components/input/settings';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';

.c-sliderBlogArticle {
    $card-min-width: 15.2em;

    &__wrapper {
        display: flex;
        margin-top: $k-spacing--l;
    }

    &__slides {
        display: flex;
        column-gap: $k-spacing--m;
        justify-content: space-between;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: $k-spacing--xl;
    }

    &__slide {
        @include k-layout__item(math.div(3, 12));

        display: flex;
        min-width: $card-min-width;
    }

    &__headline,
    &__snippet {
        // plz remove if vendor prefixes are not necessary anymore https://caniuse.com/css-line-clamp
        /* stylelint-disable-next-line value-no-vendor-prefix */
        display: -webkit-box;
        -webkit-line-clamp: 3;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
