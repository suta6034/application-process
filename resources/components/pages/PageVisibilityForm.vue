<script setup>
import {
    computed, inject,
    onBeforeMount, onBeforeUnmount, watch,
} from 'vue';
import {
    required,
} from '@vuelidate/validators';
import {
    onBeforeRouteLeave,
// eslint-disable-next-line import/extensions
} from 'vue-router/composables';
import useVuelidate from '@vuelidate/core';
import {
    blacklistAutocompleteAdapter,
} from '../../store/modules/forms/blacklist';
import {
    PROFILE_ACTIVATION_CONSENT,
} from '../../services/gdpr';
import {
    strings,
} from '../../lang/notification';

import mitt from '../../utils/mitt';
import {
    ACTIONS,
    CATEGORIES,
    EVENTS,
    LABELS,
    track,
} from '../../utils/tracking';
import {
    log,
} from '../../utils/action-logger';

import AppButton from '../atoms/app/AppButton';
import AppIcon from '../atoms/app/AppIcon';
import AppLink from '../atoms/app/AppLink';
import AppList from '../atoms/app/AppList';
import AppShowMore from '../molecules/app/AppShowMore';
import FormSuggestionSelect from '../molecules/form/FormSuggestionSelect';
import FormSwitch from '../molecules/form/FormSwitch';
import LayoutFullscreen from '../layouts/LayoutFullscreen';
import ProviderConsent from '../providers/ProviderConsent';
import TextHeadline from '../atoms/text/TextHeadline';

import '../../lang/validation';
import {
    useState,
} from '../../composables/vuex-helpers';
import {
    cvEditFormEvents, cvEditFormProps,
    useCvEditForm,
} from '../../composables/cv-edit-form';

const MIN_COMPLETENESS = 50;
const MAX_COMPANIES = 5;

const CHECKPOINTS_COLLAPSE = [
    { text: 'Namen deiner Arbeitgeber' },
    { text: 'Dein Foto' },
    { text: 'Vor- und Nachname' },
    { text: 'Geburtsdatum/Alter' },
];

const CHECKPOINTS_EXPAND = [
    { text: 'Adresse' },
    { text: 'Telefonnummer' },
    { text: 'E-Mail-Adresse' },
    { text: 'Dokumente' },
];

const CHECKPOINTS_LEFT = [
    { text: 'Namen deiner Arbeitgeber' },
    { text: 'Dein Foto' },
    { text: 'Vor- und Nachname' },
    { text: 'Geburtsdatum/Alter' },
    { text: 'Adresse' },
];

const CHECKPOINTS_RIGHT = [
    { text: 'Telefonnummer' },
    { text: 'E-Mail-Adresse' },
    { text: 'Dokumente' },
    { text: 'Webadressen' },
];

const router = inject('router');

const {
    active,
    completeness,
} = useState('profile');

const {
    companies,
} = useState('profile/blacklist');

const canBeActivated = computed(() => completeness.value >= MIN_COMPLETENESS);

watch(active, () => {
    if (!active.value) {
        track({
            category: CATEGORIES.page.profile,
            action: ACTIONS.clickWithName('profile-deactivate'),
            label: LABELS.karl,
        });
        log('page-visibility-switch-false');
    } else {
        log('page-visibility-switch-true');
    }

    track({
        event: EVENTS.profileStatus,
        category: CATEGORIES.conversion,
        label: active.value ? 'on' : 'off',
    });

    track({
        event: EVENTS.statusChange,
        element: 'Profile',
        elementDetail: active.value ? 'on' : 'off',
        ga4Event: true,
    });
});

const visibilityRadios = [{
    icon: 'avatar',
    label: 'Sichtbar',
    value: true,
}, {
    icon: 'avatar-incognito',
    label: 'Nicht sichtbar',
    value: false,
}];
const isUserVisibleBeforeChange = active.value;

