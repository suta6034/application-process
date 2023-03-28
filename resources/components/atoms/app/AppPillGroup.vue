<script setup>
defineProps({
    tag: {
        type: String,
        default: 'span',
    },
    label: {
        type: String,
    },
    labelDefinition: {
        type: String,
    },
});
</script>

<template>
    <div
        class="k-c-pillGroup"
    >
        <span
            :is="tag"
            :title="label"
            class="k-c-pillGroup__start"
            data-qa="primary action"
            @click="$emit('primaryAction')"
        >
            <span
                class="k-c-pillGroup__text"
                :class="{
                    'u-bold': labelDefinition,
                }"
                data-qa="label"
            >
                <template v-if="label">
                    {{ label }}
                </template>
                <slot v-else/>
            </span>
            <span
                v-if="labelDefinition"
                data-qa="label definition"
            >
                {{ labelDefinition }}
            </span>
        </span>
        <button
            v-if="$slots.secondaryAction"
            class="k-c-pillGroup__end"
            data-qa="secondary action"
            @click="$emit('secondaryAction')"
        >
            <slot name="secondaryAction"/>
        </button>
    </div>
</template>
