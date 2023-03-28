<script setup>
import {
    onBeforeMount,
} from 'vue';

const props = defineProps({
    tag: {
        default: 'a',
        type: String,
    },
    to: {
        type: Object,
    },
    href: {
        type: String,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    neutral: {
        type: Boolean,
        default: false,
    },
    mixed: {
        type: Boolean,
        default: false,
    },
    light: {
        type: Boolean,
        default: false,
    },
    secondary: {
        type: Boolean,
        default: false,
    },
    underline: {
        type: Boolean,
        default: false,
    },
    iconDynamic: {
        type: Boolean,
        default: false,
    },
});

if (process.env.NODE_ENV === 'development') {
    onBeforeMount(() => {
        const isLinkWithNoDestination = props.tag === 'a' && !props.to && !props.href;
        if (isLinkWithNoDestination) throw new Error('Anchor links without a `href` are invalid!');
    });
}
</script>

<template>
    <!-- eslint-disable vue/multiline-html-element-content-newline -->
    <Component
        :is="to ? 'router-link' : tag"
        :tag="to ? tag : undefined"
        :to="to"
        :disabled="disabled ? true : undefined"
        :class="{
            'k-c-link--disabled': disabled,
            'k-c-link--light': light,
            'k-c-link--mixed': mixed,
            'k-c-link--neutral': neutral,
            'k-c-link--secondary': secondary,
            'k-c-link--underline': underline,
            'k-c-link--icon': $slots.icon,
        }"
        class="k-c-link"
        v-bind="href ? { href } : {}"
        v-on="$listeners"
    ><!--
    The comments prevent whitespace characters that are underlined on hover.
     --><span
            v-if="$slots.icon"
            role="button"
            aria-hidden="true"
            class="k-c-link__icon"
            :class="{'k-c-link__icon--dynamic': iconDynamic}"
        ><!--
         --><slot name="icon"/>
        </span><!--
     --><slot/><!--
 --></Component>
    <!-- eslint-enable -->
</template>
