import Vue from 'vue';

// https://stackoverflow.com/a/42389266
Vue.directive('click-outside', {
    bind(el, binding) {
        // eslint-disable-next-line no-param-reassign
        el.eventClickOutside = (event) => {
            // Check if the click was outside of the component and its children.
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.body.addEventListener('click', el.eventClickOutside, { capture: true });
    },
    unbind(el) {
        document.body.removeEventListener('click', el.eventClickOutside, { capture: true });
    },
});
