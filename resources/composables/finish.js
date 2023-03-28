import {
    inject,
} from 'vue';
import {
    useState,
} from './vuex-helpers';
import * as authService from '../services/auth';

export function useFinish() {
    const router = inject('router');
    const {
        email,
    } = useState('profileCreate/basics');

    async function finish(profileType = 'standard') {
        if (await authService.isUserLoggedIn()) {
            await router.push({ name: 'page-profile-save', params: { profileType } });
            return;
        }

        await router.push({
            name: 'register',
            query: {
                redirectUrl: router.resolve({ name: 'page-profile-save', params: { profileType } }).href,
                email: email.value,
                type: 'cv-created',
            },
        });
    }

    return {
        finish,
    };
}
