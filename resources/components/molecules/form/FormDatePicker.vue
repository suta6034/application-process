<script setup>
import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    shallowRef,
} from 'vue';
import flatpickr from 'flatpickr';
import {
    Austria,
} from 'flatpickr/dist/l10n/at';

import {
    makeDateModel,
} from '../../../utils/date-model';
import {
    isMobile,
} from '../../../utils/mobile-check';

import AppIcon from '../../atoms/app/AppIcon';

function isDateInputSupported() {
    const input = document.createElement('input');
    input.type = 'date';
    const invalidValue = 'invalid-value';
    input.value = invalidValue;

    return input.value !== invalidValue;
}

const isDesktop = !isMobile();

// Prevent an infinite loop triggered by a timezone calculation mismatch:
// https://de.wikipedia.org/wiki/Gesetz_betreffend_die_Einf%C3%BChrung_einer_einheitlichen_Zeitbestimmung
const MIN_DATE = new Date('1893-04-01');

/**
 * @typedef {'a11yCompatibility'|'library'} Variant
 * Date picker variant that should be used for best a11y regarding the
 * constraints of the user device.
 */

/** @type Record<string, Variant> */
const VARIANTS = {
    library: 'library',
    a11yCompatibility: 'a11yCompatibility',
};
const variant = isDateInputSupported() && isDesktop ? VARIANTS.a11yCompatibility : VARIANTS.library;

const props = defineProps({
    hasTime: {
        default: false,
        type: Boolean,
    },
    inline: {
        default: false,
        type: Boolean,
    },
    position: {
        default: 'auto',
        type: String,
    },
    status: {
        type: String,
    },
    value: {
        default: '',
        type: String,
    },
});
const emit = defineEmits(['input']);

const flatpickrInstance = shallowRef(null);
const flatpickrElement = ref(null);

const formatDate = 'YYYY-MM-DD';
const formatTime = 'HH:mm';
const formatIsoPhp = `${formatDate}T${formatTime}:ssZ`;
const formatDatePickerInput = computed(() => `d.m.Y${props.hasTime ? ' H:i' : ''}`);

const dateModel = computed(() => (props.value ? makeDateModel(props.value, formatIsoPhp) : null));
const valueIso = computed({
    get() {
        return dateModel.value ? dateModel.value.toISOString() : '';
    },
    set(newDateTime) {
        if (!newDateTime) return;

        const newDateTimeSanitized = new Date(newDateTime) < MIN_DATE ? MIN_DATE.toISOString() : newDateTime;

        emit('input', makeDateModel(newDateTimeSanitized).format(formatIsoPhp));
    },
});
const currentValueDate = computed(() => {
    const model = dateModel.value || makeDateModel();
    return model.format(formatDate);
});
const currentValueTime = computed(() => {
    const model = dateModel.value || makeDateModel();
    return model.format(formatTime);
});
const date = computed(() => {
    if (!dateModel.value) return '';

    return dateModel.value.format(formatDate);
});

const open = () => flatpickrInstance.value && flatpickrInstance.value.open();
const updateFlatpickrDate = newDate => flatpickrInstance.value && flatpickrInstance.value.setDate(newDate);

const updateDate = (event) => {
    // Slicing the date is necessary because certain browsers allow
    // entering dates with more than 4 digits even with the `max`
    // attribute applied.
    const newDate = event.target.value?.slice(-10);
    if (!newDate) return;
    if (event.relatedTarget?.className.trim() === 'flatpickr-day') return;
    if (newDate.startsWith('0')) return;

    const newDateModel = makeDateModel(
        `${newDate}T${currentValueTime.value}`,
        `${formatDate}T${formatTime}`,
    );

    updateFlatpickrDate(newDateModel.format(formatIsoPhp));
    emit('input', newDateModel.format(formatIsoPhp));
};
const time = computed(() => {
    if (!dateModel.value) return '';

    return dateModel.value.format(formatTime);
});
const updateTime = (event) => {
    const newTime = event.target.value;
    if (!newTime) return;
    if (event.relatedTarget?.className.trim() === 'flatpickr-day') return;

    const newDateModel = makeDateModel(
        `${currentValueDate.value}T${newTime}`,
        `${formatDate}T${formatTime}`,
    );

    updateFlatpickrDate(newDateModel.format(formatIsoPhp));
    emit('input', newDateModel.format(formatIsoPhp));
};

// The time input value is not updated as long as the flatpickr element is still in focus (see: KSPECK-4026).
// As the flatpickr onChange-hook isn't capable of capturing the input event early enough, it updates the time
// value too late. To solve this issue, it is necessary to listen for the flatpickr input events of the
// hour and the minute specifically and to set the date manually.
const updateTimeOnInput = (event) => {
    let unit;
    if (event.target.classList.contains('flatpickr-minute')) {
        unit = 'minute';
    } else if (event.target.classList.contains('flatpickr-hour')) {
        unit = 'hour';
    } else {
        return;
    }

    valueIso.value = dateModel.value?.set(unit, event.target.value).toISOString();
};
onMounted(() => document.addEventListener('input', updateTimeOnInput, { capture: true }));
onUnmounted(() => document.removeEventListener('input', updateTimeOnInput, { capture: true }));

