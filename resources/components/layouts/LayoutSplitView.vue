<script setup>
import {
    watch,
    ref,
} from 'vue';
import {
    isEmbedded,
} from '../../utils/frame-check';
import {
    usePagination,
} from '../../composables/pagination';

import AppFooter from '../organisms/app/AppFooter';
import AppHeader from '../organisms/app/AppHeader';
import NavSub from '../molecules/nav/NavSub';
import ProgressLoadingBar from '../atoms/progress/ProgressLoadingBar';
import {
    COLUMN,
} from '../../utils/column-types';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    detailOpen: {
        type: Boolean,
        default: false,
    },
    stickyColumn: {
        type: String,
        required: true,
        validator: value => COLUMN[value] !== undefined,
    },
});

const listColumn = ref(null);
const { page } = usePagination();
// this could be removed if list might not be sticky anymore
watch(page, () => {
    if (props.stickyColumn === COLUMN.list) listColumn.value.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<template>
    <div class="c-layoutSplitView">
        <header class="c-layoutSplitView__header">
            <AppHeader data-qa="main header"/>
        </header>
        <main class="c-layoutSplitView__main">
            <template v-if="!isEmbedded()">
                <NavSub
                    class="c-layoutSplitView__navSub"
                    @click-link="$emit('click-link', $event)"
                />
                <ProgressLoadingBar/>
            </template>
            <div
                v-if="$slots.full"
                class="c-layoutSplitView__full"
            >
                <slot name="full"/>
            </div>
            <div
                v-else
                class="c-layoutSplitView__split"
            >
                <div
                    ref="listColumn"
                    class="c-layoutSplitView__list"
                    :class="{'c-layoutSplitView__list--sticky' : stickyColumn === COLUMN.list }"
                    data-qa="list column"
                >
                    <div>
                        <div
                            v-if="$slots['list-top']"
                            class="c-layoutSplitView__listTop"
                        >
                            <slot name="list-top"/>
                        </div>
                        <ul v-if="$slots['list-main']">
                            <slot name="list-main"/>
                        </ul>
                        <div
                            v-if="$slots['list-meta']"
                            class="c-layoutSplitView__listMeta"
                            data-qa="motivation letter hint"
                        >
                            <slot name="list-meta"/>
                        </div>
                        <nav
                            v-if="!loading && $slots['list-pagination']"
                            class="c-layoutSplitView__pagination"
                        >
                            <slot name="list-pagination"/>
                        </nav>
                    </div>
                    <footer class="c-layoutSplitView__footer">
                        <AppFooter
                            variant="minimal"
                            :transparent="true"
                            align="center"
                            data-qa="main footer"
                        />
                    </footer>
                </div>
                <div
                    class="c-layoutSplitView__detailColumn"
                    data-qa="detail column"
                >
                    <div
                        class="c-layoutSplitView__detail"
                        :class="{'c-layoutSplitView__detail--sticky' : stickyColumn === COLUMN.detail }"
                    >
                        <slot name="detail"/>
                    </div>
                </div>
            </div>
        </main>
        <slot/>
    </div>
</template>

<style lang="scss">
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';

.c-layoutSplitView {
    $root: &;
    $split-width: 1600px;
    $list-width-m: 310px;
    $list-width-l: 420px;
    $detail-min-width-m: 420px;
    $detail-scroll-height: 800px;

    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__full {
        display: flex;
        flex-grow: 1;
    }

    &__main {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }

    &__listMeta {
        margin-top: $k-spacing--l;
        margin-bottom: $k-spacing--xl;
        text-align: center;
        color: $k-color-gray--500;
    }

    &__split {
        display: flex;
        flex-grow: 1;
        margin-top: $k-spacing--m;
        margin-right: auto;
        margin-left: auto;
        max-width: $split-width;
        width: 100%;
    }

    &__list {
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;

        @media (min-width: $k-breakpoint--m) {
            width: $list-width-m;
            border-right: 1px solid $k-color-gray--100;
        }
        @media (min-width: $k-breakpoint--l) {
            margin-right: $k-spacing--m;
            width: $list-width-l;
            border-right: 0;
        }

        &--sticky {
            position: sticky;
            top: 0;
            overflow-y: auto;
            height: 100vh;
        }
    }

    &__list,
    &__footer,
    &__detailColumn {
        background: $k-color-white;
    }

    &__listTop {
        padding-top: $k-spacing--l;
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
    }

    &__pagination {
        padding-top: $k-spacing--xl;
    }

    &__footer {
        padding-top: $k-spacing--s;
    }

    &__detailColumn {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            position: relative;
            display: block;
            flex-grow: 1;
            min-width: $detail-min-width-m;
        }
    }

    &__detail {
        height: 100%;

        &--sticky {
            position: sticky;
            top: 0;
            overflow-y: auto;
            max-height: 100vh;
        }

        @media (min-width: $k-breakpoint--m) {
            padding: $k-spacing--l;
        }
    }
}
</style>
