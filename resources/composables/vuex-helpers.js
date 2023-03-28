import {
    computed, unref,
} from 'vue';
import {
    createNamespacedHelpers,
} from 'vuex';
import store from '../store';

export function useState(namespace) {
    // Get every existing key at the namespaced state
    const exploded = namespace.split('/');
    const travelToProperty = (object, propertyChain) => {
        if (!propertyChain.length) return object;
        return travelToProperty(object[propertyChain[0]], propertyChain.slice(1));
    };
    const keysInNamespace = travelToProperty(store.state, exploded);

    // Create reactive mapped state of all keys via vuex helpers
    const { mapState } = createNamespacedHelpers(namespace);
    const mappedState = mapState(Object.keys(keysInNamespace));

    // Return an object that can be consumed by components via destructuring
    return Object.keys(mappedState).reduce((acc, key) => ({
        ...acc,
        [key]: computed({
            get: mappedState[key],
            set: value => store.commit(`${namespace}/updateField`, {
                path: key,
                value,
            }),
        }),
    }), {});
}

/* Return object keys prefixed with "namespace" */
export function getKeysInNamespace({ namespace = '', object }) {
    // Root level
    if (!namespace) {
        return Object.keys(object).filter(key => key.indexOf('/') === -1);
    }
    // Namespaced
    return Object.keys(object)
        .filter(key => key.startsWith(`${namespace}/`)
            && (key.split('/').length - 1 === namespace.split('/').length))
        .map(key => key.slice(namespace.length + 1));
}

export function useGetters(namespace) {
    // Get every getter in namespace
    const getterKeysInNamespace = getKeysInNamespace({
        namespace,
        object: store.getters,
    });

    // Create reactive mapped getters of relevant keys via vuex helpers
    const { mapGetters } = createNamespacedHelpers(namespace);
    const mappedGetters = mapGetters(getterKeysInNamespace);

    // Return an object that can be consumed by components via destructuring
    return getterKeysInNamespace.reduce((acc, key) => ({
        ...acc,
        [key]: computed(mappedGetters[key]),
    }), {});
}

export function useMutations(namespace) {
    // Get every mutation in namespace
    const mutationKeysInNamespace = getKeysInNamespace({
        namespace,
        object: store._mutations, // eslint-disable-line no-underscore-dangle
    });

    // Return an object that can be consumed by components via destructuring
    return mutationKeysInNamespace.reduce((acc, key) => ({
        ...acc,
        // Create mapped mutations of relevant keys manually, because vuex helper relies on this.$store
        [key]: payload => store.commit(`${namespace}/${key}`, payload),
    }), {});
}

export function useActions(namespace) {
    // Get every action in namespace
    const actionKeysInNamespace = getKeysInNamespace({
        namespace,
        object: store._actions, // eslint-disable-line no-underscore-dangle
    });

    // Return an object that can be consumed by components via destructuring
    return actionKeysInNamespace.reduce((acc, key) => ({
        ...acc,
        // Create mapped actions of relevant keys manually, because vuex helper relies on this.$store
        [key]: async payload => store.dispatch(`${namespace}/${key}`, payload),
    }), {});
}

/* Return keys of an object in the store as writable computed properties */
// eslint-disable-next-line arrow-body-style
export const useComputedObjectProperties = ({ updateField, object }) => {
    return Object.keys(unref(object)).reduce((acc, key) => ({
        ...acc,
        [key]: computed({
            get: () => object.value[key],
            set: value => updateField({
                path: `rows[0].${key}`,
                value,
            }),
        }),
    }), {});
};

/* Given an array of objects and an id X to look for, returns writable computed properties
   for all properties in the object with id X, usable for example for everything "row"-related in the store */
export const useComputedRowObjectProperties = ({ updateField, objects, indexId }) => {
    let rowIndex = objects.value.findIndex(({ id }) => id === indexId);
    if (rowIndex === -1) rowIndex = objects.value.length - 1;

    return Object.keys(unref(objects)[rowIndex]).reduce((acc, key) => ({
        ...acc,
        [key]: computed({
            get: () => objects.value[rowIndex][key],
            set: value => updateField({
                path: `rows[${rowIndex}].${key}`,
                value,
            }),
        }),
    }), {});
};
