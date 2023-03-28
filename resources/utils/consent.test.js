import {
    CONSENT_GROUPS,
    hasConsent,
    onConsentChange,
} from './consent';
import {
    setCookie,
} from './cookie';

let oneTrustCallbackStack = [];
const OneTrustMock = {
    OnConsentChanged: (callback) => {
        oneTrustCallbackStack.push(callback);
    },
    RejectAll: jest.fn(),
    mockTriggerOnConsentChanged() {
        oneTrustCallbackStack.forEach(callback => callback());
        oneTrustCallbackStack = [];
    },
};

describe('hasConsent', () => {
    test('it should return the status for the given group', () => {
        setCookie({ name: 'OptanonConsent', value: 'geolocation=AT&groups=C0001:1,C0002:1' });

        expect(hasConsent(CONSENT_GROUPS.necessary)).toBe(true);
        expect(hasConsent(CONSENT_GROUPS.performance)).toBe(true);
        expect(hasConsent(CONSENT_GROUPS.marketing)).toBe(false);
    });

    test('it should return a truthy value if no group is given and any group is active', () => {
        setCookie({ name: 'OptanonConsent', value: 'geolocation=AT&groups=C0001:0,C0002:1' });

        expect(hasConsent()).toBe(true);
    });
});

describe('onConsentChange', () => {
    test('it should trigger the given callback when the consent changes', () => {
        const mockFunction = jest.fn();
        onConsentChange(mockFunction);
        window.OneTrust = OneTrustMock;
        OneTrustMock.mockTriggerOnConsentChanged();

        expect(mockFunction).toBeCalled();

        window.OneTrust = undefined;
    });
});
