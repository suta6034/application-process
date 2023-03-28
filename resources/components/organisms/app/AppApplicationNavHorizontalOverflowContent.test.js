import localStorageMock from '../../../services/__mocks__/localStorage';
import {
    formatIsoPhp,
    STATUS,
} from '../../../services/application';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    makeDateModel,
} from '../../../utils/date-model';

import AppApplicationNavHorizontalOverflowContent from './AppApplicationNavHorizontalOverflowContent';

jest.mock('../../../store');
window.localStorage = localStorageMock;

let storeMocks;

const mockApplication = {
    id: '12345',
    firstname: 'Laura',
    surname: 'Heidelbeere',
    companyName: 'karriere.at',
    message: 'Laura bewirbt sich, mal wieder.',
    createDate: '2019-09-10T12:08:49+02:00',
    attachments: [{
        url: 'test.at',
        name: 'test',
    }],
    company: {
        isChiffre: false,
    },
};

function makeWrapper(props = {}) {
    return mount(AppApplicationNavHorizontalOverflowContent, {
        propsData: {
            isLoading: false,
            ...props,
        },
        store: storeMocks.store,
    });
}

beforeEach(() => {
    storeMocks = createStoreMocks();
    localStorageMock.clear();
});

describe('AppApplicationNavHorizontalOverflowContent', () => {
    test('It should render a `<div>`.', () => {
        localStorageMock.setItem('test', 'foo');

        const wrapper = makeWrapper({ application: { ...mockApplication } });

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should show the invited infobox when the status is invited.', () => {
        const wrapper = makeWrapper({ application: { status: STATUS.invited } });

        expect(wrapper.find('[data-qa="invited info"]').exists()).toBe(true);
    });

    test('It should show the invited infobox when the status is invited and no application message exists.', () => {
        const wrapper = makeWrapper({
            application: {
                message: null,
                status: STATUS.invited,
            },
        });

        expect(wrapper.find('[data-qa="invited info"]').exists()).toBe(true);
    });

    test('It should show the confirmed infobox when the status is confirmed.', () => {
        const wrapper = makeWrapper({ application: { status: STATUS.confirmed } });

        expect(wrapper.find('[data-qa="confirmed info"]').exists()).toBe(true);
    });

    test('It should show the confirmed infobox when the status is confirmed and no application message exists.', () => {
        const wrapper = makeWrapper({
            application: {
                message: null,
                status: STATUS.confirmed,
            },
        });

        expect(wrapper.find('[data-qa="confirmed info"]').exists()).toBe(true);
    });

    describe('Action Boxes', () => {
        test('It should render the invited action box when the user has applied at least three days ago.', () => {
            const wrapper = makeWrapper({
                application: {
                    ...mockApplication,
                    status: STATUS.applied,
                },
            });

            expect(wrapper.find('[data-qa="action box invited"]').exists()).toBe(true);
        });

        test('It should not render the invited action box when the user has applied less than three days ago.', () => {
            const wrapper = makeWrapper({
                application: {
                    ...mockApplication,
                    createDate: makeDateModel(Date.now()).format(formatIsoPhp),
                    status: STATUS.applied,
                },
            });

            expect(wrapper.find('[data-qa="action box invited"]').exists()).toBe(false);
        });

        test('It should render the invited action box when the user has applied less than three days ago.', () => {
            const today = new Date().toISOString();
            const wrapper = makeWrapper({ application: { createDate: today } });

            expect(wrapper.find('[data-qa="action box invited"]').exists()).toBe(false);
        });

        test('It should render the no reply action box when the user has already answered the modal'
            + ' with `no-reply`.', async () => {
            localStorage.setItem('applications-no-invitation-no-reply', JSON.stringify(['12345']));

            const wrapper = makeWrapper({
                application: {
                    ...mockApplication,
                    status: STATUS.applied,
                },
            });

            expect(wrapper.find('[data-qa="action box invited"]').exists()).toBe(false);
            expect(wrapper.find('[data-qa="action box no reply"]').exists()).toBe(true);
        });
    });
});
