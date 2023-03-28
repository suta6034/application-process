import {
    minitask,
} from './minitask';
import {
    notification,
} from './notification';
// eslint-disable-next-line import/no-cycle
import {
    profile,
} from './profile';
// eslint-disable-next-line import/no-cycle
import {
    profileCreate,
} from './profile-create';
// eslint-disable-next-line import/no-cycle
import {
    templateSettings,
} from './template-settings';
// eslint-disable-next-line import/no-cycle
import {
    user,
} from './user';

import header from './components/header';
import popup from './components/popup';

export default {
    header,
    minitask,
    notification,
    popup,
    profile,
    profileCreate,
    templateSettings,
    user,
};
