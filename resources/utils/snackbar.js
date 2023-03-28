import Vue from 'vue';
import AppSnackbar from '../components/molecules/app/AppSnackbar';

const SNACKBAR_LIFETIME = 3000; // Animation is 2200ms, directed by global styles.
const AppSnackbarClass = Vue.extend(AppSnackbar);

export async function showSnackbar(options = {}) {
    const instance = new AppSnackbarClass({
        propsData: {
            text: 'Kein Text übergeben',
            ...options,
        },
    });
    instance.$mount();
    document.body.appendChild(instance.$el);
    return new Promise((resolve) => {
        setTimeout(() => {
            instance.$destroy();
            instance.$el.parentNode.removeChild(instance.$el);
            resolve();
        }, SNACKBAR_LIFETIME);
    });
}
