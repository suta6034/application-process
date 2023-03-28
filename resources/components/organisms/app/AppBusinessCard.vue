<script setup>
import {
    computed,
} from 'vue';
import {
    log,
} from '../../../utils/action-logger';
import {
    yearsSince,
} from '../../../utils/filter';
import AppButton from '../../atoms/app/AppButton';
import AppCvCompleteness from '../../molecules/app/AppCvCompleteness';
import AppProfileImage from '../../molecules/app/AppProfileImage';
import AppVisibility from '../../atoms/app/AppVisibility';
import SliderCvBenefits from '../slider/SliderCvBenefits';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    useState,
} from '../../../composables/vuex-helpers';

const logCreateCv = () => {
    log('profile-create-cv', { source: 'dashboard' });
};

const {
    active: isVisible,
    exists: profileExists,
} = useState('profile');
const {
    birthdate,
    email,
    firstname,
    surname,
} = useState('profile/basics');
const { rows: educations } = useState('profile/education');
const { rows: workExperiences } = useState('profile/work');

const storedEducations = computed(() => educations.value.filter(x => x.id));
const educationsExist = computed(() => storedEducations.value.length > 0);
const storedWorkExperiences = computed(() => workExperiences.value.filter(x => x.id));
const workExperiencesExist = computed(() => storedWorkExperiences.value.length > 0);
const isCurrentWorkplace = computed(() => {
    if (storedWorkExperiences.value[0].end === null) return true;

    const endDate = new Date(storedWorkExperiences.value[0].end);
    const currentDate = new Date();

    return ((endDate.getMonth() >= currentDate.getMonth())
    && (endDate.getFullYear() >= currentDate.getFullYear()));
});

const emit = defineEmits(['complete']);
</script>

