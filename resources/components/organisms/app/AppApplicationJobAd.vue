<script setup>
import {
    ref, watch,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    maxLength,
} from '@vuelidate/validators';
import {
    url,
} from '../../../utils/validators';
import {
    ACTIONS,
    CATEGORIES,
    LABELS,
    track,
} from '../../../utils/tracking';
import {
    STATES,
    useApplicationPatch,
} from '../../../composables/resource-application';
import '../../../lang/validation';

import AppApplicationMetaList from '../../atoms/app/AppApplicationMetaList';
import AppButton from '../../atoms/app/AppButton';
import AppCupcake from '../../atoms/app/AppCupcake';
import AppIcon from '../../atoms/app/AppIcon';
import AppIframe from '../../atoms/app/AppIframe';
import AppLink from '../../atoms/app/AppLink';
import FormElement from '../../molecules/form/FormElement';
import FormInput from '../../atoms/form/FormInput';
import FormMessage from '../../atoms/form/FormMessage';
import IllustrationNoJobAd from '../../illustrations/IllustrationNoJobAd';
import ModalApiError from '../modal/ModalApiErrorAutoOpen';
import TextHeadline from '../../atoms/text/TextHeadline';
import TextHtml from '../../atoms/text/TextHtml';
import {
    showSnackbar,
} from '../../../utils/snackbar';
import {
    useFormValidation,
} from '../../../composables/form-validation';

const MAX_LENGTH_FIELD = 255;

const props = defineProps({
    application: {
        type: Object,
    },
});

const {
    error,
    patch,
    state,
} = useApplicationPatch();

const jobUrl = ref('');

watch(state, () => {
    if (state.value === STATES.isSuccess) {
        showSnackbar({
            text: 'Gespeichert!',
            icon: 'check',
        });
    }
});

const validations = {
    jobUrl: {
        url,
        maxLength: maxLength(MAX_LENGTH_FIELD),
    },
};

const v$ = useVuelidate(validations, { jobUrl });
const root = ref(null);
const { validate } = useFormValidation(v$, root);

function updateApplicationJobUrl() {
    if (!validate()) return;
    patch({
        data: { jobUrl: jobUrl.value },
        id: props.application.id,
    });
}

function trackClick(action) {
    track({
        category: CATEGORIES.page.applications,
        action: ACTIONS.clickWithName(action),
        label: LABELS.click,
    });
}
</script>

