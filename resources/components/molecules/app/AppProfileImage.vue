<script setup>
import {
    computed, ref,
} from 'vue';
import SvgAvatarPlaceholder from '../../atoms/svg/SvgAvatarPlaceholder';
import SvgImageEditor from '../../atoms/svg/SvgImageEditor';
import {
    useImageEditor,
} from '../../../composables/image-editor';
import {
    useGetters,
} from '../../../composables/vuex-helpers';

const { showImageEditor, acceptedImageFormats } = useImageEditor();
defineProps({
    rectangle: {
        type: Boolean,
        default: false,
    },
    round: {
        type: Boolean,
        default: true,
    },
    roundSmall: {
        type: Boolean,
        default: false,
    },
    placeholderWithoutEffects: {
        type: Boolean,
        default: false,
    },
    nameInitials: {
        type: String,
        validator: (value) => {
            if (value === null) return true; // showing image when exists
            if (value === 'placeholder') return true; // showing placeholder
            if (typeof value === 'string' && value.length === 2) return true; // showing initials
            return false;
        },
    },
});

const showImageFallback = ref(false);
const showOverlay = ref(false);

const {
    imageVersion,
} = useGetters('profile');

const imageUrlRound = computed(() => imageVersion.value('square')?.url);
const imageUrlPortrait = computed(() => imageVersion.value('small')?.url);
const imageUrlSrcset = computed(() => `${imageVersion.value('square.large')?.url} 1.5x`);
</script>

<template>
    <div
        :class="{
            'c-appProfileImage--roundSmall': roundSmall,
            'c-appProfileImage--round': round,
            'c-appProfileImage--rectangle': rectangle,
        }"
        class="c-appProfileImage"
    >
        <template
            v-if="round"
        >
            <img
                v-if="imageUrlRound && !showImageFallback && !nameInitials"
                :src="imageUrlRound"
                :srcset="imageUrlSrcset"
                class="c-appProfileImage__image c-appProfileImage__round"
                alt="Profilbild"
                data-qa="image"
                @error="showImageFallback = true"
            >
            <template v-else>
                <div
                    v-if="nameInitials && nameInitials !== 'placeholder'"
                    class="c-appProfileImage__initials"
                >
                    <div class="c-appProfileImage__initialsText">
                        {{ nameInitials }}
                    </div>
                </div>
                <SvgAvatarPlaceholder
                    v-else
                    class="c-appProfileImage__placeholder"
                    :class="{ 'c-appProfileImage__placeholderWithoutEffects' : placeholderWithoutEffects }"
                    data-qa="placeholder"
                />
            </template>
        </template>
        <template
            v-else
        >
            <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
            <div
                v-if="imageUrlPortrait && !showImageFallback && !nameInitials"
                class="c-appProfileImage__wrapper"
                @mouseover="showOverlay = true"
                @mouseleave="showOverlay = false"
            >
                <div
                    v-if="showOverlay"
                    class="c-appProfileImage__overlay"
                >
                    <SvgImageEditor
                        class="c-appProfileImage__placeholder"
                        data-qa="placeholder"
                        transparent
                    />
                </div>
                <button
                    class="c-appProfileImage__trigger"
                    data-qa="upload trigger"
                    @click="showImageEditor"
                >
                    <img
                        :src="imageUrlPortrait"
                        :class="{ 'c-appProfileImage__image--mouseover': showOverlay}"
                        class="c-appProfileImage__image"
                        alt="Profilbild"
                        data-qa="image"
                        @error="showImageFallback = true"
                    >
                </button>
            </div>
            <div v-else>
                <label
                    for="image"
                    class="c-appProfileImage__trigger"
                    data-qa="upload trigger"
                >
                    <input
                        id="image"
                        :accept="acceptedImageFormats"
                        class="c-appProfileImage__input"
                        type="file"
                        data-qa="image input"
                        @change="showImageEditor"
                    >
                    <SvgImageEditor
                        class="c-appProfileImage__placeholder"
                        data-qa="placeholder"
                    />
                </label>
            </div>
            <div/>
        </template>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '@karriereat/global-styles/scss/tools/typo';

.c-appProfileImage {
    $root: &;
    $width: 80px;
    $height: 80px;
    $width-small: 51px;
    $height-small: 51px;
    $size-initials: $k-spacing--2xl;
    $width-portrait: 50px;
    $height-portrait: 67px;

    position: relative;

    &__wrapper {
        position: relative;
    }

    &__overlay {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    &__image,
    &__placeholder,
    &__placeholderOverlay {
        display: block;
        margin-right: auto;
        margin-left: auto;
        max-width: 100%;
        width: $width;
        height: $height;
        fill: $k-color-gray--600;

        #{$root}--roundSmall & {
            width: $width-small;
            height: $height-small;
        }

        #{$root}--rectangle & {
            width: $width-portrait;
            height: $height-portrait;
        }
    }

    &__initials {
        @include k-typo-s;

        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        max-width: 100%;
        width: $size-initials;
        height: $size-initials;
        border: 1px solid $k-color-gray--200;
        border-radius: 50%;
        color: $k-color-gray--500;
        cursor: default;
    }

    &__round {
        border-radius: 50%;
    }

    &__image {
        &--mouseover {
            opacity: 0.3;
        }
    }

    &__placeholder {
        padding: $k-spacing--m;

        &:hover,
        &:focus {
            background-color: $k-color-gray--200;
        }
    }

    &__placeholderWithoutEffects {
        padding: 0;
        fill: $k-color-gray--200;

        &:hover,
        &:focus {
            background-color: transparent;
        }
    }

    &__trigger {
        padding: 0;
        border: none;
        vertical-align: middle;
        background-color: transparent;
        cursor: pointer;
    }

    &__input {
        display: none;
    }
}
</style>
