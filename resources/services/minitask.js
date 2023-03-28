import * as logger from '../utils/logger';

function minitasksDataModelFactory(uuid) {
    return {
        meta: {
            uuid,
            skipped: null,
        },
        data: {
            birthdate: null,
            mobile: null,
            image: null,
            address: null,
            desiredJobEmploymentType: null,
            desiredJobJobfield: null,
            desiredJobTravelReadiness: null,
            desiredJobWorkFromHome: null,
            language: null,
            work: null,
            jobTitle: null,
            jobField: null,
            softSkills: null,
            visibility: null,
        },
    };
}

const storage = {
    get() {
        try {
            const minitasks = localStorage.getItem('minitasks');
            if (minitasks) return JSON.parse(minitasks);
        } catch (exception) {
            /* istanbul ignore next */
            logger.warning({
                exception,
                message: 'Failed to read minitasks from local storage.',
            });
        }
        return null;
    },

    set(data) {
        try {
            localStorage.setItem('minitasks', JSON.stringify(data));
        } catch (exception) {
            /* istanbul ignore next */
            logger.warning({
                exception,
                message: 'Failed to write minitasks to local storage.',
            });
        }
    },

    clear() {
        try {
            localStorage.removeItem('minitasks');
        } catch (exception) {
            /* istanbul ignore next */
            logger.warning({
                exception,
                message: 'Failed to clear minitasks from local storage.',
            });
        }
    },
};

function checkSkipStatus() {
    const minitasks = storage.get();
    if (minitasks && minitasks.meta.skipped) {
        const skipDate = new Date(minitasks.meta.skipped);
        skipDate.setDate(skipDate.getDate() + 14);

        return skipDate > new Date();
    }

    return null;
}

function setUuidInLocalStorage(uuid) {
    const minitasks = storage.get();
    if (minitasks && minitasks.meta.uuid !== uuid) {
        storage.clear();
    }

    if (!storage.get()) {
        storage.set(minitasksDataModelFactory(uuid));
    }
}

export function getMinitasks(uuid) {
    setUuidInLocalStorage(uuid);

    if (!checkSkipStatus()) {
        storage.clear();
        setUuidInLocalStorage(uuid);
    }

    return storage.get();
}

export function setMinitaskSkipped(minitask, value) {
    const minitasks = storage.get();
    if (!minitasks) {
        return;
    }
    if (!minitasks.meta.skipped) minitasks.meta.skipped = value;
    minitasks.data[minitask] = minitasks.meta.skipped;
    storage.set(minitasks);
}
