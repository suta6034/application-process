<script setup>
import TextHeadline from '../../atoms/text/TextHeadline';

defineProps({
    to: {
        type: Object,
    },
    hoverPartial: {
        default: true,
        type: Boolean,
    },
    emptyState: {
        default: false,
        type: Boolean,
    },
    horizontalLine: {
        default: false,
        type: Boolean,
    },
    hasFigure: {
        default: true,
        type: Boolean,
    },
    items: {
        default: () => [],
        type: Array,
    },
});

const emit = defineEmits(['selected']);
</script>

<template>
    <div class="c-appCvItem">
        <div class="k-o-distributeSpace">
            <div
                class="c-appCvItem__wrapper"
                :class="{
                    'u-partial-hover-parent': hoverPartial,
                    'isEmptyState': emptyState,
                }"
            >
                <div class="k-o-media">
                    <div
                        v-if="hasFigure"
                        class="k-o-media__figure"
                        :class="{'c-appCvItem__hideFigure': !emptyState}"
                        data-qa="icon"
                    >
                        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                        <div
                            class="k-c-imageBox"
                            :class="{'c-appCvItem__figureWrap': emptyState}"
                            @click="emit('selected')"
                        >
                            <div
                                class="c-appCvItem__figure"
                                :class="{'c-appCvItem__figure--empty': emptyState}"
                            >
                                <slot name="figure"/>
                            </div>
                        </div>
                    </div>
                    <div
                        class="c-appCvItem__body"
                        :class="{
                            'c-appCvItem__body--withoutMediaItem': !hasFigure,
                        }"
                    >
                        <div class="k-c-excerpt k-o-distributeSpace c-appCvItem__contentWrap">
                            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                            <div
                                class="c-appCvItem__content"
                                @click="emit('selected')"
                            >
                                <TextHeadline
                                    v-if="$slots.headline"
                                    :level="3"
                                    class="k-c-excerpt__headline u-word-break"
                                    :class="{
                                        'u-partial-hover-child': hoverPartial,
                                    }"
                                    :size="emptyState ? 'm' : 'l'"
                                    :bold="!emptyState"
                                    data-qa="headline"
                                >
                                    <slot name="headline"/>
                                </TextHeadline>
                                <div
                                    v-if="$slots.snippet"
                                    class="k-c-excerpt__snippet c-appCvItem__snippet u-word-break"
                                    :class="{'c-appCvItem__snippetEmpty': emptyState}"
                                    data-qa="snippet"
                                >
                                    <slot name="snippet"/>
                                </div>
                                <div
                                    v-if="$slots['meta-end']"
                                    class="k-c-excerpt__metaEnd c-appCvItem__metaEnd"
                                    :class="{'c-appCvItem__metaEmpty': emptyState}"
                                >
                                    <slot name="meta-end"/>
                                </div>
                            </div>
                            <div
                                v-if="$slots.action"
                                class="c-appCvItem__action"
                                @click.stop
                            >
                                <slot name="action"/>
                            </div>
                        </div>
                        <div
                            v-if="$slots.form"
                            class="c-appCvItem__form"
                            :class="{
                                'c-appCvItem__formInline': $slots.snippet || $slots.headline,
                                'c-appCvItem__lastElement': !horizontalLine,
                            }"
                        >
                            <slot name="form"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr
            v-if="horizontalLine"
            class="c-appCvItem__line k-c-textDivider__line"
            :class="{'c-appCvItem__emptyForm': !($slots.snippet || $slots.headline)}"
        >
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appCvItem {
    $root: &;

    position: relative;

    &__wrapper {
        width: 100%;
    }

    &__hideFigure {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: block;
        }
    }

    &__figureWrap {
        margin-right: $k-spacing--m;

        @media (min-width: $k-breakpoint--m) {
            margin-right: 0;
        }
    }

    &__figure {
        margin: $k-spacing--s;
        color: $k-color-gray--300;

        &--empty {
            color: $k-color-green--700;
        }
    }

    &__body {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        margin-left: 0;
        max-width: 100%;

        @media (min-width: $k-breakpoint--m) {
            margin-left: $k-spacing--m;
        }

        &--withoutMediaItem {
            margin-left: 0;
        }
    }

    &__contentWrap {
        width: 100%;
        height: 100%;
    }

    &__content {
        flex-grow: 1;
        align-self: center;
    }

    &__snippet {
        margin-top: 0;
    }

    &__snippetEmpty {
        margin-top: $k-spacing--2xs;
        color: $k-color-gray--500;
    }

    &__metaEnd {
        margin-top: 0;
    }

    &__metaEmpty {
        display: none;
    }

    &__form {
        margin-bottom: $k-spacing--3xl;
    }

    &__formInline {
        margin-top: $k-spacing--l;
    }

    &__lastElement {
        margin-bottom: $k-spacing--xl;
    }

    &__emptyForm {
        margin-bottom: $k-spacing--xl;
    }

    &__action {
        margin-left: $k-spacing--m;
    }

    &.isEmptyState {
        color: $k-color-green--700;
        text-decoration: none;

        #{$root}:hover &,
        #{$root}:focus & {
            color: $k-c-link-color-hover;
        }
    }

    &__line {
        display: block;
    }
}
</style>
