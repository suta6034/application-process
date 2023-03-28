let uniqueId = 0;

// A composable that allows components to obtain a unique id, at least as long as no one uses 'uid-x' as id
// It is very basic by design, using uuids or web crypto would be overkill for our purpose
export function useUniqueId() {
    const id = `uid-${uniqueId}`;
    uniqueId += 1;
    return { id };
}
