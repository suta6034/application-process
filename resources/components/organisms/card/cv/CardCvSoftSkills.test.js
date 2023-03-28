import Vuex from 'vuex';
import flushPromises from 'flush-promises';

import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';

import CardCvSoftSkills from './CardCvSoftSkills';

jest.mock('../../../../composables/cv-card', () => ({
    useCvCard: () => ({
        openEdit: jest.fn(),
        isInEditMode: jest.fn(),
    }),
}));

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');

jest.mock('../../../../services/soft-skills', () => ({
    getList() {
        return {
            data: [
                {
                    id: 1,
                    label: 'Persönlichkeit',
                    sort: 1,
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
                {
                    id: 2,
                    label: 'Soziale Stärken',
                    sort: 2,
                    items: [
                        {
                            id: 15,
                            label: 'Aktives Zuhören',
                            sort: 15,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 16,
                            label: 'Kompromissbereitschaft',
                            sort: 16,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 17,
                            label: 'Kommunikationsfähigkeit',
                            sort: 17,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 18,
                            label: 'Kritikfähigkeit',
                            sort: 18,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 19,
                            label: 'Einfühlungsvermögen',
                            sort: 19,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 20,
                            label: 'Interkulturelle Kompetenz',
                            sort: 20,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 21,
                            label: 'Gewissenhaftigkeit',
                            sort: 21,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 22,
                            label: 'Motivationsfähigkeit',
                            sort: 22,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 23,
                            label: 'Konfliktfähigkeit',
                            sort: 23,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 24,
                            label: 'Teamfähigkeit',
                            sort: 24,
                            personalityTraitGroupId: 2,
                        },
                        {
                            id: 25,
                            label: 'Wissensvermittlung',
                            sort: 25,
                            personalityTraitGroupId: 2,
                        },
                    ],
                },
                {
                    id: 3,
                    label: 'Führungskompetenz',
                    sort: 3,
                    items: [],
                },
                {
                    id: 4,
                    label: 'Methodische Kompetenz',
                    sort: 4,
                    items: [],
                },
                {
                    id: 5,
                    label: 'Werte',
                    sort: 5,
                    items: [],
                },
            ],
        };
    },
}));

const storeMocks = createStoreMocks();

localVue.use(Vuex);

storeMocks.store.state.profile.softSkill.rows = [
    {
        id: 56,
        personalityTraitId: 2,
    },
    {
        id: 66,
        personalityTraitId: 13,
    },
    {
        id: 75,
        personalityTraitId: 17,
    },
];

async function createWrapper() {
    const wrapper = mount(CardCvSoftSkills, {
        localVue,
        store: storeMocks.store,
    });
    await flushPromises();

    return wrapper;
}

describe('CardCvSoftSkills', () => {
    test('It should render a div', async () => {
        const wrapper = await createWrapper();
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should display saved soft-skills pills', async () => {
        const wrapper = await createWrapper();

        const pillList = wrapper.findAll('[data-qa="soft skill list"]');
        expect(pillList.length).toBe(2);
        expect(pillList.at(0).findAll('[data-qa="soft skill"]').length).toBe(2);
        expect(pillList.at(1).findAll('[data-qa="soft skill"]').length).toBe(1);
    });

    test('It should render an infobox containing number of missing soft-skills categories', async () => {
        const wrapper = await createWrapper();
        const infoBox = wrapper.find('[data-qa="info box"]');
        expect(infoBox.element.classList).toContain('c-appInfoBox');
        expect(infoBox.html()).toContain('3 von 5');
    });

    test('It should emit an event after clicking the plus icon', async () => {
        const wrapper = await createWrapper();
        const logger = jest.spyOn(wrapper.vm, 'openEdit');

        wrapper.find('[data-qa="add softSkills"]').trigger('click');
        expect(logger).toHaveBeenCalled();
    });

    test('It should emit an event after clicking a pill', async () => {
        const wrapper = await createWrapper();
        const logger = jest.spyOn(wrapper.vm, 'openEdit');

        wrapper.find('[data-qa="soft skill"]').trigger('click');
        expect(logger).toHaveBeenCalled();
    });
});
