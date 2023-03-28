import Vue from 'vue';
// TODO: Please do not use this in new features anymore (KSPECK-2424), it will be replaced by the
// microfrontends (KSPECK-2611) because it is only used in the header

// https://stackoverflow.com/a/42389266
Vue.directive('touch-outside', {
    bind(el, binding) {
        // eslint-disable-next-line no-param-reassign
        el.eventTouchOutside = (event) => {
            // Check if the touch was outside of the component and its children.
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.body.addEventListener('touchstart', el.eventTouchOutside, { capture: true });
    },
    unbind(el) {
        document.body.removeEventListener('touchstart', el.eventTouchOutside, { capture: true });
    },
});
