<script setup>
import AppLink from '../../atoms/app/AppLink';
</script>

<template>
    <div
        class="c-appCard k-c-card k-c-card--noBorder k-c-card--overflowable"
        data-qa="app-card"
    >
        <div class="k-c-card__header">
            <div class="k-o-media k-o-media--s">
                <slot name="header"/>
            </div>
            <AppLink
                v-if="$slots.action"
                tag="div"
                class="k-c-headline-m"
            >
                <slot name="action"/>
            </AppLink>
        </div>
        <div class="k-c-card__body">
            <slot/>
        </div>
    </div>
</template>
