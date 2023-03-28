export function useCvPills() {
    function addMorePill(pillsArray, maxElements) {
        const moreLabel = `+ ${pillsArray.length - maxElements}`;
        // eslint-disable-next-line no-param-reassign
        pillsArray = pillsArray.slice(0, maxElements);
        pillsArray.push({
            id: 0,
            label: moreLabel,
            qa: 'more pill',
        });
        return pillsArray;
    }

    function prepareLevelPillsArray(dataArray, maxElements) {
        const preparedData = dataArray.map((data) => {
            const pill = {
                id: data.id,
                label: data.label || data.title || data.name,
                level: data.level.label,
                qa: 'pill',
            };
            return pill;
        });

        if (preparedData.length > maxElements) {
            return addMorePill(preparedData, maxElements);
        }

        return preparedData;
    }

    function preparePillsArray(dataArray, maxElements) {
        const preparedData = dataArray.map((data) => {
            const pill = {
                id: data.id,
                label: data.label || data.title || data.name,
                qa: 'pill',
            };
            return pill;
        });

        if (preparedData.length > maxElements) {
            return addMorePill(preparedData, maxElements);
        }

        return preparedData;
    }

    return {
        prepareLevelPillsArray,
        preparePillsArray,
        addMorePill,
    };
}
