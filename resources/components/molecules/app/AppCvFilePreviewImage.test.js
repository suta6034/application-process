import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppCvFilePreviewImage from './AppCvFilePreviewImage';

describe('AppCvFilePreviewImage', () => {
    function wrapperFactory({ propsData } = {}) {
        return mount(AppCvFilePreviewImage, {
            propsData: {
                settings: {
                    key: 'ladder',
                    label: 'Balken',
                    colors: [
                        {
                            id: 'gre',
                            label: 'Schwarz',
                            hex: '#333333',
                            default: true,
                        },
                    ],
                    fonts: [
                        {
                            id: 'not-not',
                            label: 'Schlicht',
                            default: true,
                        },
                        {
                            id: 'lor-pts',
                            label: 'Elegant',
                        },
                    ],
                },
                currentSettings: {
                    template: 'vegan',
                    color: 'win',
                    font: 'not-not',
                },
                isThumbnail: false,
                ...propsData,
            },
        });
    }

    test('It should render a `<img>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('img')).toBe(true);
    });
});
