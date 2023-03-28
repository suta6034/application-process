<script setup>
import {
    onMounted, watch, computed, ref, nextTick,
} from 'vue';
import {
    disableScrollLock,
    enableScrollLock,
} from '../../../utils/scroll-lock';

const props = defineProps({
    maxlength: {
        type: Number,
    },
    validationIndicator: {
        type: String,
        default: 'circle',
        validator(value) {
            return ['circle', 'text'].includes(value);
        },
    },
    remainingWarning: {
        type: Number,
        default: 20,
    },
    status: {
        type: String,
    },
    trim: {
        type: Boolean,
        default: true,
    },
    value: {
        type: String,
        default: '',
    },
    maxRows: {
        type: Number,
    },
});

const stringValue = computed(() => {
    if (!props.value) return '';
    return props.value;
});

const textarea = ref(null);
const limitStatus = computed(() => (stringValue.value.length / props.maxlength) * 100);
const remainingCharacters = computed(() => props.maxlength - stringValue.value.length);
const initialRows = computed(() => textarea.value.rows);
const textareaStyle = computed(() => getComputedStyle(textarea.value));

const emit = defineEmits(['input', 'blur']);

// this is related to the cursor position.
// the observation of the position of cursor is lost,
// only when it resets the template by clicking the button.
// so the last cursor position should get manually given.
const updateValue = (e) => {
    const cursorPoint = e.target.selectionStart;
    const element = e.target;
    window.requestAnimationFrame(() => {
        element.selectionStart = cursorPoint;
        element.selectionEnd = cursorPoint;
    });

    emit('input', e.target.value);
};

// Update the size of the textarea to fit the number of lines of text.
// This is only a convenience function. So we catch errors and fail
// silently to not break the app if an error happens.
const textareaGrow = () => {
    try {
        enableScrollLock(); // Prevent random scrolling when calculating new row number (e.g. in firefox)

        const paddingTop = parseInt(textareaStyle.value.getPropertyValue('padding-top'), 10);
        const paddingBottom = parseInt(textareaStyle.value.getPropertyValue('padding-bottom'), 10);
        const lineHeight = parseInt(textareaStyle.value.getPropertyValue('line-height'), 10);

        // Resetting the row count is necessary for recalculating the `scrollHeight` of the textarea.
        textarea.value.rows = initialRows.value;

        const innerHeight = textarea.value.scrollHeight - paddingTop - paddingBottom;
        let calculatedRows = (innerHeight / lineHeight);

        // Limit to max rows
        if (props.maxRows && calculatedRows > props.maxRows) {
            calculatedRows = props.maxRows;
        }

        // Add a row for the circle indicator.
        if (props.validationIndicator === 'circle') {
            calculatedRows += 1;
        }

        textarea.value.rows = calculatedRows;

        disableScrollLock();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }
};

// Disable trimming of line-breaks at the end of the textarea value.
// It's needed to enable inserting text with the assembly kit
// at the end in a new line at the motivation letter textarea. (KSPECK-3898)
const trimValueOnBlur = (event) => {
    emit('input', props.trim ? event.target.value.trim() : event.target.value);
};

onMounted(textareaGrow);

// Triggering `textareaGrow()` in both, the `mounted()` lifecycle hook and in the
// `watch.value()` method, is necessary, because watchers with `immediate: true`
// are triggered before evaluating computed properties.
watch(() => props.value, async () => {
    await nextTick();
    textareaGrow();
});
</script>

<script>
export default {
    inheritAttrs: false,
};
</script>

<template>
    <div class="c-formTextareaLimited">
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <textarea
            ref="textarea"
            :class="{
                [`has-status-${status}`]: status,
            }"
            :value="value"
            v-bind="$attrs"
            class="c-formTextareaLimited__textarea"
            :maxlength="maxlength"
            @input="updateValue"
            @blur="emit('blur', $event); trimValueOnBlur($event)"
        />
        <div
            v-if="maxlength && validationIndicator === 'circle'"
            class="k-c-circularProgressIndicator k-c-circularProgressIndicator--bottomRightPosition"
            data-qa="character counter"
        >
            <span
                class="k-c-circularProgressIndicator__text"
                :class="{
                    'k-c-circularProgressIndicator__text--red': remainingCharacters < 0,
                }"
            >
                {{ remainingCharacters }}
            </span>
            <svg
                class="k-c-circularProgressIndicator__circleWrapper"
                viewBox="-2 -2 37.83098862 37.83098862"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    class="k-c-circularProgressIndicator__circle k-c-circularProgressIndicator__circle--base"
                    cx="16.91549431"
                    cy="16.91549431"
                    r="15.91549431"
                    fill="none"
                    stroke-width="3"
                />
                <circle
                    :stroke-dasharray="`${limitStatus},100`"
                    class="
                        c-formTextareaLimited__counterProgress
                        k-c-circularProgressIndicator__circle
                        k-c-circularProgressIndicator__circle--green
                    "
                    :class="{
                        'k-c-circularProgressIndicator__circle--yellow': remainingCharacters <= remainingWarning,
                        'k-c-circularProgressIndicator__circle--red': remainingCharacters < 0,
                    }"
                    data-qa="colored indicator"
                    cx="16.91549431"
                    cy="16.91549431"
                    r="15.91549431"
                    fill="none"
                    stroke-width="4"
                />
            </svg>
        </div>
        <span
            v-if="maxlength && validationIndicator === 'text'"
            class="c-formTextareaLimited__remainingLetters"
        >
            {{ remainingCharacters }} Zeichen übrig
        </span>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/components/input';

.c-formTextareaLimited {
    position: relative;

    &__remainingLetters {
        margin-top: $k-spacing--s;
        color: $k-color-gray--600;
        @include k-typo-s;
    }

    &__textarea {
        @include input;
        @include k-typo-m;

        position: relative;
        display: block;
        background-color: transparent;
        resize: none;
    }

    em {
        background: $k-color-error;
    }
}
</style>
