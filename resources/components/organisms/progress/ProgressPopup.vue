<script setup>
import ProgressDots from '../../atoms/progress/ProgressDots';
import {
    useState,
} from '../../../composables/vuex-helpers';

const {
    active,
} = useState('popup');
</script>

<template>
    <div
        v-if="active"
        class="c-progressPopup"
        data-qa="loading dots"
    >
        <ProgressDots/>
    </div>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/z-index';

.c-progressPopup {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: $z-index-progress-popup;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba($k-color-white, 0.9);
}
</style>
