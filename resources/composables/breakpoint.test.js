import {
    LARGE_DEVICE, SMALL_DEVICE, MEDIUM_DEVICE,
} from '../../tests/app/jest-setup';
import {
    useBreakpoints,
} from './breakpoint';

describe('breakpoint', () => {
    test('It should detect a mobile device.', () => {
        global.innerWidth = SMALL_DEVICE;
        const {
            isMobile,
            isMediumScreen,
            isLargeScreen,
        } = useBreakpoints();
        expect(isMobile.value).toBe(true);
        expect(isMediumScreen.value).toBe(false);
        expect(isLargeScreen.value).toBe(false);
    });

    test('It should detect a medium device.', () => {
        global.innerWidth = MEDIUM_DEVICE;
        const {
            isMobile,
            isMediumScreen,
            isLargeScreen,
        } = useBreakpoints();
        expect(isMobile.value).toBe(false);
        expect(isMediumScreen.value).toBe(true);
        expect(isLargeScreen.value).toBe(false);
    });

    test('It should detect a large device.', () => {
        global.innerWidth = LARGE_DEVICE;
        const {
            isMobile,
            isMediumScreen,
            isLargeScreen,
        } = useBreakpoints();
        expect(isMobile.value).toBe(false);
        expect(isMediumScreen.value).toBe(true);
        expect(isLargeScreen.value).toBe(true);
    });
});
