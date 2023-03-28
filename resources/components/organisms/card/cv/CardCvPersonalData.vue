<script setup>
import {
    ref,
    computed,
} from 'vue';

import AppButtonIconOnly from '../../../atoms/app/AppButtonIconOnly';
import AppCard from '../../../molecules/app/AppCard';
import AppProfileImage from '../../../molecules/app/AppProfileImage';
import FormCvPersonalData from '../../form/cv/FormCvPersonalData';
import TextHeadline from '../../../atoms/text/TextHeadline';

import {
    useCvCard,
} from '../../../../composables/cv-card';
import {
    useState,
} from '../../../../composables/vuex-helpers';

const cardKey = 'BASICS';
const element = ref(null);
const {
    resetEditAndScroll,
    openEdit,
    activeForm,
} = useCvCard({ cardKey, element });
const listPreview = computed(() => activeForm.value !== cardKey);

const {
    title,
    suffix,
    firstname,
    surname,
    street,
    zip,
    town,
    mobile,
    email,
} = useState('profile/basics');

const fullName = computed(() => {
    const name = `${firstname.value} ${surname.value}`;
    if (suffix.value) return `${name}, `;
    return name;
});

</script>
<template>
    <AppCard
        ref="element"
        class="c-cardCvPersonalData"
        data-qa="personal data card"
    >
        <template #header>
            <TextHeadline
                :level="2"
                size="l"
                class="_flexbox-min-width-fix"
            >
                Persönliche Daten
            </TextHeadline>
        </template>
        <template #action>
            <AppButtonIconOnly
                v-if="listPreview"
                size="xl"
                icon="pen"
                aria-label="Bearbeiten"
                data-qa="edit personal data"
                data-gtm-element="PR_L: Personal Data"
                data-gtm-element-detail="Edit"
                @click="openEdit('profile-list-personal-data-edit')"
            />
        </template>
        <div
            v-if="listPreview"
            class="k-o-media c-cardCvPersonalData__topAligned"
            :class="{'c-cardCvPersonalData--pointer': listPreview}"
            data-qa="personal data card"
        >
            <AppProfileImage
                :rectangle="true"
                :round="false"
                tabindex="0"
                data-qa="profile image"
                class="c-cardCvPersonalData__image"
            />
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
            <div
                class="k-o-media__body"
                @click="openEdit('profile-list-personal-data-edit')"
            >
                <div class="k-c-excerpt">
                    <TextHeadline
                        :level="3"
                        size="l"
                        class="k-c-excerpt__headline u-word-break"
                        bold
                    >
                        <span
                            v-if="title"
                            data-qa="title"
                        >
                            {{ `${title} ` }}
                        </span>
                        <span data-qa="name">{{ fullName }}</span>
                        <span
                            v-if="suffix"
                            data-qa="suffix"
                        >
                            {{ suffix }}
                        </span>
                    </TextHeadline>
                    <p
                        class="k-o-chain k-o-chain--noWrap
                        u-ellipsis c-cardCvPersonalData__address c-cardCvPersonalData__details"
                    >
                        <span
                            v-if="street"
                            class="c-cardCvPersonalData__mobile-hidden c-cardCvPersonalData__street"
                            data-qa="street"
                        >{{ `${street}, ` }}</span>
                        <span
                            class="k-o-chain--noWrap u-ellipsis"
                            data-qa="location"
                        >
                            {{ zip }} {{ town.label || town }}
                        </span>
                    </p>
                    <p
                        class="k-o-chain k-o-chain--noWrap
                        c-cardCvPersonalData__mobile-column c-cardCvPersonalData__details"
                    >
                        <span
                            v-if="mobile"
                            data-qa="phone"
                        >
                            {{ mobile }}
                        </span>
                        <span
                            v-if="mobile"
                            class="c-cardCvPersonalData__point"
                        />
                        <span
                            class="k-o-chain--noWrap u-ellipsis"
                            data-qa="email"
                        >
                            {{ email }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <FormCvPersonalData
            v-if="!listPreview"
            class="c-cardCvPersonalData__form"
            @closeEdit="resetEditAndScroll"
        />
    </AppCard>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '~@karriereat/global-styles/scss/objects/chain';
@import '../../../../assets/scss/settings/breakpoint';
@import '../../../../assets/scss/settings/border-radius';
@import '../../../../assets/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';

// 1. Alignment for the image and the text, prevents that the image stretches to the full height.
.c-cardCvPersonalData {
    &__topAligned {
        align-items: flex-start; // 1
    }

    &--pointer {
        cursor: pointer;
    }

    &__point {
        display: none;

        @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
            &:not(:first-child) {
                display: inline-flex;

                &::before {
                    content: '・';
                }
            }
        }
    }

    &__image {
        border: 1px solid $k-color-gray--200;
        border-radius: $k-border-radius--s;
    }

    &__details {
        color: $k-color-gray--600;
    }

    &__address {
        margin-top: $k-spacing--2xs;
    }

    &__street {
        white-space: pre;
    }

    &__mobile-hidden {
        display: none;

        @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
            display: inline;
        }
    }

    &__mobile-column {
        display: flex;
        flex-direction: column;

        @media (min-width: $content-layout-main-columns-breakpoint-three-column) {
            flex-direction: row;
        }
    }

    &__form {
        padding-bottom: $k-spacing--xl;
    }
}
</style>
