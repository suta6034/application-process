<script setup>
import {
    computed, nextTick, ref, watchEffect,
} from 'vue';
import * as logger from '../../../utils/logger';
import iconList from '../../../data/icon-list.json';
import {
    useUniqueId,
} from '../../../composables/unique-id';

const props = defineProps({
    name: {
        type: String,
        required: true,
        validator: value => iconList.includes(value),
    },
    size: {
        type: String,
    },
    fixedWidth: {
        type: Boolean,
        default: false,
    },
    spin: {
        type: Boolean,
        default: false,
    },
});

const version = computed(() => {
    const map = {
        '3xl': 'm',
        '2xl': 'm',
        xl: 's',
        l: 's',
        m: 's',
        s: 's',
        xs: 's',
        '2xs': 's',
    };

    if (props.size) {
        return map[props.size];
    }
    return map.m;
});

const iconsThatShouldNotBeVerticallyCorrected = ['plus'];
const noVerticalCorrection = computed(() => iconsThatShouldNotBeVerticallyCorrected.includes(props.name));

const iconName = computed(() => `${props.name}--${version.value}`);

const { id } = useUniqueId();
const renderIcon = ref(id);
const loadIcon = async () => {
    try {
        await import(/* webpackChunkName: "AppIcon-[request]" */ `../icons/${props.name}--${version.value}`);
        // Trigger re-render of icon by changing :key after successful load
        renderIcon.value = `${id}-`;
        await nextTick();
        renderIcon.value = id;
    } catch (exception) {
        /* istanbul ignore next */
        logger.info({
            exception,
            fingerprint: ['icon chunk loading failed'],
            extras: {
                name: props.name,
            },
            tags: {
                user_info: logger.userInfoTags.NONE,
            },
        });
    }
};
watchEffect(loadIcon);
</script>

<template>
    <AppSvgIcon
        :key="renderIcon"
        :class="{
            [`c-appIcon--${size}`]: size,
            [`c-appIcon--fixedWidth`]: fixedWidth,
            [`c-appIcon--spin`]: spin,
            [`c-appIcon--noVerticalCorrection`]: noVerticalCorrection,
        }"
        :name="iconName"
        class="c-appIcon"
    />
</template>

<style lang="scss">
@import '../../../assets/scss/settings/font-size';

.c-appIcon {
    position: relative;
    top: -0.05em;
    display: inline-block;
    width: auto;
    height: 1em;
    fill: none;
    stroke: currentcolor;

    &--xs {
        // stylelint-disable-next-line property-disallowed-list
        font-size: $k-font-size--xs;
    }

    &--s {
        // stylelint-disable-next-line property-disallowed-list
        font-size: $k-font-size--s;
    }

    &--l {
        // stylelint-disable-next-line property-disallowed-list
        font-size: $k-font-size--l;
    }

    &--xl {
        // stylelint-disable-next-line property-disallowed-list
        font-size: $k-font-size--xl;
    }

    &--2xl {
        // stylelint-disable-next-line property-disallowed-list
        font-size: $k-font-size--2xl;
    }

    // There is no `3xl` font size, but we need an `3xl` icon size.
    &--3xl {
        // stylelint-disable-next-line property-disallowed-list
        font-size: 2.75em;
    }

    &--fixedWidth {
        width: 1em;
        text-align: center;
    }

    &--spin {
        animation: spin 1s infinite steps(12);
    }

    &--fill {
        fill: currentcolor;
        stroke: none;
    }

    &--noVerticalCorrection {
        top: 0;
    }

    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
