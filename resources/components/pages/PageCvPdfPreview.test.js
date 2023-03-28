import {
    shallowMount,
} from '../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store/index';
import * as CvFileService from '../../services/cv-file';
import {
    commitAndShowModal,
} from '../../utils/error';

import PageCvPdfPreview from './PageCvPdfPreview';

jest.mock('../../services/cv-file', () => ({
    fetchAvailability: jest.fn(),
}));
jest.mock('../../store');
jest.mock('../../utils/error');

let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
});

describe('CardCvAction', () => {
    function wrapperFactory() {
        return shallowMount(PageCvPdfPreview, {
            store: storeMocks.store,
        });
    }

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    describe('CV File', () => {
        test('It should open the error modal if the cv file pdf can not be displayed.', async () => {
            wrapperFactory();

            await CvFileService.fetchAvailability.mockResolvedValue(false);

            expect(commitAndShowModal).toBeCalled();
        });
    });
});
