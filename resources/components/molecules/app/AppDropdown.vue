<script setup>
import {
    ref,
} from 'vue';
import '../../../directives/click-outside';
import '../../../directives/touch-outside';

defineProps({
    items: {
        default: null,
        type: Array,
    },
    disabled: {
        default: false,
        type: Boolean,
    },
});

const emit = defineEmits(['open']);

const open = ref(false);
const toggle = () => {
    open.value = !open.value;
    if (open.value) emit('open');
};
const close = () => {
    open.value = false;
};
</script>

<template>
    <div
        v-click-outside="close"
        v-touch-outside="close"
        class="c-appDropdown k-c-dropdown"
        data-qa="dropdown open"
        :class="{'c-appDropdown--open': open}"
    >
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
        <div
            v-if="$slots.trigger"
            class="c-appDropdown__trigger"
            data-qa="trigger"
            @click="toggle"
        >
            <slot name="trigger"/>
        </div>
        <div
            v-if="open"
            class="c-appDropdown__content"
            data-qa="content"
        >
            <ul
                v-if="items"
                class="k-c-dropdown__list k-c-dropdown__list--open"
            >
                <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                <li
                    v-for="(item, index) in items"
                    :key="index"
                    class="k-c-dropdown__listItem"
                    data-qa="filter item"
                    @click="emit('select-item', item); close()"
                >
                    {{ item.text }}
                </li>
            </ul>
            <slot
                v-else
                :close="close"
            />
        </div>
    </div>
</template>