const root = ref(null);
onMounted(() => {
    flatpickrInstance.value = flatpickr(flatpickrElement.value, {
        allowInput: true,
        altFormat: formatDatePickerInput.value,
        altInput: true,
        appendTo: props.inline ? root.value : undefined,
        dateFormat: 'Z',
        enableTime: props.hasTime,
        enableSeconds: false,
        inline: props.inline,
        locale: Austria,
        monthSelectorType: 'static',
        onChange(selectedDates, dateStr) {
            valueIso.value = dateStr;
        },
        position: props.position,
        positionElement: root.value,
        time_24hr: true,
    });
});
onUnmounted(() => {
    if (!flatpickrInstance.value) return;

    flatpickrInstance.value.destroy();
});
</script>

<template>
    <div
        ref="root"
        class="c-formDatePicker"
    >
        <div
            class="c-formDatePicker__field k-c-input"
            :class="{
                [`k-c-input--${status}`]: status,
            }"
        >
            <button
                tabindex="-1"
                class="c-formDatePicker__calendarButton"
                :class="!inline && 'c-formDatePicker__calendarButton--isTrigger'"
                @click="open"
            >
                <span class="u-screen-reader-only">
                    Kalender öffnen
                </span>
                <AppIcon name="calendar"/>
            </button>
            <template v-if="variant === VARIANTS.a11yCompatibility">
                <div class="c-formDatePicker__inputWrap c-formDatePicker__inputWrap--date">
                    <input
                        :value="date"
                        type="date"
                        class="c-formDatePicker__input"
                        required
                        min="1900-01-01"
                        max="2100-01-01"
                        aria-label="Datum"
                        data-qa="date"
                        @keydown.up.stop
                        @keydown.down.stop
                        @keydown.enter.prevent
                        @keydown.space.prevent="open"
                        @click.prevent="open"
                        @input="updateDate"
                    >
                </div>
                <div
                    v-if="hasTime"
                    class="c-formDatePicker__inputWrap c-formDatePicker__inputWrap--time"
                >
                    <input
                        :value="time"
                        type="time"
                        required
                        data-qa="time"
                        class="c-formDatePicker__input"
                        aria-label="Uhrzeit"
                        @keydown.up.stop
                        @keydown.down.stop
                        @keydown.enter.prevent
                        @keydown.space.prevent="open"
                        @click.prevent="open"
                        @input="updateTime"
                    >
                </div>
            </template>
            <input
                ref="flatpickrElement"
                :value="valueIso"
                type="text"
                data-input
                tabindex="-1"
                class="c-formDatePicker__flatpickr"
                :class="[
                    variant === VARIANTS.a11yCompatibility && 'c-formDatePicker__flatpickr--hidden',
                    variant === VARIANTS.library && 'c-formDatePicker__input c-formDatePicker__input--date',
                ]"
                aria-label="Datum"
            >
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/typo';
@import '~@karriereat/global-styles/scss/components/input/settings';
@import '../../../assets/scss/settings/border-radius';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/z-index';

$padding-inner-container-horizontal: $k-spacing--m;
$width-calendar: 19rem;
$width-border: 1px;
$width-input-date: 90px;
$width-input-time: 54px;
$width-input-year: 52px;
$width-input-hour-minute: 18px;
$width-toggle: 2.75rem;
$width-day-brutto: math.div(($width-calendar - ($padding-inner-container-horizontal * 2)), 7);

.c-formDatePicker {
    &--inline {
        display: flex;
        flex-direction: column;
    }

    // 1. Trump Global Styles.
    &__field {
        position: relative;
        padding-left: $width-toggle + $k-c-input-padding !important; // 1
        background-color: $k-color-white;

        &:focus-within {
            border-color: $k-color-primary;
            box-shadow: 0 0 $k-spacing--s rgba($k-color-gray--500, 0.5);
        }
    }

    // 1. Make it as big as the component itself so the popup is positioned
    //    correctly relative to it.
    // 2. Hide the inaccessible flatpickr input field. We don't use
    //    `display: none` here because we need it as an anchor for the date
    //    picker popup.
    // 3. We want mouse or touch users to also be able to use the native date
    //    input field for changing the date via their keyboard. That's why we
    //    disable pointer events on the hidden flatpickr field so it does not
    //    cover the native date input field.
    &__flatpickr {
        appearance: none;

        &--hidden {
            position: absolute; // 1
            top: 0; // 1
            left: 0; // 1
            width: 100%; // 1
            height: 100%; // 1
            opacity: 0; // 2
            pointer-events: none; // 3
        }
    }

    &__calendarButton--isTrigger,
    &__input {
        cursor: pointer;
    }

    &__calendarButton {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: $width-toggle;
        border: none;
        border-right: 1px solid $k-c-input-border-color;
        border-top-left-radius: $k-border-radius--s;
        border-bottom-left-radius: $k-border-radius--s;
        background-color: $k-color-gray--50;

        &--isTrigger {
            &:hover {
                background-color: $k-color-gray--200;
            }
        }
    }

    // 1. Normalize size across browsers. This must be done on a wrapper to make
    //    sure the width in Firefox matches the width in Chrome.
    &__inputWrap {
        display: inline-block;
        overflow: hidden;
        vertical-align: bottom;

        &--date {
            max-width: 100%;
            width: $width-input-date; // 1
        }

        &--time {
            max-width: 100%;
            width: $width-input-time; // 1
        }
    }

    // 1. Normalize size across browsers.
    // 2. Disable the focus style because the root element has a focus style
    //    itself.
    &__input {
        padding: 0;
        border: none;
        background-color: transparent;
        // stylelint-disable-next-line property-disallowed-list
        line-height: 1;

        &:focus {
            outline: none; // 2
        }

        &::-webkit-datetime-edit-text {
            margin-right: 2px; // 1
            margin-left: 1px; // 1
        }

        &::-webkit-calendar-picker-indicator {
            display: none;
        }
    }
}

