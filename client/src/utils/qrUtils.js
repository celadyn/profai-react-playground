// src/utils/qrUtils.js

// Sanitizes text for use in filenames
export function sanitizeFilename(text) {
    if (typeof text !== 'string') return 'invalid-filename'; // Basic type check
    return text.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_').substring(0, 50);
}

// Converts the SVG element found within qrSvgContainerRef to a PNG Blob
// Throws an error if conversion fails.
export async function convertQrSvgToPngBlob(qrSvgContainerRef, size) {
    if (!qrSvgContainerRef?.current) {
        throw new Error('QR Code container ref is not valid.');
    }
    const svgElement = qrSvgContainerRef.current.querySelector('svg');
    if (!svgElement) {
        throw new Error('QR SVG element not found inside container.');
    }
    if (typeof size !== 'number' || size <= 0) {
        throw new Error(`Invalid size provided for PNG conversion: ${size}`);
    }

    try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        img.width = size;
        img.height = size;

        const imagePromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            // Provide more specific error info if possible
            img.onerror = (errEvent) => reject(new Error(`Image loading failed during SVG conversion: ${errEvent?.type || 'unknown error'}`));
        });

        // Use unescape + encodeURIComponent for better character handling than btoa alone
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

        const loadedImage = await imagePromise;

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        ctx.fillStyle = '#FFFFFF'; // White background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(loadedImage, 0, 0, size, size);

        const blob = await new Promise((resolve, reject) => {
            // Add error handling for toBlob
            try {
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas toBlob resulted in null.'));
                    }
                }, 'image/png');
            } catch (e) {
                reject(new Error(`Canvas toBlob failed: ${e.message}`));
            }
        });

        return blob;

    } catch (error) {
        // Rethrow or wrap the error for clarity
        console.error("SVG to PNG Blob conversion failed:", error); // Log the error too
        throw new Error(`SVG to PNG Blob conversion failed: ${error.message}`);
    }
}

// Converts Blob to Data URL - useful if needed after getting blob
// export async function convertBlobToDataURL(blob) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//     });
// }