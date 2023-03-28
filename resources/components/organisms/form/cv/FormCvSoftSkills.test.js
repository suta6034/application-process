import Vuex from 'vuex';

import store from '../../../../store';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';

import FormCvSoftSkills from './FormCvSoftSkills';

jest.mock('../../../../store');
let wrapper;

localVue.use(Vuex);

store.state.profile.softSkill.rows = [
    {
        id: 56,
        personalityTraitId: 2,
    },
    {
        id: 66,
        personalityTraitId: 13,
    },
];

const mockRouter = {
    push: jest.fn(),
};

beforeEach(() => {
    wrapper = mount(FormCvSoftSkills, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
        },
        propsData: {
            items: [
                {
                    id: 1,
                    label: 'Begeisterungsfähigkeit',
                    sort: 1,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 2,
                    label: 'Selbstreflexion',
                    sort: 2,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 3,
                    label: 'Vernetztes Denken',
                    sort: 3,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 4,
                    label: 'Selbstständigkeit',
                    sort: 4,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 5,
                    label: 'Risikobereitschaft',
                    sort: 5,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 6,
                    label: 'Schnelle Auffassungsgabe',
                    sort: 6,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 7,
                    label: 'Flexibilität',
                    sort: 7,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 8,
                    label: 'Anpassungsfähigkeit',
                    sort: 8,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 9,
                    label: 'Selbstmotivation',
                    sort: 9,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 10,
                    label: 'Zeitmanagement',
                    sort: 10,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 11,
                    label: 'Kreativität',
                    sort: 11,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 12,
                    label: 'Durchhaltevermögen',
                    sort: 12,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 13,
                    label: 'Genauigkeit',
                    sort: 13,
                    personalityTraitGroupId: 1,
                },
                {
                    id: 14,
                    label: 'Lernbereitschaft',
                    sort: 14,
                    personalityTraitGroupId: 1,
                },
            ],
        },
        provide: {
            store,
        },
    });
});

describe('FormCvSoftSkills', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render all items', () => {
        expect(wrapper.findAll('.c-appPill').length).toBe(14);
    });

    test('It should render deactivated items as outline', () => {
        expect(wrapper.findAll('.k-c-pill--outline').length).toBe(12);
    });

    test('It should activate/deactivate items on click', async () => {
        const deactivated = wrapper.find('.k-c-pill--outline');
        const activated = wrapper.find('.c-appPill:not(.k-c-pill--outline)');
        activated.trigger('click');
        await wrapper.vm.$nextTick();
        expect(activated.vm.$el.classList.contains('k-c-pill--outline')).toBe(true);
        expect(wrapper.findAll('.k-c-pill--outline').length).toBe(13);

        deactivated.trigger('click');
        await wrapper.vm.$nextTick();
        expect(deactivated.vm.$el.classList.contains('k-c-pill--outline')).toBe(false);
        expect(wrapper.findAll('.k-c-pill--outline').length).toBe(12);
    });

    test('It should activate the save button after items have changed', async () => {
        const activated = wrapper.find('.k-c-pill');
        const saveButton = wrapper.find('[data-qa="save button"]');

        expect(saveButton.vm.$el.classList.contains('k-c-button--disabled')).toBe(true);
        activated.trigger('click');
        await wrapper.vm.$nextTick();
        expect(saveButton.vm.$el.classList.contains('k-c-button--disabled')).toBe(false);
    });
});