function navigateBack() {
    if (router.currentRoute.meta.referrer.name === null) {
        return router.push({
            name: 'page-dashboard',
        });
    }

    return window.history.back();
}

async function consentProtectedActivation({ event, value }, requireConsent) {
    if (canBeActivated.value) {
        if (value === false) return;

        event.preventDefault();
        active.value = await requireConsent();
    }
}

function handleConsentAccepted(consentType) {
    if (consentType === PROFILE_ACTIVATION_CONSENT) active.value = true;
}

const validations = {
    active: {
        required,
    },
};
const v$ = useVuelidate(validations, { active }, { $scope: false });

const props = defineProps({ ...cvEditFormProps });
const emit = defineEmits([...cvEditFormEvents]);

const {
    markAsDirty,
    beforeRouteLeaveCustom,
    dirty,
    save,
} = useCvEditForm(props, emit, v$);

onBeforeMount(() => mitt.on('consent-accepted', handleConsentAccepted));
onBeforeUnmount(() => mitt.off('consent-accepted', handleConsentAccepted));
onBeforeRouteLeave((to, from, next) => beforeRouteLeaveCustom(next));
</script>

<template>
    <LayoutFullscreen
        ref="root"
        class="c-pageVisibilityForm"
        @close="
            log('page-visibility-cancel', { isUserVisible: isUserVisibleBeforeChange });
            navigateBack();
        "
    >
        <template #headline>
            Sichtbarkeitseinstellungen
        </template>
        <div class="c-pageVisibilityForm__split">
            <div class="c-pageVisibilityForm__splitLeft">
                <div class="c-pageVisibilityForm__preview">
                    <img
                        v-if="active"
                        src="../../assets/img/visibility/cv-visible.jpg"
                        alt="Lebenslauf Platzhalter, sichtbar"
                        class="c-pageVisibilityForm__cv"
                    >
                    <template v-else>
                        <div class="c-pageVisibilityForm__iconWrapper">
                            <AppIcon
                                class="c-pageVisibilityForm__icon"
                                name="eye-strikethrough"
                                size="3xl"
                            />
                        </div>
                        <img
                            src="../../assets/img/visibility/cv-not-visible.jpg"
                            alt="Lebenslauf Platzhalter, nicht sichtbar"
                            class="c-pageVisibilityForm__cv"
                        >
                    </template>
                </div>
            </div>
            <div class="c-pageVisibilityForm__splitRight">
                <ProviderConsent :type="PROFILE_ACTIVATION_CONSENT">
                    <template #default="{ requireConsent }">
                        <FormSwitch
                            v-model="active"
                            :value="active"
                            name="visbilitySwitch"
                            :radios="visibilityRadios"
                            :disabled="!canBeActivated"
                            data-qa="visibility switch"
                            @change="active = $event"
                            @click="consentProtectedActivation($event, requireConsent);markAsDirty()"
                        />
                    </template>
                </ProviderConsent>
                <div class="c-pageVisibilityForm__visibilityInfo">
                    <template v-if="canBeActivated">
                        <div v-show="active">
                            Dein Lebenslauf ist für Unternehmen
                            <strong data-qa="visibility info active">aktiv und sichtbar:</strong>
                            <AppList class="c-pageVisibilityForm__checklist">
                                <li class="k-c-list__item">
                                    <AppIcon
                                        size="m"
                                        name="check"
                                        class="k-c-list__icon"
                                        fixed-width
                                    />
                                    Du siehst wer deinen Lebenslauf aufgerufen hat
                                </li>
                                <li class="k-c-list__item">
                                    <AppIcon
                                        size="m"
                                        name="check"
                                        class="k-c-list__icon"
                                        fixed-width
                                    />
                                    Du kannst Job-Angebote erhalten
                                </li>
                            </AppList>
                        </div>
                        <div
                            v-if="active"
                            class="c-pageVisibilityForm__additionalInfo"
                        >
                            <strong>Folgende deiner Daten bleiben immer verdeckt,</strong> außer du gibst
                            sie einzelnen Unternehmen explizit frei:
                        </div>
                        <div v-show="!active">
                            Dein Lebenslauf ist für Unternehmen
                            <strong data-qa="visibility info inactive">inaktiv und nicht sichtbar:</strong>
                            <AppList class="c-pageVisibilityForm__checklist">
                                <li class="k-c-list__item">
                                    <AppIcon
                                        size="m"
                                        name="x-list"
                                        class="k-c-list__icon c-pageVisibilityForm__cross"
                                    />
                                    Unternehmen können deinen Lebenslauf nicht aufrufen
                                </li>
                                <li class="k-c-list__item">
                                    <AppIcon
                                        size="m"
                                        name="x-list"
                                        class="k-c-list__icon c-pageVisibilityForm__cross"
                                    />
                                    Du erhältst keine Job-Angebote
                                </li>
                            </AppList>
                        </div>
                        <div
                            v-if="!active"
                            class="c-pageVisibilityForm__additionalInfo"
                        >
                            <strong>Tipp:</strong> Auch wenn dein Lebenslauf &bdquo;sichtbar&ldquo; ist
                            <strong>bleiben folgende deiner Daten verdeckt,</strong> außer du gibst sie
                            einzelnen Unternehmen explizit frei:
                        </div>
                        <div
                            class="c-pageVisibilityForm__listSplit c-pageVisibilityForm__checklist"
                        >
                            <AppList class="c-pageVisibilityForm__splitLeft">
                                <li
                                    v-for="checkpoint in CHECKPOINTS_LEFT"
                                    :key="checkpoint.text"
                                    class="k-c-list__item"
                                >
                                    <AppIcon
                                        size="m"
                                        name="x-list"
                                        class="k-c-list__icon c-pageVisibilityForm__cross"
                                        fixed-width
                                    />
                                    {{ checkpoint.text }}
                                </li>
                            </AppList>
                            <AppList class="c-pageVisibilityForm__splitRight">
                                <li
                                    v-for="checkpoint in CHECKPOINTS_RIGHT"
                                    :key="checkpoint.text"
                                    class="k-c-list__item"
                                >
                                    <AppIcon
                                        size="m"
                                        name="x-list"
                                        class="k-c-list__icon c-pageVisibilityForm__cross"
                                    />
                                    {{ checkpoint.text }}
                                </li>
                            </AppList>
                        </div>
                        <AppShowMore
                            class="c-pageVisibilityForm__listCollapse c-pageVisibilityForm__checklist"
                            transition
                            link-toggle
                        >
                            <AppList>
                                <li
                                    v-for="checkpoint in CHECKPOINTS_COLLAPSE"
                                    :key="checkpoint.text"
                                    class="k-c-list__item"
                                >
                                    <AppIcon
                                        size="m"
                                        name="x-list"
                                        class="k-c-list__icon c-pageVisibilityForm__cross"
                                        fixed-width
                                    />
                                    {{ checkpoint.text }}
                                </li>
                            </AppList>
                            <template #more>
                                <AppList>
                                    <li
                                        v-for="checkpoint in CHECKPOINTS_EXPAND"
                                        :key="checkpoint.text"
                                        class="k-c-list__item"
                                    >
                                        <AppIcon
                                            size="m"
                                            name="x-list"
                                            class="k-c-list__icon c-pageVisibilityForm__cross"
                                            fixed-width
                                        />
                                        {{ checkpoint.text }}
                                    </li>
                                </AppList>
                            </template>
                        </AppShowMore>
                    </template>
                    <template v-else>
                        Um dein Profil für Unternehmen sichtbar zu schalten,
                        muss dein Profil zumindest zu
                        <strong data-qa="min completeness">{{ MIN_COMPLETENESS }}%</strong> ausgefüllt sein.
                    </template>
                </div>
                <hr class="c-pageVisibilityForm__hr">
                <TextHeadline
                    :level="3"
                    size="l"
                    class="c-pageVisibilityForm__blacklistHeadline"
                >
                    Firmen blockieren
                </TextHeadline>
                <p class="c-pageVisibilityForm__blacklistInfo">
                    Verberge deinen Lebenslauf vor bis zu 5 Unternehmen.
                    Diese können ihn selbst dann nicht sehen, wenn du ihn sichtbar schaltest.
                </p>
                <FormSuggestionSelect
                    v-model="companies"
                    :enable-primary-action="false"
                    :max="MAX_COMPANIES"
                    :autocomplete-adapter="blacklistAutocompleteAdapter"
                    :no-result-message="strings.notification.noResultBlacklist"
                    class="c-pageVisibilityForm__blacklistSelect"
                    placeholder="Firma hinzufügen"
                    endpoint="companies"
                    data-qa="blacklist select"
                    @change="markAsDirty"
                >
                    <template #warning-distinct>
                        {{ $t('validation.distinctBlacklist') }}
                    </template>
                    <template #warning-max>
                        {{ $t('validation.max', { n: MAX_COMPANIES, fieldName: 'Unternehmen' }) }}
                    </template>
                </FormSuggestionSelect>
            </div>
        </div>
        <template #footer>
            <AppLink
                class="c-pageVisibilityForm__cancel"
                tag="button"
                data-qa="cancel button"
                @click="
                    log('page-visibility-cancel', { isUserVisible: isUserVisibleBeforeChange });
                    navigateBack();
                "
            >
                Abbrechen
            </AppLink>
            <AppButton
                :disabled="!dirty"
                data-qa="save button"
                @click="
                    log('page-visibility-save', { isUserVisible: active });
                    save('browserBack');
                "
            >
                Speichern
            </AppButton>
        </template>
    </LayoutFullscreen>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/settings/border-radius';
