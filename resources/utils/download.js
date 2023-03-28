/**
 * Trigger a download link.
 */
/* istanbul ignore next */
export function download({ blob, name, path }) {
    const link = document.createElement('a');
    link.download = name;
    link.href = blob ? URL.createObjectURL(blob) : path;
    link.click();
}

/**
 * Assemble and download a ZIP archive.
 */
/* istanbul ignore next */
export async function downloadZip(documents, folderName) {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const folder = zip.folder(folderName);

    await Promise.all(documents.map(({ name, url }) => fetch(url)
        .then(response => response.blob())
        .then(blob => folder.file(name, blob))));

    const blob = await folder.generateAsync({ type: 'blob' });
    download({ blob, name: `${folderName}.zip` });
}
