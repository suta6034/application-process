<script setup>
import {
    computed, ref, watch,
} from 'vue';
import {
    parseDate,
} from '../../../utils/filter';

const props = defineProps({
    value: {
        type: String,
        default: '',
    },
    status: {
        type: String,
    },
    divider: {
        type: String,
        default: '.',
    },
    showYear: {
        type: Boolean,
        default: true,
    },
    showMonth: {
        type: Boolean,
        default: true,
    },
    showDay: {
        type: Boolean,
        default: true,
    },
    defaultYear: {
        type: String,
        default: '',
    },
    defaultMonth: {
        type: String,
        default: '',
    },
    defaultDay: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    small: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['blurLastField', 'input']);

const yearInput = ref(null);
const monthInput = ref(null);
const dayInput = ref(null);

const year = ref(parseDate(props.value).year || props.defaultYear);
const month = ref(parseDate(props.value).month || props.defaultMonth);
const day = ref(parseDate(props.value).day || props.defaultDay);
const dateRefs = { year, month, day };

const focusedFields = ref({
    day: false,
    month: false,
    year: false,
});

const allFieldsWereFocused = computed(() => {
    const yearWasFocused = focusedFields.value.year || !props.showYear || year.value.length;
    const monthWasFocused = focusedFields.value.month || !props.showMonth || month.value.length;
    const dayWasFocused = focusedFields.value.day || !props.showDay || day.value.length;

    return yearWasFocused && monthWasFocused && dayWasFocused;
});

const isEmpty = computed(() => (day.value === '' || !props.showDay)
    && (month.value === '' || !props.showMonth)
    && (year.value === '' || !props.showYear));

const isoDate = computed(() => {
    const formattedYear = `${year.value}`.padStart(4, 0);
    const formattedMonth = `${month.value || 1}`.padStart(2, 0);
    const formattedDay = `${day.value || 1}`.padStart(2, 0);

    // Build a valid ISO 8601 date string.
    // Please be aware that the API returns dates with an invalid format,
    // see https://github.com/briannesbitt/Carbon/pull/862 for details.
    return `${formattedYear}-${formattedMonth}-${formattedDay}T00:00:00+00:00`;
});

const numberOfFields = computed(() => {
    let n = 3;

    if (!props.showDay) n -= 1;
    if (!props.showMonth) n -= 1;
    if (!props.showYear) n -= 1;

    return n;
});

function blurLastField() {
    if (allFieldsWereFocused.value) {
        emit('blurLastField');
    }
}

function limitField(fieldName, n = 2) {
    // eslint-disable-next-line no-param-reassign
    dateRefs[fieldName].value = dateRefs[fieldName].value.substring(0, n);
}

function padField(fieldName, n = 2) {
    if (!dateRefs[fieldName].value.length) return;

    // eslint-disable-next-line no-param-reassign
    dateRefs[fieldName].value = dateRefs[fieldName].value.padStart(n, 0);
}

function updateDay() {
    const parsedDay = parseInt(day.value, 10);
    const dayNumber = Number.isNaN(parsedDay) ? 0 : parsedDay;

    if (dayNumber < 4 && day.value.length < 2) return;
    if (props.showMonth && monthInput.value.focus) monthInput.value.focus();
    else if (props.showYear && yearInput.value.focus) yearInput.value.focus();

    limitField('day', 2);
}

function updateMonth() {
    const parsedMonth = parseInt(month.value, 10);
    const monthNumber = Number.isNaN(parsedMonth) ? 0 : parsedMonth;

    if (monthNumber < 2 && month.value.length < 2) return;
    if (props.showYear && yearInput.value.focus) yearInput.value.focus();

    limitField('month', 2);
}

function updateValue() {
    emit('input', isEmpty.value ? null : isoDate.value);
}

watch(year, updateValue);
watch(month, updateValue);
watch(day, updateValue);
watch(() => props.value, () => {
    const isFocused = yearInput.value !== document.querySelector(':focus')
        && monthInput.value !== document.querySelector(':focus')
        && dayInput.value !== document.querySelector(':focus');

    if (isFocused) {
        year.value = parseDate(props.value).year || props.defaultYear;
        month.value = parseDate(props.value).month || props.defaultMonth;
        day.value = parseDate(props.value).day || props.defaultDay;
    }
});
</script>

<template>
    <div
        :class="{
            'is-small': small,
            [`has-status-${status}`]: status,
            'has-single-field': numberOfFields === 1,
            'c-formDateInput--disabled': disabled,
        }"
        class="c-formDateInput"
        @blur.capture="blurLastField"
    >
        <input
            v-if="showDay"
            ref="dayInput"
            v-model.trim="day"
            :disabled="disabled"
            class="c-formDateInput__input c-formDateInput__input--day"
            placeholder="TT"
            min="1"
            max="31"
            type="tel"
            aria-label="Tag"
            data-qa="day field"
            @input="updateDay"
            @focus="focusedFields.day = true"
            @blur="padField('day')"
        >
        <span v-if="showDay && showMonth">
            {{ divider }}
        </span>
        <input
            v-if="showMonth"
            ref="monthInput"
            v-model.trim="month"
            :disabled="disabled"
            class="c-formDateInput__input c-formDateInput__input--month"
            placeholder="MM"
            min="1"
            max="12"
            type="tel"
            aria-label="Monat"
            data-qa="month field"
            @input="updateMonth"
            @focus="focusedFields.month = true"
            @blur="padField('month')"
        >
        <span v-if="showYear && (showDay || showMonth)">
            {{ divider }}
        </span>
        <input
            v-if="showYear"
            ref="yearInput"
            v-model.trim="year"
            :disabled="disabled"
            class="c-formDateInput__input c-formDateInput__input--year"
            placeholder="JJJJ"
            type="tel"
            aria-label="Jahr"
            data-qa="year field"
            @input="limitField('year', 4)"
            @focus="focusedFields.year = true"
            @blur="padField('year', 4)"
        >
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/components/input';

.c-formDateInput {
    $root: &;

    &:focus-within {
        border-color: $k-color-primary;
        box-shadow: 0 0 $k-spacing--s rgba($k-color-gray--500, 0.5);
    }

    @include input;

    display: inline-flex;

    &:not(.has-single-field) {
        width: auto;
    }

    &__input {
        box-sizing: content-box;
        padding: 0 $k-spacing--xs;
        max-width: 100%;
        border: none;

        &:first-child {
            padding-left: 0;
        }

        &:last-child {
            padding-right: 0;
        }

        &:focus {
            outline: none;
        }

        #{$root}:not(.has-single-field) & {
            text-align: center;

            &--day {
                width: 1.5em;
            }

            &--month {
                width: 1.75em;
            }

            &--year {
                width: 2.25em;
            }
        }

        &[disabled],
        &--disabled {
            @include k-c-input--disabled;
        }
    }

    &.is-small {
        padding: $k-spacing--s;
    }
}
</style>