/* flatpickr */
// 1. Fix alignment.
.flatpickr-calendar {
    display: none;
    width: calc(#{$width-calendar} + #{$width-border * 2});
    border-radius: $k-border-radius--s;
    text-align: center;
    background: $k-color-white;
    touch-action: manipulation;

    &.inline {
        display: block;
        margin-top: $k-spacing--2xs;
        border: $width-border solid $k-color-gray--200;
    }

    &.arrowTop {
        position: absolute;
        display: none;
        margin-top: $k-spacing--2xs;
        box-shadow: 0 0 $k-spacing--m 0 rgba($k-color-gray--900, 0.2);
        opacity: 0;
    }

    &.arrowRight {
        margin-left: 1px; // 1
    }

    &.arrowBottom {
        margin-bottom: $k-spacing--2xs;
    }

    &.arrowLeft {
        margin-left: -1px; // 1
    }

    &.open {
        z-index: $z-index-modal-dropdown;
        display: block;
        opacity: 1;
    }

    &.animate.open {
        animation: fp-fade-in-down 300ms cubic-bezier(0.23, 1, 0.32, 1);
    }
}

.numInput::-webkit-outer-spin-button,
.numInput::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
}

// 1. Hide up and down arrows on number input fields in Firefox.
.numInput {
    appearance: textfield; // 1
}

.flatpickr-months {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $k-spacing--m;
}

.flatpickr-current-month {
    display: flex;
    align-items: center;
}

.cur-month {
    margin-right: $k-spacing--xs;
}

// 1. Visually horizontal center the month/year selectors in the dropdown.
.cur-year {
    margin-right: -15px; // 1
    padding: 0;
    width: $width-input-year;
    border: none;
}

.flatpickr-prev-month,
.flatpickr-next-month {
    width: 1em;
    color: $k-color-gray--500;
    cursor: pointer;

    svg {
        display: block;
        fill: currentcolor;
    }
}

.flatpickr-innerContainer,
.flatpickr-time {
    border-top: 1px solid $k-color-gray--200;
}

.flatpickr-innerContainer {
    padding-top: $k-spacing--m;
    padding-right: $padding-inner-container-horizontal;
    padding-bottom: $k-spacing--l;
    padding-left: $padding-inner-container-horizontal;
}

.flatpickr-weekdaycontainer {
    display: flex;
}

.dayContainer {
    display: flex;
    flex-wrap: wrap;
}

.flatpickr-weekday {
    @include k-typo-s;

    padding-top: $k-spacing--xs;
    padding-bottom: $k-spacing--s;
    width: $width-day-brutto;
    color: $k-color-gray--500;
}

.flatpickr-day {
    $margin-day-horizontal: $k-spacing--xs;

    margin: $k-spacing--2xs $margin-day-horizontal;
    padding: $k-spacing--xs $k-spacing--2xs;
    width: $width-day-brutto - ($margin-day-horizontal * 2);
    border-radius: $k-border-radius--s;
    color: $k-color-gray--700;
    cursor: pointer;

    &:hover,
    &:focus {
        background-color: $k-color-gray--50;
    }

    &.today {
        background-color: $k-color-gray--100;
    }

    &.selected {
        background-color: $k-color-gray--500;
        color: $k-color-white;
    }
}

.prevMonthDay {
    visibility: hidden;
}

.nextMonthDay {
    display: none;
}

.flatpickr-time {
    display: none;
    justify-content: center;
    padding: $k-spacing--m;

    &::after {
        margin-left: $k-spacing--s;
        content: 'Uhr';
    }

    .flatpickr-calendar.hasTime & {
        display: flex;
    }
}

.flatpickr-hour,
.flatpickr-minute {
    padding: 0;
    width: $width-input-hour-minute;
    border: none;
}

.flatpickr-time-separator {
    margin-right: $k-spacing--s;
    margin-left: $k-spacing--s;
}

@keyframes fp-fade-in-down {
    from {
        opacity: 0;
        transform: translate3d(0, -$k-spacing--l, 0);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}
</style>
