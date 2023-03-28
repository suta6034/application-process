import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppMotivationLetterAssemblyKit from './AppMotivationLetterAssemblyKit';
import AppSnackbar from '../../molecules/app/AppSnackbar';
import {
    SMALL_DEVICE,
} from '../../../../tests/app/jest-setup';

let wrapper;
function makeWrapper() {
    wrapper = mount(AppMotivationLetterAssemblyKit, {
        stubs: { AppSnackbar },
    });
}

describe('AppMotivationLetterAssemblyKit', () => {
    test('It should render a `<div>`.', () => {
        makeWrapper();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should emit an `insert` event with the first placeholder entry'
            + ' when clicking the first placeholder link.', async () => {
        makeWrapper();

        await wrapper.find('[data-qa="insert text placeholder"]').trigger('click');

        expect(wrapper.emitted('insert')).toEqual([['(Vorname)']]);
    });

    test('It should emit an `insert` event with the first template entry'
        + 'when clicking the first insert link.', async () => {
        makeWrapper();

        await wrapper.find('[data-qa="tab Einleitung"]').trigger('click');
        await wrapper.find('[data-qa="insert text template"]').trigger('click');

        expect(wrapper.emitted('insert')).toEqual([[
            'Sie suchen eine verantwortungsbewusste, entscheidungsstarke und engagierte '
                + 'Person für die Leitung des Marketings der (Firmenname aus Inserat) – '
                + 'ich bin die richtige Person für Sie.']]);
    });

    test('It should switch to the tab-content when clicking on the Einleitung tab.', async () => {
        makeWrapper();

        expect(wrapper.find('[data-qa="tab-content Intelligente Felder"]').exists()).toBe(true);

        await wrapper.find('[data-qa="tab Einleitung"]').trigger('click');

        expect(wrapper.find('[data-qa="tab-content Einleitung"]').exists()).toBe(true);
    });

    test('It should initially open the first accordion item of the first tab.', () => {
        makeWrapper();

        expect(wrapper.find('[data-qa="items"]').exists()).toBe(true);
    });

    test('It should not open the first accordion item when clicking on the Hauptteil tab.', async () => {
        makeWrapper();

        await wrapper.find('[data-qa="tab Hauptteil"]').trigger('click');

        expect(wrapper.find('[data-qa="items"]').exists()).toBe(false);
    });

    test('It should hide the infobox when clicking the close button.', async () => {
        makeWrapper();

        expect(wrapper.find('[data-qa="infobox"]').exists()).toBe(true);

        await wrapper.find('[data-qa="close infobox"]').trigger('click');

        expect(wrapper.find('[data-qa="infobox"]').exists()).toBe(false);
    });

    describe('small devices', () => {
        beforeEach(() => { global.innerWidth = SMALL_DEVICE; });
        test('It should not initially select and open a tab.', () => {
            makeWrapper();

            expect(wrapper.find('[data-qa="tab-content Intelligente Felder"]').exists()).toBe(false);
            expect(wrapper.find('[data-qa="tab Intelligente Felder"]').classes()).not.toContain('has-status-active');
        });

        test('It should show the copy link for placeholders.', async () => {
            makeWrapper();

            await wrapper.find('[data-qa="tab Intelligente Felder"]').trigger('click');

            expect(wrapper.find('[data-qa="copy text placeholder"]').exists()).toBe(true);
            expect(wrapper.find('[data-qa="insert text placeholder"]').exists()).toBe(false);
        });

        test('It should show the copy link for templates.', async () => {
            makeWrapper();

            await wrapper.find('[data-qa="tab Einleitung"]').trigger('click');

            expect(wrapper.find('[data-qa="copy text template"]').exists()).toBe(true);
            expect(wrapper.find('[data-qa="insert text template"]').exists()).toBe(false);
        });

        test('It should show the snackbar when I copy a placeholder.', async () => {
            Object.assign(navigator, {
                clipboard: {
                    writeText: () => {},
                },
            });
            makeWrapper();

            expect(document.body.querySelector('[data-qa="snackbar"]')).toBe(null);

            await wrapper.find('[data-qa="tab Intelligente Felder"]').trigger('click');
            await wrapper.find('[data-qa="copy text placeholder"]').trigger('click');

            expect(document.body.querySelector('[data-qa="snackbar"]')).not.toBe(null);
        });
    });
});
