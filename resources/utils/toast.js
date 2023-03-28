import Vue from 'vue';
import AppToast from '../components/molecules/app/AppToast';

const TOAST_LIFETIME = 3000;
const ToastClass = Vue.extend(AppToast);

export async function showToast(options) {
    const instance = new ToastClass({
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
        }, TOAST_LIFETIME);
    });
}
