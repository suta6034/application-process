import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import PageCvDesiredJobForm from './PageCvDesiredJobForm';

jest.mock('../../store');

const wrapper = shallowMount(PageCvDesiredJobForm);

describe('PageCvDesiredJobForm', () => {
    test('It should render successfully.', () => {
        expect(wrapper.find('[data-qa="desired job form"]').exists()).toBe(true);
    });
});
