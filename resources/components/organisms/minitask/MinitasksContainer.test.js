import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    computed,
    nextTick, ref,
} from 'vue';
import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import MinitasksContainer from './MinitasksContainer';
import store from '../../../store';
import router from '../../../router';
import * as softSkillComposable from '../../../composables/resource-soft-skills';

jest.mock('../../../store');
jest.mock('../../../router');
jest.mock('../../../composables/resource-soft-skills');

const localVue = createLocalVue();
localVue.use(Vuex);

let wrapper;
const hasEmptySoftSkillGroups = ref(false);
beforeEach(() => {
    hasEmptySoftSkillGroups.value = false;
    // eslint-disable-next-line no-import-assign
    softSkillComposable.useSoftSkills = jest.fn(() => ({
        hasEmptySoftSkillGroups: computed(() => hasEmptySoftSkillGroups.value),
    }));
    store.state.profile.exists = true;
    store.state.profile.desiredJob.travelReadiness = { value: null };
    store.state.profile.desiredJob.workFromHome = { value: null };
    wrapper = shallowMount(MinitasksContainer, {
        localVue,
        store,
        provide: {
            router,
            store,
        },
    });
});

describe('MinitasksContainer', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the travel readiness minitask.', async () => {
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="travel readiness minitask"]')).toBe(true);
    });

    test('It should render the work from home minitask.', async () => {
        wrapper.vm.isFetching = false;
        store.state.profile.desiredJob.travelReadiness.value = 1;
        await nextTick();

        expect(wrapper.contains('[data-qa="work from home minitask"]')).toBe(true);
    });

    test('It should render the image minitask.', async () => {
        wrapper.vm.isFetching = false;
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        await nextTick();

        expect(wrapper.contains('[data-qa="image minitask"]')).toBe(true);
    });

    test('It should render the birthdate minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = null;
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="birthdate minitask"]')).toBe(true);
    });

    test('It should render the telephone minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="telephone minitask"]')).toBe(true);
    });

    test('It should render the address minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="address minitask"]')).toBe(true);
    });

    test('It should render the desired job employment minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="desired job employment minitask"]')).toBe(true);
    });

    test('It should render the desired job jobfield minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        store.state.profile.desiredJob.employment = ['not empty'];
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="desired job jobfield minitask"]')).toBe(true);
    });

    test('It should render the soft skill minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        store.state.profile.desiredJob.employment = ['not empty'];
        store.state.profile.desiredJob.jobFields = ['not empty'];
        hasEmptySoftSkillGroups.value = true;

        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.vm.hasEmptySoftSkillGroups).toBeTruthy();

        expect(wrapper.contains('[data-qa="soft skills minitask"]')).toBe(true);
    });

    test('It should render the language minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        store.state.profile.desiredJob.employment = ['not empty'];
        store.state.profile.desiredJob.jobFields = ['not empty'];
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="language minitask"]')).toBe(true);
    });

    test('It should render the work minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        store.state.profile.desiredJob.employment = ['not empty'];
        store.state.profile.desiredJob.jobFields = ['not empty'];
        store.state.profile.language.rows = ['not empty'];
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="work minitask"]')).toBe(true);
    });

    test('It should render the job title minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        store.state.profile.desiredJob.employment = ['not empty'];
        store.state.profile.desiredJob.jobFields = ['not empty'];
        store.state.profile.language.rows = ['not empty'];
        store.state.profile.work.rows = [
            { id: 'not empty', category: { id: 1 }, jobfield: {} },
            { id: 'not empty', category: { id: 1 }, jobfield: {} }];
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="job title minitask"]')).toBe(true);
    });

    test('It should render the job field minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        store.state.profile.desiredJob.employment = ['not empty'];
        store.state.profile.desiredJob.jobFields = ['not empty'];
        store.state.profile.language.rows = ['not empty'];
        store.state.profile.work.rows = [
            { title: 'not empty', id: 'not empty', category: { id: 1 }, jobfield: {} },
            { title: 'not empty', id: 'not empty', category: { id: 1 }, jobfield: {} }];
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="job field minitask"]')).toBe(true);
    });

    test('It should render the visibility minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        store.state.profile.desiredJob.employment = ['not empty'];
        store.state.profile.desiredJob.jobFields = ['not empty'];
        store.state.profile.language.rows = ['not empty'];
        store.state.profile.work.rows = [
            { title: 'not empty', id: 'not empty', category: { id: 1 }, jobfield: { id: 1 } },
            { title: 'not empty', id: 'not empty', category: { id: 1 }, jobfield: { id: 1 } }];
        store.state.profile.completeness = 51;
        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.contains('[data-qa="visibility minitask"]')).toBe(true);
    });

    test('It should render the success minitask.', async () => {
        store.state.profile.desiredJob.travelReadiness.value = 1;
        store.state.profile.desiredJob.workFromHome.value = 1;
        store.state.profile.image = ['not falsy'];
        store.state.profile.basics.birthdate = 'timestamp';
        store.state.profile.basics.mobile = 'not empty';
        store.state.profile.basics.street = 'not empty';
        store.state.profile.basics.town = 'not empty';
        store.state.profile.desiredJob.employment = ['not empty'];
        store.state.profile.desiredJob.jobFields = ['not empty'];
        store.state.profile.language.rows = ['not empty'];
        store.state.profile.work.rows = [
            { title: 'not empty', id: 'not empty', category: { id: 1 }, jobfield: { id: 1 } },
            { title: 'not empty', id: 'not empty', category: { id: 1 }, jobfield: { id: 1 } }];
        store.state.profile.completeness = 51;
        store.state.profile.active = true;
        store.state.minitask.meta = {
            hideSuccess: false,
            showSuccess: true,
        };

        wrapper = shallowMount(MinitasksContainer, {
            localVue,
            store,
            provide: {
                router,
                store,
            },
        });

        wrapper.vm.isFetching = false;
        await nextTick();

        expect(wrapper.vm.successDisplayStatus).toBe(true);
        expect(wrapper.contains('[data-qa="success minitask"]')).toBe(true);
    });
});
