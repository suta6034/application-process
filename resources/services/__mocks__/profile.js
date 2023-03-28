const defaultProfileCreateReturn = {
    data: {
        data: {
            attributes: {
                basics: {},
                desiredJob: {},
                educations: [],
                flags: { isActive: true },
                languages: [],
                motivation: [],
                profileText: '',
                skills: [],
                softSkills: [],
                statement: '',
                work: [],
            },
        },
    },
};
const defaultProfileGetReturn = {
    data: {
        data: {
            attributes: {
                basics: {},
                desiredJob: {},
                educations: [],
                flags: { isActive: true },
                languages: [],
                motivation: [],
                profileText: '',
                skills: [],
                softSkills: [],
                statement: '',
                work: [],
            },
        },
    },
};
const cutomReturnData = {
    profileCreate: undefined,
    profileGet: undefined,
};

// eslint-disable-next-line no-underscore-dangle
export function __setProfileCreateReturn(data) {
    cutomReturnData.profileCreate = data;
}

// eslint-disable-next-line no-underscore-dangle
export function __setProfileGetReturn(data) {
    cutomReturnData.profileGet = data;
}

export function profileCreate() {
    const returnValue = cutomReturnData.profileCreate !== undefined
        ? cutomReturnData.profileCreate
        : defaultProfileCreateReturn;

    if (cutomReturnData.profileCreate instanceof Error) {
        return Promise.reject(cutomReturnData.profileCreate);
    }

    return Promise.resolve(returnValue);
}

export function profileGet() {
    const returnValue = cutomReturnData.profileGet !== undefined
        ? cutomReturnData.profileGet
        : defaultProfileGetReturn;

    if (cutomReturnData.profileGet instanceof Error) {
        return Promise.reject(cutomReturnData.profileGet);
    }

    return Promise.resolve(returnValue);
}

export const updateProfileMeta = jest.fn().mockImplementation(() => Promise.resolve({
    data: {
        meta: {
            success: true,
        },
    },
}));
