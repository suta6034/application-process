import {
    computed,
    ref,
} from 'vue';

export const STATES = {
    isInitial: 'isInitial',
    isInquired: 'isInquired',
    isApproved: 'isApproved',
};

export const doubleCheckEvents = ['approve', 'inquire', 'reset', 'decline'];

export function useDoubleCheck({ emit }) {
    const state = ref(STATES.isInitial);
    const approve = () => {
        emit('approve');
        state.value = STATES.isApproved;
    };
    const inquire = () => {
        emit('inquire');
        state.value = STATES.isInquired;
    };
    const reset = () => {
        emit('reset');
        state.value = STATES.isInitial;
    };
    const decline = () => {
        emit('decline');
        state.value = STATES.isInitial;
    };
    const isInquiring = computed(() => STATES.isInquired === state.value);

    return {
        STATES,
        approve,
        decline,
        inquire,
        reset,
        isInquiring,
        state,
    };
}
