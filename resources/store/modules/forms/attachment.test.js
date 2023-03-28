import attachment from './attachment';

describe('attachment', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof attachment.mutations.updateField).toBe('function');
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                attachment.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        'create-date': '2018-08-03T08:04:46+0200',
                        mimetype: 'image/jpeg',
                        name: 'img-0128.JPG',
                        size: 1348797,
                        url: '/user/1a1274a2-fa0c-520d-880e-f6bbd2e02c24/file/b5a05352-1618-5f7c-bf14-fc9bf0654ad2',
                        uuid: 'b5a05352-1618-5f7c-bf14-fc9bf0654ad2',
                        version: null,
                    },
                    {
                        'create-date': '2018-08-03T08:04:46+0200',
                        mimetype: 'image/jpeg',
                        name: 'img-0127.JPG',
                        size: 1348797,
                        url: '/user/1a1274a2-fa0c-520d-880e-f6bbd2e02c24/file/a5a05352-1618-5f7c-bf14-fc9bf0654ad1',
                        uuid: 'a5a05352-1618-5f7c-bf14-fc9bf0654ad1',
                        version: null,
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        deletable: true,
                        icon: 'file-image',
                        name: 'img-0128.JPG',
                        progress: null,
                        url: '/user/1a1274a2-fa0c-520d-880e-f6bbd2e02c24/file/b5a05352-1618-5f7c-bf14-fc9bf0654ad2',
                        uuid: 'b5a05352-1618-5f7c-bf14-fc9bf0654ad2',
                        size: 1348797,
                    },
                    {
                        deletable: true,
                        icon: 'file-image',
                        name: 'img-0127.JPG',
                        progress: null,
                        url: '/user/1a1274a2-fa0c-520d-880e-f6bbd2e02c24/file/a5a05352-1618-5f7c-bf14-fc9bf0654ad1',
                        uuid: 'a5a05352-1618-5f7c-bf14-fc9bf0654ad1',
                        size: 1348797,
                    },
                ]);
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof attachment.getters.getField).toBe('function');
        });

        describe('count()', () => {
            test('It should return the attachment count.', () => {
                const mockState = {
                    rows: [
                        {
                            uuid: 'b5a05352-1618-5f7c-bf14-fc9bf0654ad2',
                        },
                        {
                            uuid: 'a5a05352-1618-5f7c-bf14-fc9bf0654ad1',
                        },
                    ],
                };

                expect(attachment.getters.count(mockState)).toBe(2);
            });
        });
    });
});