<template>
    <div class="c-appBusinessCard k-c-card k-c-card--noBorder">
        <div class="c-appBusinessCard__header k-o-distributeSpace">
            <router-link
                :is="profileExists ? 'router-link' : 'div'"
                :to="{ name: 'page-visibility-form'}"
                class="c-appBusinessCard__badge"
                data-qa="visibility link"
                data-gtm-element="DB: Profile"
                data-gtm-element-detail="Change Status"
            >
                <AppVisibility
                    v-if="profileExists"
                    :is-visible="isVisible"
                />
            </router-link>
        </div>
        <div
            class="c-appBusinessCard__body k-c-card__body"
            data-qa="cv card body"
        >
            <router-link
                :to="profileExists ? { name: 'page-cv' } : { name: 'page-profile-create-onepage' }"
                data-qa="cv card body link"
                class="c-appBusinessCard__bodyLink"
                @click.native="logCreateCv"
            >
                <AppProfileImage
                    placeholder-without-effects
                    data-qa="profile image"
                />
                <div class="c-appBusinessCard__personalData">
                    <TextHeadline
                        v-if="profileExists"
                        :level="3"
                        size="l"
                        class="c-appBusinessCard__info"
                    >
                        <span
                            v-if="firstname"
                            class="c-appBusinessCard__label c-appBusinessCard__label--primary u-ellipsis"
                            data-qa="name"
                        >
                            {{ firstname }} {{ surname }}
                        </span>
                        <span
                            v-else
                            class="c-appBusinessCard__label c-appBusinessCard__label--primary u-ellipsis"
                            data-qa="email"
                        >
                            {{ email }}
                        </span>
                        <span
                            v-if="birthdate"
                            data-qa="age"
                        >
                            , {{ yearsSince(birthdate) }}
                        </span>
                    </TextHeadline>
                    <TextHeadline
                        v-else
                        :level="3"
                        size="l"
                        class="c-appBusinessCard__info"
                        data-qa="email"
                    >
                        <span class="u-ellipsis">
                            {{ email }}
                        </span>
                    </TextHeadline>
                    <template v-if="profileExists">
                        <p
                            v-if="workExperiencesExist || educationsExist"
                            class="c-appBusinessCard__subinfo"
                            data-qa="subinfo"
                        >
                            <template v-if="workExperiencesExist && isCurrentWorkplace">
                                <span class="c-appBusinessCard__label u-ellipsis">
                                    <span data-qa="position">
                                        {{ storedWorkExperiences[0].title }}
                                    </span>
                                    <span
                                        v-if="storedWorkExperiences[0].company.label"
                                        data-qa="company"
                                    >
                                        bei {{ storedWorkExperiences[0].company.label }}
                                    </span>
                                </span>
                            </template>
                            <template v-if="!workExperiencesExist && educationsExist">
                                <span class="c-appBusinessCard__label u-ellipsis">
                                    {{ storedEducations[0].name || storedEducations[0].focus }}
                                </span>
                            </template>
                        </p>
                    </template>
                    <template v-else>
                        <p
                            class="c-appBusinessCard__subinfo"
                            data-qa="subinfo"
                        >
                            Ohne Lebenslauf erhältst du keine Job-Angebote oder Aufrufe.
                        </p>
                    </template>
                </div>
                <AppButton
                    v-if="profileExists"
                    width="condensed"
                    slim
                    class="c-appBusinessCard__button"
                    data-qa="cv edit button"
                    data-gtm-element="DB: Profile"
                    data-gtm-element-detail="Edit Profile"
                >
                    Lebenslauf bearbeiten
                </AppButton>
            </router-link>
            <div
                v-if="!profileExists"
                class="k-c-textDivider"
            >
                <hr class="k-c-textDivider__line">
                <span class="k-c-textDivider__text">
                    Deine Lebenslauf-Vorteile
                </span>
                <hr class="k-c-textDivider__line">
            </div>
            <div
                v-if="!profileExists"
                class="c-appBusinessCard__emptyState"
                data-qa="empty state"
            >
                <SliderCvBenefits
                    :log-create-cv="logCreateCv"
                />
                <AppButton
                    :to="{ name: 'page-profile-create-onepage' }"
                    width="condensed"
                    slim
                    class="c-appBusinessCard__button"
                    data-qa="create cv button"
                    data-gtm-element="DB: Profile"
                    data-gtm-element-detail="Create Profile"
                    @click.native="logCreateCv"
                >
                    Jetzt Lebenslauf anlegen
                </AppButton>
            </div>
        </div>
        <AppCvCompleteness
            v-if="profileExists"
            class="c-appBusinessCard__completeness"
            @complete="emit('complete', $event)"
        />
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/components/link/settings';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/border-radius';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-appBusinessCard {
    $subheadline-max-width: 11em;

    padding-top: $k-spacing--m;

    &__header {
        align-items: center;
    }

    &__badge {
        display: flex;
    }

    &__settingsLink {
        &,
        &:visited {
            color: $k-color-gray--500;
        }

        &:hover,
        &:focus {
            color: $k-c-link-color;
        }
    }

    &__settings {
        margin-right: $k-spacing--m;
    }

    &__body {
        text-align: center;
    }

    &__bodyLink {
        display: block;
    }

    &__personalData {
        margin-top: $k-spacing--s;
        max-width: 100%;
    }

    &__info,
    &__subinfo {
        display: flex;
        justify-content: center;
    }

    &__label {
        max-width: 100%;

        &--primary {
            max-width: 85%;
        }
    }

    &__subinfo {
        color: $k-color-gray--500;
    }

    &__button {
        margin-top: $k-spacing--l;
    }

    &__completeness {
        margin-top: $k-spacing--m;
        border-bottom-right-radius: $k-border-radius--s;
        border-bottom-left-radius: $k-border-radius--s;
    }

    &__emptyState {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: $k-spacing--xl;
    }

    .k-c-textDivider {
        margin-top: $k-spacing--xl;
    }
}
</style>
