<script setup>
import {
    computed,
} from 'vue';

import AppButtonIconOnly from '../../atoms/app/AppButtonIconOnly';
import AppButtonIconOnlyGroup from '../app/AppButtonIconOnlyGroup';
import TextHeadline from '../../atoms/text/TextHeadline';

import '../../../directives/debounce-click';

import {
    formatFileSize,
} from '../../../utils/filter';

const props = defineProps({
    files: {
        type: Array,
        default: () => [],
    },
    isDownloadable: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['preview', 'download', 'delete']);

const sortedFiles = computed(() => {
    const isFileValidOrPending = file => file.url || file.progress;
    const sortAlphabeticallyAsc = (fileA, fileB) => {
        if (fileA.name < fileB.name) return -1;
        return 1;
    };
    return props.files.filter(isFileValidOrPending).sort(sortAlphabeticallyAsc);
});

// Get every character not including the last "."
const fileName = name => /(.*)\./.exec(name)?.[1];

// Get everything after + including the last occurence of "."
const fileEnding = name => /.+(\..+)$/.exec(name)?.[1];

// Exposing for unit test
defineExpose({ fileEnding, fileName });
</script>

<template>
    <ul
        class="c-formAttachmentList"
        :class="{
            'has-top-border': isDownloadable && sortedFiles.length > 0,
        }"
    >
        <li
            v-for="(file, index) in sortedFiles"
            :key="file.uuid || `${file.name}${index}`"
            :class="{
                'is-loading': file.progress,
            }"
            class="c-formAttachmentList__item"
            data-qa="file"
        >
            <div
                class="c-formAttachmentList__content"
                :class="{ 'is-loading': file.progress }"
            >
                <div class="k-o-distributeSpace c-formAttachmentList__file">
                    <div
                        :is="file.url ? 'a' : 'div'"
                        :href="file.url"
                        class="c-formAttachmentList__fileInfo k-o-media k-o-media--s"
                        target="_blank"
                    >
                        <TextHeadline
                            :level="3"
                            class="c-formAttachmentList__contentTitle"
                            :class="{ 'k-o-media__body': file.size }"
                        >
                            <span class="u-ellipsis">{{ fileName(file.name) }}</span>
                            <span class="c-formAttachmentList__titleEnding">{{ fileEnding(file.name) }}</span>
                        </TextHeadline>
                        <span
                            v-if="file.size"
                            class="c-formAttachmentList__size k-o-media__figure"
                            data-qa="file size"
                        >
                            {{ formatFileSize(file.size) }}
                        </span>
                    </div>
                    <AppButtonIconOnlyGroup v-if="!file.progress">
                        <AppButtonIconOnly
                            size="xl"
                            icon="preview"
                            :tag="file.url ? 'a' : 'button'"
                            :href="file.url"
                            target="_blank"
                            aria-label="Ansehen"
                            data-qa="preview link"
                            @click="emit('preview');"
                        />
                        <AppButtonIconOnly
                            v-if="isDownloadable && file.url"
                            size="xl"
                            icon="download"
                            :tag="file.url ? 'a' : 'button'"
                            :href="file.url"
                            :download="file.name"
                            aria-label="Download"
                            data-qa="download link"
                            @click="emit('download')"
                        />
                        <AppButtonIconOnly
                            v-if="file.deletable && !file.progress"
                            v-debounce-click
                            size="xl"
                            icon="dustbin"
                            tag="button"
                            aria-label="Löschen"
                            data-qa="delete link"
                            @click="emit('delete', file.uuid)"
                        />
                    </AppButtonIconOnlyGroup>
                </div>
                <div
                    v-if="file.progress"
                    class="c-formAttachmentList__progress"
                    data-qa="loading bar"
                >
                    <div
                        :style="{ width: `${file.progress}%` }"
                        class="c-formAttachmentList__progressBar"
                    />
                </div>
            </div>
        </li>
    </ul>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-formAttachmentList {
    $root: &;

    display: block;

    &.has-top-border {
        border-top: 1px solid $k-color-gray--200;
    }

    &__item {
        &:last-child {
            #{$root}__content {
                border-bottom: 0;
            }
        }
    }

    &__file {
        width: 49%; // 1
        gap: $k-spacing--s;

        @supports (display: grid) {
            width: auto;
        }

        &:nth-child(n+3) {
            margin-top: 2%; // 1

            @supports (display: grid) {
                margin-top: 0;
            }
        }

        &:nth-child(2n+2) {
            margin-left: 2%; // 1

            @supports (display: grid) {
                margin-left: 0;
            }
        }
    }

    &__inner {
        position: relative;
        display: block;
        overflow: hidden;
        border: 1px solid $k-color-gray--300;
        border-radius: $k-border-radius--s;
        text-align: center;

        &,
        &:hover,
        &:focus,
        &:visited {
            color: $k-color-gray--900;
        }
    }

    &__delete {
        position: absolute;
        top: $k-spacing--s;
        right: $k-spacing--s;
    }

    &__ribbon {
        @include k-typo-xs;

        position: absolute;
        top: 1.25em;
        right: -2.5em;
        padding: $k-spacing--xs;
        width: 9.5em;
        text-align: center;
        background-color: $k-color-green--600;
        color: $k-color-white;
        transform: rotate(45deg);
    }

    &__preview {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: $k-spacing--l;
        height: 9.5em;
        background: $k-color-gray--50;
        color: $k-color-gray--500;

        #{$root}__file.is-loading & {
            padding-right: $k-spacing--2xl;
            padding-left: $k-spacing--2xl;
        }
    }

    &__progress {
        align-self: start;
        margin-top: $k-spacing--s;
        width: 100%;
        height: 0.25em;
        border-radius: $k-border-radius--s;
        background-color: $k-color-gray--200;
    }

    &__progressBar {
        height: 100%;
        border-radius: inherit;
        background-color: $k-color-primary;
    }

    &__titleEnding {
        flex-shrink: 0;
    }

    &__contentTitle {
        display: inline-flex;
        max-width: 100%;
    }

    &__content {
        padding: $k-spacing--m $k-spacing--xs;
        width: 100%;
        border-bottom: 1px solid $k-color-gray--200;
    }

    &__fileInfo {
        align-items: center;
        min-width: 0;
        max-width: 70%;

        @media (min-width: $k-breakpoint--m) {
            max-width: 85%;
        }

        #{$root}__content.is-loading & {
            color: $k-color-gray--400;
        }
    }

    &__size {
        @include k-typo-s;

        color: $k-color-gray--500;
        word-wrap: break-word;
    }
}
</style>
