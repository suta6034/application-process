<template>
    <div class="k-c-cupcake">
        <div
            v-if="$slots.cherry"
            class="k-c-cupcake__cherry"
        >
            <slot name="cherry"/>
        </div>
        <div class="k-c-cupcake__text">
            <slot/>
        </div>
        <div
            v-if="$slots.action"
            class="k-c-cupcake__action"
        >
            <slot name="action"/>
        </div>
    </div>
</template>