@import '../../assets/scss/settings/breakpoint';
@import '../../assets/scss/settings/color';
@import '../../assets/scss/settings/font-size';
@import '../../assets/scss/settings/spacing';
@import '../../assets/scss/tools/wrap';

.c-pageVisibilityForm {
    $split-max-width: 940px;
    $icon-width: 41px;

    &__split {
        display: flex;
        margin: 0 auto;
        padding-top: $k-spacing--xl;
        padding-right: $k-spacing--l;
        padding-left: $k-spacing--l;
        max-width: $split-max-width;
        width: 100%;
    }

    &__splitLeft {
        display: none;
        padding-right: $k-spacing--l;
        width: 50%;

        @media (min-width: $k-breakpoint--m) {
            display: block;
        }
    }

    &__splitRight {
        width: 100%;

        @media (min-width: $k-breakpoint--m) {
            padding-left: $k-spacing--l;
            width: 50%;
        }
    }

    &__listSplit {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: flex;
        }
    }

    &__listCollapse {
        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__preview {
        position: relative;
        border: 1px solid $k-color-gray--200;
        border-radius: $k-border-radius--s;
    }

    &__iconWrapper {
        position: absolute;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    &__icon {
        color: $k-color-gray--500;
    }

    &__visibilityInfo {
        margin-top: $k-spacing--l;
    }

    &__additionalInfo {
        margin-top: $k-spacing--l;
    }

    &__checklist {
        margin-top: $k-spacing--m;
    }

    &__cross {
        color: $k-color-gray--500;
    }

    &__hr {
        margin-top: $k-spacing--xl;
    }

    &__blacklistHeadline {
        margin-top: $k-spacing--xl;
    }

    &__blacklistInfo {
        margin-top: $k-spacing--m;
        color: $k-color-gray--500;
    }

    &__blacklistSelect {
        margin-top: $k-spacing--l;
    }

    &__cancel {
        margin-right: $k-spacing--l;
    }
}
</style>