<template>
    <AppCupcake
        v-if="!application.job?.isActive || application.isManual"
        ref="root"
        data-qa="job ad empty state"
    >
        <ModalApiError :error="error"/>
        <template #cherry>
            <IllustrationNoJobAd
                v-if="application.isManual"
                class="c-appApplicationJobAd__noJobAdIllustration"
            />
            <img
                v-else
                class="c-appApplicationJobAd__emptyStateIllustration"
                src="../../../assets/img/illustrations/page-not-found.jpg"
                alt=""
            >
        </template>
        <template v-if="application.isManual">
            Wenn du dich nicht über karriere.at beworben hast, können wir das Stelleninserat hier nicht anzeigen.
            <template v-if="application.jobUrl">
                Mehr Infos zu dem Jobinserat findest du über den von dir hinterlegten Link.
                <div class="c-appApplicationJobAd__jobUrlWrap">
                    <AppLink
                        target="_blank"
                        :href="application.jobUrl"
                        data-qa="job url link"
                        data-gtm-element="AP_D: Tab"
                        data-gtm-element-detail="Job - Show Link"
                        @click="trackClick('application-tab-job-showlink')"
                    >
                        <template
                            #icon
                        >
                            <AppIcon
                                slot="icon"
                                name="external-link"
                                size="l"
                            />
                        </template>
                        <span class="c-appApplicationJobAd__jobUrl u-ellipsis">
                            {{ application.jobUrl }}
                        </span>
                    </AppLink>
                </div>
            </template>
            <template v-else>
                Du kannst aber den dazugehörigen Link zum Arbeitgeber hier manuell hinterlegen.
                <div class="c-appApplicationJobAd__inputFormContainer">
                    <FormElement class="c-appApplicationJobAd__inputForm">
                        <FormInput
                            v-model.trim="jobUrl"
                            aria-label="Link zum Job"
                            placeholder="https://www.beispiel-link.at"
                            :status="v$.jobUrl.$error ? 'error' : ''"
                            data-qa="job url"
                            @blur="v$.jobUrl.$touch()"
                        />
                        <template #end>
                            <FormMessage
                                v-if="v$.jobUrl.$error"
                                type="error"
                            >
                                <li v-if="!v$.jobUrl.url">
                                    {{ $t('validation.url') }}
                                </li>
                                <li v-if="!v$.jobUrl.maxLength">
                                    {{ $t('validation.requiredMaxLength', { fieldName: 'URL', n: MAX_LENGTH_FIELD }) }}
                                </li>
                            </FormMessage>
                        </template>
                    </FormElement>
                    <AppButton
                        :disabled="jobUrl.length === 0"
                        size="m"
                        data-qa="add job url button"
                        data-gtm-element="AP_D: Tab"
                        data-gtm-element-detail="Job - Add Link"
                        @click="updateApplicationJobUrl();trackClick('application-tab-job-addlink')"
                    >
                        Hinzufügen
                    </AppButton>
                </div>
            </template>
        </template>
        <template v-else>
            <TextHeadline
                class="c-appApplicationJobAd__emptyStateHeadline"
                :level="2"
                size="xl"
            >
                Stelleninserat nicht verfügbar
            </TextHeadline>
            Die Stelle {{ application.jobTitle }}
            in {{ application.jobLocation }}
            <template v-if="!application.company?.isChiffre">
                beim Unternehmen {{ application.companyName }}
            </template>
            ist auf karriere.at leider nicht mehr verfügbar.
        </template>
    </AppCupcake>
    <div
        v-else
        class="c-appApplicationJobAd__container"
        data-qa="job ad active"
    >
        <AppIframe
            class="c-appApplicationJobAd__hideMobile"
            :src="`/html/${application.job?.id}?isSplitview=true`"
            data-qa="iframe job ad"
        />
        <div class="c-appApplicationJobAd__showMobile">
            <AppApplicationMetaList :application="application"/>
            <TextHtml
                v-if="application.job?.textHtml"
                :html="application.job?.textHtml"
            />
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '~@karriereat/global-styles/scss/tools/layout';
@import '~@karriereat/global-styles/scss/components/link/index';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appApplicationJobAd {
    $no-job-ad-illustration-width: 100px;
    $empty-job-ad-illustration-width: 400px;

    &__noJobAdIllustration {
        max-width: $no-job-ad-illustration-width;
    }

    &__emptyStateIllustration {
        margin-top: $k-spacing--4xl;
        max-width: $empty-job-ad-illustration-width;
        width: 100%;
    }

    &__emptyStateHeadline {
        color: $k-color-gray--900;
    }

    &__hideMobile {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: block;
        }
    }

    &__showMobile {
        display: block;

        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__jobUrlWrap {
        margin-top: $k-spacing--s;
    }

    &__jobUrl {
        max-width: 300px;
    }

    // 1. Prevent the button from growing when validation message is shown.
    &__inputFormContainer {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin-top: $k-spacing--2xl;

        @media (min-width: $k-breakpoint--m) {
            flex-direction: row;
            align-items: flex-start; // 1
            text-align: left;
        }
    }

    &__inputForm {
        margin-bottom: $k-spacing--s;

        @media (min-width: $k-breakpoint--m) {
            flex-grow: 1;
            margin-right: $k-spacing--xs;
            margin-bottom: 0;
        }
    }

    &__container {
        width: 100%;
    }
}
</style>
