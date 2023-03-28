import {
    computed,
    toRefs,
} from 'vue';

export const useMessageProperties = (message, conversation) => {
    const { messages } = toRefs(conversation);

    const indexInConversation = computed(() => messages.value
        .findIndex(msg => msg.id === message.id));
    const isUserMessage = computed(() => message.sender.type === 'user' && message.body);

    const isFirstReply = computed(() => indexInConversation.value === 0
        || (message.sender.type !== messages.value[indexInConversation.value - 1]?.sender.type));

    // eslint-disable-next-line max-len
    const isMessageGroup = computed(() => message.sender.type === messages.value[indexInConversation.value + 1]?.sender.type
        || message.sender.type === messages.value[indexInConversation.value - 1]?.sender.type);

    const isFirstInGroup = computed(() => isMessageGroup.value && (indexInConversation.value === 0
        || (message.sender.type !== messages.value[indexInConversation.value - 1]?.sender.type)));

    const isLastInGroup = computed(() => isMessageGroup.value
        && (message.sender.type !== messages.value[indexInConversation.value + 1]?.sender.type));

    const isMiddleInGroup = computed(() => isMessageGroup.value
        && (message.sender.type === messages.value[indexInConversation.value + 1]?.sender.type
            && message.sender.type === messages.value[indexInConversation.value - 1]?.sender.type));

    return {
        indexInConversation,
        isUserMessage,
        isFirstReply,
        isMessageGroup,
        isFirstInGroup,
        isLastInGroup,
        isMiddleInGroup,
    };
};
