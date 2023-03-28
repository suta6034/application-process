<script setup>
import {
    onMounted, useSlots,
} from 'vue';

defineProps({
    ladderSize: {
        type: String,
        default: 'm',
    },
});

if (process.env.NODE_ENV === 'development') {
    onMounted(() => {
        const slots = useSlots();
        const children = slots.default?.();
        const hasInvalidChildren = children?.some(child => !child.elm.classList.contains('c-listWrapperItem'));
        if (hasInvalidChildren) throw new Error('`ListWrapper` must be used with `ListWrapperItem`');
    });
}
</script>

<template>
    <ul
        class="c-listWrapper k-o-ladder"
        :class="{[`k-o-ladder--${ladderSize}`]: ladderSize}"
    >
        <slot/>
    </ul>
</template>
