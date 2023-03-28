import flushPromises from 'flush-promises';

import {
    mount,
} from '../../../tests/app/vue/utils';
import * as motivationLetterService from '../../services/motivation-letter';
import PageMotivationLetterForm from './PageMotivationLetterForm';
import * as moduleApi from '../../utils/snackbar';

jest.mock('../../services/motivation-letter');
// eslint-disable-next-line no-import-assign
motivationLetterService.SHAPE = jest.requireActual('../../services/motivation-letter').SHAPE;

function makeWrapper(options) {
    return mount(PageMotivationLetterForm, {
        stubs: {
            // The components rely on Vuex and we don't want to mock Vuex.
            ModalApiError: { render: h => h('div', { attrs: { 'data-qa': 'error modal' } }) },
        },
        provide: {
            router: {
                push: jest.fn(),
            },
        },
        ...options,
    });
}

describe('PageMotivationLetterForm', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = makeWrapper();
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should show the correct texts for adding a letter of motivation.', () => {
        const wrapper = makeWrapper();

        expect(wrapper.find('[data-qa="headline"]').text()).toBe('Vorlage hinzufügen');
        expect(wrapper.find('[data-qa="save button"]').text()).toBe('Vorlage hinzufügen');
    });

    test('It should show the correct texts for editing a letter of motivation.', () => {
        motivationLetterService.get.mockResolvedValue({ data: { id: '123', title: 'Foo', text: 'Bar' } });
        const wrapper = makeWrapper({
            propsData: {
                id: '123',
            },
        });

        expect(wrapper.find('[data-qa="headline"]').text()).toBe('Vorlage bearbeiten');
        expect(wrapper.find('[data-qa="save button"]').text()).toBe('Änderungen speichern');
    });

    test('It should show a snackbar after successfully creating a motivation letter.', async () => {
        const spy = jest.spyOn(moduleApi, 'showSnackbar');
        motivationLetterService.post.mockResolvedValue({ data: { id: '123', title: 'Foo', text: 'Bar' } });
        const wrapper = makeWrapper();

        await wrapper.find('[data-qa="motivation letter title"]').setValue('Foo');
        await wrapper.find('[data-qa="motivation letter text"]').setValue('Bar');
        await wrapper.find('[data-qa="save button"]').trigger('click');

        await flushPromises();

        expect(spy.mock.lastCall[0]).toHaveProperty('dataQa', 'success created');
    });

    test('It should show a snackbar after successfully updating a motivation letter.', async () => {
        const spy = jest.spyOn(moduleApi, 'showSnackbar');
        motivationLetterService.get.mockResolvedValue({ data: { id: '123', title: 'Foo', text: 'Bar' } });
        motivationLetterService.patch.mockResolvedValue({ data: { id: '123', title: 'Foo', text: 'Test' } });
        const wrapper = makeWrapper({
            propsData: {
                id: '123',
            },
        });
        await flushPromises();

        await wrapper.find('[data-qa="motivation letter text"]').setValue('Test');
        await wrapper.find('[data-qa="save button"]').trigger('click');

        await flushPromises();

        expect(spy.mock.lastCall[0]).toHaveProperty('dataQa', 'success updated');
    });

    // Uncomment these tests when the component actually gets used again
    /*
    test('It should show an error modal when creating fails.', async () => {
        motivationLetterService.post.mockRejectedValue(new Error());
        const wrapper = makeWrapper();

        await wrapper.find('[data-qa="motivation letter title"]').setValue('Foo');
        await wrapper.find('[data-qa="motivation letter text"]').setValue('Bar');
        await wrapper.find('[data-qa="save button"]').trigger('click');

        await flushPromises();

        expect(wrapper.find('[data-qa="error modal"]').exists()).toBe(true);
    });

    test('It should show an error modal when updating fails.', async () => {
        motivationLetterService.get.mockResolvedValue({ data: { id: '123', title: 'Foo', text: 'Bar' } });
        motivationLetterService.patch.mockResolvedValue({ data: { id: '123', title: 'Foo', text: 'Test' } });
        const wrapper = makeWrapper({
            propsData: {
                id: '123',
            },
        });

        await flushPromises();

        await wrapper.find('[data-qa="motivation letter title"]').setValue('Foo');
        await wrapper.find('[data-qa="save button"]').trigger('click');

        await flushPromises();

        expect(wrapper.find('[data-qa="error modal"]').exists()).toBe(true);
    });
     */

    test('It should insert a text template at the start'
        + ' when the textarea is not focused and insert text is clicked.', async () => {
        motivationLetterService.get.mockResolvedValue({ data: { id: '123', title: 'Foo', text: 'Bar Test' } });
        motivationLetterService.patch.mockResolvedValue({ data: { id: '123', title: 'Foo', text: 'Test' } });
        const wrapper = makeWrapper({
            propsData: {
                id: '123',
            },
        });
        await flushPromises();

        const textarea = await wrapper.find('[data-qa="motivation letter text"]');
        await wrapper.find('[data-qa="insert text placeholder"]').trigger('click');

        expect(textarea.element.value).toBe('(Vorname)\n\nBar Test');
    });
});
