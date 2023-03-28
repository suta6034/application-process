<script setup>
import {
    computed,
} from 'vue';
import {
    formatDate,
} from '../../../utils/filter';
import AppIcon from './AppIcon';

const props = defineProps({
    application: {
        required: true,
        type: Object,
    },
});

const format = 'd.m.Y';
const date = computed(() => props.application.createDate);

</script>

<template>
    <ul class="c-appApplicationMetaList">
        <li class="c-appApplicationMetaList__item">
            <AppIcon
                class="c-appApplicationMetaList__icon"
                :fixed-width="true"
                name="employer-branding"
                size="l"
            />{{ application.companyName }}
        </li>
        <li class="c-appApplicationMetaList__item">
            <AppIcon
                class="c-appApplicationMetaList__icon"
                :fixed-width="true"
                name="pin"
                size="l"
            />{{ application.jobLocation }}
        </li>
        <li
            v-if="application.employmentType"
            class="c-appApplicationMetaList__item"
        >
            <AppIcon
                class="c-appApplicationMetaList__icon"
                :fixed-width="true"
                name="clock-arrow"
                size="l"
            />{{ application.employmentType }}
        </li>
        <li
            v-if="application.job?.level"
            class="c-appApplicationMetaList__item"
        >
            <AppIcon
                class="c-appApplicationMetaList__icon"
                :fixed-width="true"
                name="briefcase"
                size="l"
            />{{ application.job?.level }}
        </li>
        <li class="c-appApplicationMetaList__item">
            <AppIcon
                class="c-appApplicationMetaList__icon"
                :fixed-width="true"
                name="calendar"
                size="l"
            />{{ formatDate({ date, format }) }}
        </li>
    </ul>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';

.c-appApplicationMetaList {
    display: flex;
    flex-direction: column;
    padding: $k-spacing--m;
    background: $k-color-gray--50;
    color: $k-color-gray--500;

    &__item {
        &:not(:first-child) {
            margin-top: $k-spacing--xs;
        }
    }

    &__icon {
        margin-right: $k-spacing--s;
    }
}
</style>
