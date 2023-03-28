<script setup>
import FormRadio from '../../../atoms/form/FormRadio';
import TextHeadline from '../../../atoms/text/TextHeadline';
import FormCheckbox from '../../../atoms/form/FormCheckbox';
import {
    useApplicationsFilter,
} from '../../../../composables/applications-filter';
import {
    emitUserAction,
} from '../../../../services/user-actions';
import {
    track,
} from '../../../../utils/tracking';

defineProps({
    sort: {
        type: String,
        default: '-createDate',
    },
});

const {
    applicationsFilter,
    setFilter,
} = useApplicationsFilter();

const onFilterChange = ({ checked, filterName, trackingName }) => {
    setFilter(filterName, checked);
    if (checked) {
        emitUserAction(`application-filter-state-${filterName}`);
    }
    track({
        element: 'AP_L: Filter',
        elementDetail: `State - ${trackingName}`,
        ga4Event: true,
    });
};

const emit = defineEmits(['sortChange']);
</script>

<template>
    <div
        class="c-dropdownApplicationsFilter"
        data-qa="dropdown filter"
    >
        <div class="c-dropdownApplicationsFilter__order">
            <TextHeadline
                :level="2"
                bold
            >
                Sortierung
            </TextHeadline>
            <div class="c-dropdownApplicationsFilter__options">
                <FormRadio
                    :checked="sort === '-createDate'"
                    name="formDropdownApplicationFilterOrder"
                    class="c-dropdownApplicationsFilter__option"
                    data-qa="sort new"
                    @change="emit('sortChange', '-createDate')"
                >
                    Neueste zuerst
                </FormRadio>
                <FormRadio
                    :checked="sort === 'createDate'"
                    name="formDropdownApplicationFilterOrder"
                    class="c-dropdownApplicationsFilter__option"
                    data-qa="sort old"
                    @change="emit('sortChange', 'createDate')"
                >
                    Älteste zuerst
                </FormRadio>
            </div>
        </div>
        <div class="c-dropdownApplicationsFilter__status">
            <TextHeadline
                :level="2"
                bold
            >
                Status
            </TextHeadline>
            <div class="c-dropdownApplicationsFilter__options c-dropdownApplicationsFilter__statusOption">
                <FormCheckbox
                    v-for="filter in applicationsFilter"
                    :key="filter.key"
                    :checked="filter.active"
                    name="status"
                    :data-qa="`filter status ${filter.key}`"
                    @change="(checked) => onFilterChange({
                        checked,
                        filterName: filter.key,
                        trackingName: filter.trackingName,
                    })"
                >
                    {{ $t(`application.status.${filter.key}`) }}
                </FormCheckbox>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/settings/color';
@import '../../../../assets/scss/settings/spacing';
@import '../../../../assets/scss/settings/breakpoint';

.c-dropdownApplicationsFilter {
    &__status {
        margin-top: $k-spacing--xl;
    }

    &__options {
        display: flex;
        flex-direction: column;
        margin-top: $k-spacing--s;
    }

    &__statusOption {
        gap: $k-spacing--s;
    }
}
</style>
