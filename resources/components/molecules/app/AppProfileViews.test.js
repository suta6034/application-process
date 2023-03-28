import {
    createLocalVue,
} from '@vue/test-utils';
import Vuex from 'vuex';

import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppProfileViews from './AppProfileViews';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('AppProfileViews', () => {
    let profileState;
    let store;

    function wrapperFactory({ propsData } = {}) {
        return mount(AppProfileViews, {
            localVue,
            propsData: {
                isLoading: true,
                ...propsData,
            },
            store,
        });
    }

    beforeEach(() => {
        profileState = {
            active: false,
        };

        store = new Vuex.Store({
            modules: {
                profile: {
                    state: profileState,
                    namespaced: true,
                },
            },
        });
    });

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render a skeleton view if the loading property is true.', () => {
        const wrapper = wrapperFactory({
            propsData: {
                isLoading: true,
            },
        });

        expect(wrapper.findAll('[data-qa="skeleton box"]').length).toBe(4);
    });

    test('It should render the given company views.', () => {
        const wrapper = wrapperFactory({
            propsData: {
                isLoading: false,
                profileViews: [
                    {
                        type: 'profileView',
                        id: 'e2dccbcb-04bf-5714-8a04-105f48416acf',
                        company: {
                            name: 'Foo',
                            logoSquare: 'http://foo/bar.companysquare.gif',
                        },
                    },
                    {
                        type: 'profileView',
                        id: 'e2dccbcb-04bf-5714-8a04-105f48416acb',
                        company: {
                            name: 'Foo',
                            logoSquare: 'http://foo/bar.companysquare.gif',
                        },
                    },
                ],
            },
        });

        expect(wrapper.findAll('[data-qa="company logo"]').length).toBe(2);
    });

    test('It should render the additional company profile views counter.', () => {
        const wrapper = wrapperFactory({
            propsData: {
                total: 4,
                isLoading: false,
                profileViews: [
                    {
                        type: 'profileView',
                        id: 'e2dccbcb-04bf-5714-8a04-105f48416acf',
                        company: {
                            name: 'Foo',
                            logo: 'http://foo/bar.companysquare.gif',
                        },
                    },
                    {
                        type: 'profileView',
                        id: 'e2dccbcb-04bf-5714-8a04-105f48416acb',
                        company: {
                            name: 'Foo',
                            logo: 'http://foo/bar.companysquare.gif',
                        },
                    },
                    {
                        type: 'profileView',
                        id: 'e2dccbcb-04bf-5714-8a04-105f48416acw',
                        company: {
                            name: 'Foo',
                            logo: 'http://foo/bar.companysquare.gif',
                        },
                    },
                ],
            },
        });

        expect(wrapper.find('[data-qa="additional profile views counter"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="additional profile views counter"]').text()).toBe('+1');
    });

    describe('profile is active and has profile views', () => {
        test('It should render the active has profile views text.', () => {
            profileState.active = true;
            const wrapper = wrapperFactory({
                propsData: {
                    profileViews: [
                        {
                            type: 'profileView',
                            id: 'e2dccbcb-04bf-5714-8a04-105f48416acf',
                            company: {
                                name: 'Foo',
                                logo: 'http://foo/bar.companysquare.gif',
                            },
                        },
                    ],
                },
            });

            expect(wrapper.find('[data-qa="active has profile views text"]').exists()).toBe(true);
        });
    });

    describe('profile is inactive and has profile views', () => {
        test('It should render the inactive has profile views text.', () => {
            const wrapper = wrapperFactory({
                propsData: {
                    profileViews: [
                        {
                            type: 'profileView',
                            id: 'e2dccbcb-04bf-5714-8a04-105f48416acf',
                            company: {
                                name: 'Foo',
                                logo: 'http://foo/bar.companysquare.gif',
                            },
                        },
                        {
                            type: 'profileView',
                            id: 'e2dccbcb-04bf-5714-8a04-105f48416acb',
                            company: {
                                name: 'Foo',
                                logo: 'http://foo/bar.companysquare.gif',
                            },
                        },
                    ],
                },
            });

            expect(wrapper.find('[data-qa="inactive has profile views text"]').exists()).toBe(true);
        });
    });

    describe('profile is inactive and has no profile views', () => {
        test('It should render empty state.', () => {
            const wrapper = wrapperFactory({
                propsData: {
                    isLoading: false,
                },
            });

            expect(wrapper.find('[data-qa="empty state"]').exists()).toBe(true);
        });

        test('It should render the inactive has no profile views text.', () => {
            const wrapper = wrapperFactory({
                propsData: {
                    isLoading: false,
                },
            });

            expect(wrapper.find('[data-qa="inactive has no profile views text"]').exists()).toBe(true);
        });
    });

    describe('profile is active and has no profile views', () => {
        test('It should render the active has no profile views text.', () => {
            profileState.active = true;
            const wrapper = wrapperFactory();

            expect(wrapper.find('[data-qa="active has no profile views text"]').exists()).toBe(true);
        });
    });
});
