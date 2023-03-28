/* istanbul ignore file */
/**
 * @typedef {Object} CompressImageOptions
 * @property {number} [maxHeight]
 * @property {number} [maxWidth]
 * @property {number} [quality]
 */

/**
 * Compress images before uploading them to the server.
 *
 * @param {File} image
 * @param {CompressImageOptions} [options]
 * @return {Promise<Blob>}
 */
export async function compressImage(image, {
    maxHeight = 1920,
    maxWidth = 1920,
    quality = 0.7,
} = {}) {
    const Compressor = (await import('compressorjs')).default;

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-new
        new Compressor(image, {
            maxHeight,
            maxWidth,
            // Always convert .png files to .jpg.
            convertSize: 0,
            quality,
            success(result) {
                resolve(result);
            },
            error(error) {
                reject(error);
            },
        });
    });
}
