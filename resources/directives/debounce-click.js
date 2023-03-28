import Vue from 'vue';

const DEBOUNCE_TIME_IN_MS = 3000;

Vue.directive('debounce-click', {
    bind(el) {
        // eslint-disable-next-line no-param-reassign
        el.event = (event) => {
            if (event.type === 'click') {
                // eslint-disable-next-line no-param-reassign
                el.disabled = true;
                setTimeout(() => {
                    // eslint-disable-next-line no-param-reassign
                    el.disabled = false;
                }, DEBOUNCE_TIME_IN_MS);
            }
        };
        el.addEventListener('click', el.event);
    },
    unbind(el) {
        el.removeEventListener('click', el.event);
    },
});
