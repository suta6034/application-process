<script setup>
import AppFooter from '../organisms/app/AppFooter';
import AppHeader from '../organisms/app/AppHeader';

defineProps({
    hasHeader: {
        default: true,
        type: Boolean,
    },
    hasFooter: {
        default: true,
        type: Boolean,
    },
});
</script>

<template>
    <div class="c-layoutMinimal">
        <header v-if="hasHeader">
            <AppHeader minimal/>
        </header>
        <main class="c-layoutMinimal__main">
            <slot/>
        </main>
        <footer>
            <AppFooter
                v-if="hasFooter"
                variant="minimal"
                data-qa="main footer"
            />
        </footer>
    </div>
</template>

<style lang="scss">
.c-layoutMinimal {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__main {
        flex-grow: 1;
    }
}
</style>
