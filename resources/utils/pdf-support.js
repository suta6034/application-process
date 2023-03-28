// from https://github.com/featurist/browser-pdf-support/blob/master/index.js
function getActiveXObject(name) {
    try {
        // eslint-disable-next-line no-undef
        return new ActiveXObject(name);
    } catch (e) {
        return null;
    }
}

function hasAcrobatInstalled() {
    return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl');
}

// Safari can work with PDFs regardless of whether on iOS or macOS
// iPadOS will not report as iPad when in Desktop mode (which is default)
// Checking for "Safari" only would include Chrome and Samsung user agents which is not desired
function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Firefox has pdf.js support
// from https://github.com/mozilla/pdf.js
function isFirefox() {
    return /Firefox/.test(navigator.userAgent);
}

export function hasPdfSupport() {
    return (navigator.mimeTypes && navigator.mimeTypes['application/pdf'])
        || hasAcrobatInstalled() || isIos() || isFirefox();
}
