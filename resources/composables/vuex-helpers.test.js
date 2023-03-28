import {
    useState,
    useGetters,
    useMutations,
    useActions, getKeysInNamespace,
} from './vuex-helpers';
import {
    __createMocks as createStoreMocks,
} from '../store/__mocks__';
import {
    shallowMount,
} from '../../tests/app/vue/utils';

const storeMocks = createStoreMocks();

function makeWrapper(options) {
    return shallowMount({}, {
        store: storeMocks.store,
        render: h => h('div'),
        ...options,
    });
}

describe('getKeysInNamespace', () => {
    test('It should correctly extract getters from namespaces.', () => {
        const getters = {
            toplevelgetter: null,
            'namespace/getter1': null,
            'namespace/getter2': null,
            'namespace/getter3': null,
            'namespace/furtherdown/getter4': null,
            'namespace/furtherdown/getter5': null,
        };
        const toplevel = getKeysInNamespace({ object: getters });
        expect(toplevel.length).toBe(1);
        expect(toplevel).toStrictEqual(['toplevelgetter']);

        const namespaced = getKeysInNamespace({ namespace: 'namespace', object: getters });
        expect(namespaced.length).toBe(3);
        expect(namespaced).toStrictEqual(['getter1', 'getter2', 'getter3']);

        const furtherdown = getKeysInNamespace({ namespace: 'namespace/furtherdown', object: getters });
        expect(furtherdown.length).toBe(2);
        expect(furtherdown).toStrictEqual(['getter4', 'getter5']);
    });
});

describe('useState', () => {
    test('It should be able to access namespaced state.', () => {
        const wrapper = makeWrapper({
            setup() {
                const { boosterCounter, active, educationCategories } = useState('profile');
                return { boosterCounter, active, educationCategories };
            },
        });
        expect(wrapper.vm.boosterCounter).toBe(0);
        expect(wrapper.vm.active).toBe(false);
        expect(wrapper.vm.educationCategories).toStrictEqual([]);
    });
});

describe('useGetters', () => {
    test('It should be able to access namespaced getters.', () => {
        const wrapper = makeWrapper({
            setup() {
                const { imageVersion } = useGetters('profile');
                return { imageVersion };
            },
        });
        expect(wrapper.vm.imageVersion).not.toBe(undefined);
    });
});

describe('useMutations', () => {
    test('It should be able to access namespaced mutations.', () => {
        const wrapper = makeWrapper({
            setup() {
                const { HIDE_POPUP } = useMutations('popup');
                const { UPDATE_FROM_QUERY } = useMutations('profile/attachment');
                return { HIDE_POPUP, UPDATE_FROM_QUERY };
            },
        });
        expect(wrapper.vm.HIDE_POPUP).not.toBe(undefined);
        expect(wrapper.vm.UPDATE_FROM_QUERY).not.toBe(undefined);
    });
});

describe('useActions', () => {
    test('It should be able to access namespaced actions.', () => {
        const wrapper = makeWrapper({
            setup() {
                const { FETCH_MINITASKS } = useActions('minitask');
                const { FETCH_USER } = useActions('user');
                return { FETCH_MINITASKS, FETCH_USER };
            },
        });
        expect(wrapper.vm.FETCH_MINITASKS).not.toBe(undefined);
        expect(wrapper.vm.FETCH_USER).not.toBe(undefined);
    });

    test('It should return async functions.', () => {
        const wrapper = makeWrapper({
            setup() {
                const { FETCH_MINITASKS } = useActions('minitask');
                return { FETCH_MINITASKS };
            },
        });
        expect(wrapper.vm.FETCH_MINITASKS.constructor.name).toBe('AsyncFunction');
    });
});
