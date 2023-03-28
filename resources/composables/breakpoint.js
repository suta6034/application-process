/* instanbul ignore file */
import {
    onUnmounted,
    ref, onMounted,
    computed,
} from 'vue';

export const BREAKPOINTS = {
    s: '20em', // 320px
    m: '45em', // 720px
    l: '78em', // 1248px
};

function useMediaQuery(query) {
    const mediaQuery = window.matchMedia(query);
    const matches = ref(mediaQuery.matches);
    const handler = (event) => { matches.value = event.matches; };
    onMounted(() => mediaQuery.addEventListener('change', handler));
    onUnmounted(() => mediaQuery.removeEventListener('change', handler));

    return matches;
}

export function useBreakpoints() {
    const isLargeScreen = useMediaQuery(`(min-width: ${BREAKPOINTS.l})`);
    const isMediumScreen = useMediaQuery(`(min-width: ${BREAKPOINTS.m})`);
    const isMobile = computed(() => !isMediumScreen.value);

    return {
        isMobile,
        isMediumScreen,
        isLargeScreen,
    };
}
