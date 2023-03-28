<script setup>
import {
    onBeforeMount, ref,
} from 'vue';
import {
    autocomplete,
} from '../../../services/autocomplete';

import {
    userSearchHistory,
} from '../../../services/user-search-history';

import AppButton from '../../atoms/app/AppButton';
import AppIcon from '../../atoms/app/AppIcon';
import FormFilterSelect from '../../molecules/form/FormFilterSelect';
import FormSelect from '../../molecules/form/FormSelect';

const PROXIMITY_LOCATION_TYPES = ['district', 'town'];

const { jobs, locations } = userSearchHistory();
const jobSearchOptions = jobs.map(job => ({
    id: job.lastVisited,
    label: job.keyword,
    icon: 'clock',
}));
const locationSearchOptions = locations.map(location => ({
    id: location.lastVisited,
    label: location.location,
    icon: 'clock',
}));

const keyword = ref({});
const location = ref({});
const proximity = ref({});
const isProximitySearchSupported = ref(false);
const initialMobileView = ref(true);
const proximitySearchOptions = ref([]);

onBeforeMount(() => {
    proximitySearchOptions.value = [
        {
            id: 0,
            label: '0 km',
            value: 0,
        },
        {
            id: 1,
            label: '10 km',
            value: 10,
        },
        {
            id: 2,
            label: '20 km',
            value: 20,
        },
        {
            id: 3,
            label: '30 km',
            value: 30,
        },
        {
            id: 4,
            label: '50 km',
            value: 50,
        },
    ];
});

/* istanbul ignore next - hard to test 😓 */
function updateProximitySearchSupported(isSupported) {
    isProximitySearchSupported.value = isSupported;
    if (!isSupported) proximity.value = {};
}

/* istanbul ignore next - hard to test 😓 */
function proximitySearchSupported(locationToCheck) {
    const locationType = locationToCheck?.attributes?.locationType;
    const locationSlug = locationToCheck?.attributes?.slug;
    const typeIsSupported = PROXIMITY_LOCATION_TYPES.includes(locationType);
    const slugIsSupported = locationSlug === 'salzburg';

    updateProximitySearchSupported(typeIsSupported || slugIsSupported);
}

/* istanbul ignore next - hard to test 😓 */
async function handleLocationSearch({ value }) {
    if (!value || value.trim().length === 0) return;

    const autocompleteLocations = await autocomplete({
        filters: { prefix: value },
        type: 'locations',
    });

    const autocompleteLocation = autocompleteLocations.find(
        locationToCheck => locationToCheck?.label.toLowerCase() === value.toLowerCase(),
    );
    if (autocompleteLocation) {
        proximitySearchSupported(autocompleteLocation);
    } else {
        updateProximitySearchSupported(false);
    }
}
</script>

<template>
    <div class="c-formJobSearch">
        <div class="c-formJobSearch__wrap">
            <form
                class="c-formJobSearch__form"
                data-qa="form job search"
                :action="$router.resolve({name:'page-jobs'}).href"
            >
                <div class="c-formJobSearch__keywordWrap">
                    <FormFilterSelect
                        :id="$randomFieldId('keyword')"
                        v-model="keyword"
                        input-name="keywords"
                        has-clear-button="auto"
                        :highlighted-index-default="-1"
                        :auto-select-on-focus-lost="false"
                        :options="jobSearchOptions"
                        default-auto-complete-icon="magnifier"
                        :max-dropdown-items="5"
                        :max-options="3"
                        placeholder="Beruf, Firma"
                        endpoint="keywords"
                        aria-label="Beruf, Firma"
                        data-qa="keyword"
                        data-gtm-element="DB: Jobsearch-Form"
                        data-gtm-element-detail="Keyword"
                        @input.native="initialMobileView = false"
                        @change.once="initialMobileView = false"
                        @clear="keyword = {}"
                    >
                        <template #start>
                            <AppIcon
                                class="c-formJobSearch__icon"
                                name="magnifier"
                                size="l"
                            />
                        </template>
                    </FormFilterSelect>
                </div>
                <div
                    v-show="!initialMobileView"
                    class="c-formJobSearch__locationWrap"
                    data-qa="location wrap"
                >
                    <FormFilterSelect
                        :id="$randomFieldId('location')"
                        v-model="location"
                        input-name="locations"
                        has-clear-button="auto"
                        :highlighted-index-default="-1"
                        :options="locationSearchOptions"
                        :auto-select-on-focus-lost="false"
                        default-auto-complete-icon="magnifier"
                        :max-dropdown-items="5"
                        :max-options="3"
                        is-docked-right
                        :autocomplete-adapter="x => x"
                        class="c-formJobSearch__locationInput"
                        placeholder="Ort, Region"
                        endpoint="locations"
                        aria-label="Ort, Region"
                        data-qa="location"
                        data-gtm-element="DB: Jobsearch-Form"
                        data-gtm-element-detail="Location"
                        @clear="location = {}"
                        @search="handleLocationSearch($event)"
                        @change="handleLocationSearch({value: $event.label})"
                    >
                        <template #start>
                            <AppIcon
                                class="c-formJobSearch__icon"
                                name="pin"
                                size="l"
                            />
                        </template>
                    </FormFilterSelect>
                    <FormSelect
                        v-model="proximity"
                        :options="proximitySearchOptions"
                        :allow-multiple="false"
                        :is-docked-left="true"
                        :disabled="!isProximitySearchSupported"
                        class="c-formJobSearch__select"
                        placeholder="Umkreis"
                        data-qa="proximity dropdown"
                    />
                    <input
                        :value="proximity.value"
                        type="hidden"
                        name="radius"
                    >
                </div>
                <div
                    v-show="!initialMobileView"
                    class="c-formJobSearch__buttonWrap"
                    data-qa="search"
                >
                    <AppButton
                        outline
                        width="full"
                        data-qa="search button"
                        data-gtm-element="DB: Jobsearch-Form"
                        data-gtm-element-detail="Submit"
                        class="c-formJobSearch__button"
                        type="submit"
                    >
                        Jobs finden
                    </AppButton>
                </div>
            </form>
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/tools/wrap';

// 1. The jobsearchs max-width and shrink/grow behavior must be the same as in k4.
// 2. Important must be used to overwrite the inline style because of mobile view (v-show).
.c-formJobSearch {
    $size-keywords-max-width: 608px; // 1

    padding-top: $k-spacing--m;
    padding-bottom: $k-spacing--m;
    background-color: $k-color-white;

    &__wrap {
        @include wrap; // 1
    }

    &__form {
        @include k-layout($k-spacing--xs, $k-spacing--xs);

        flex-direction: column;
        flex-wrap: nowrap;

        @media (min-width: $k-breakpoint--m) {
            flex-direction: row;
        }
    }

    &__keywordWrap {
        @include k-layout__item;

        @media (min-width: $k-breakpoint--m) {
            max-width: $size-keywords-max-width; // 1
        }

        @media (min-width: $k-breakpoint--l) {
            flex-grow: 2; // 1
        }
    }

    &__locationWrap {
        @include k-layout__item;

        display: flex;

        @media (min-width: $k-breakpoint--m) {
            display: flex !important; // 2
        }
    }

    &__locationInput {
        flex-grow: 1;
    }

    &__buttonWrap {
        @include k-layout__item(min);

        @media (min-width: $k-breakpoint--m) {
            display: block !important; // 2
        }
    }

    &__button {
        white-space: nowrap;
    }
}
</style>
