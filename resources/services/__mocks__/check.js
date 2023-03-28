let hasProfile = true;
let hasUser = true;

// eslint-disable-next-line no-underscore-dangle
export const __setCheckData = (data) => {
    // eslint-disable-next-line prefer-destructuring
    hasProfile = data.hasProfile;
    // eslint-disable-next-line prefer-destructuring
    hasUser = data.hasUser;
};

export const checkUserByEmail = jest.fn().mockImplementation(() => Promise.resolve({
    data: {
        meta: {
            hasProfile,
            hasUser,
        },
    },
}));
