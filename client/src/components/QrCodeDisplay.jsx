// src/components/QrCodeDisplay.jsx
import React, { useRef } from 'react'; // Removed useState if no longer needed here
import QRCode from "react-qr-code";
import QrCodeActions from './QrCodeActions';
import {
    sanitizeFilename,
    convertQrSvgToPngBlob
    // Removed convertQrSvgToPngDataUrl if only using Blob method
} from '../utils/qrUtils';
import './QrCodeDisplay.css'; // Import its CSS

// Component receives text, size for rendering, and the click handler
function QrCodeDisplay({ text, size, onQrClick }) {
    // console.log(`QrCodeDisplay rendering for text: "${text}"`); // Keep console log commented unless debugging loops

    // Ref for this specific QR Code SVG container
    const qrCodeRef = useRef(null);
    // Error state removed - action errors handled in QrCodeActions

    // --- Action handlers specific to THIS list item's context ---
    // These functions perform the action using this component's ref and props
    const handleListCopyText = async () => {
        if (!text) throw new Error("No text to copy.");
        await navigator.clipboard.writeText(text);
        // Feedback is handled by QrCodeActions button state
    };

    const handleListCopyImage = async () => {
        if (!qrCodeRef.current) throw new Error("QR Code Ref missing.");
        const blob = await convertQrSvgToPngBlob(qrCodeRef, size); // Use size prop
        if (!navigator.clipboard || !navigator.clipboard.write || typeof ClipboardItem === "undefined") {
             throw new Error('Modern Clipboard API for images not supported.');
         }
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        // Feedback is handled by QrCodeActions button state
    };

    const handleListDownloadImage = async () => { // Make async to use await
         if (!qrCodeRef.current) throw new Error("QR Code Ref missing.");
         try {
             const blob = await convertQrSvgToPngBlob(qrCodeRef, size); // Use size prop
             const pngUrl = URL.createObjectURL(blob); // Create temporary URL from Blob
             const downloadLink = document.createElement('a');
             downloadLink.href = pngUrl;
             downloadLink.download = `${sanitizeFilename(text)}_qrcode.png`;
             document.body.appendChild(downloadLink);
             downloadLink.click();
             document.body.removeChild(downloadLink);
             URL.revokeObjectURL(pngUrl); // Clean up the temporary URL after click initiated
             // No explicit success feedback needed here typically
         } catch (error) {
             console.error("List download failed:", error);
             // Re-throw the error so QrCodeActions can catch and display it
             throw new Error(`List download failed: ${error.message}`);
         }
    };

    // --- Click handler for enlarging ---
    const handleQrContainerClick = () => {
        // Call the function passed down from the parent if it exists
        if (onQrClick) {
            onQrClick(text);
        } else {
            console.warn("onQrClick handler not passed to QrCodeDisplay for text:", text);
        }
    };

    // Don't render anything if text is empty/invalid
    if (!text) {
        return null;
    }

    return (
        <div className="qrcode-block">
             <p className="qrcode-header">--- QR Code for: <span>{text}</span> ---</p>
             <div
                 ref={qrCodeRef} // Attach ref to the container
                 className="qrcode-container list-qr-container" // Style as clickable list item
                 onClick={handleQrContainerClick}
                 title="Click to enlarge"
                 role="button" // Accessibility
                 tabIndex={0} // Accessibility
                 onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleQrContainerClick(); }} // Accessibility
             >
                 {/* Render the QR Code */}
                 <QRCode
                     value={text}
                     size={size} // Use size prop
                     level={"H"} // Error correction level
                     bgColor={"#FFFFFF"} // Background color
                     fgColor={"#000000"} // Foreground color
                 />
             </div>
             {/* Render the reusable actions component, passing handlers */}
             <QrCodeActions
                 text={text}
                 onCopyText={handleListCopyText}
                 onCopyImage={handleListCopyImage}
                 onDownloadImage={handleListDownloadImage}
             />
             {/* Error state for QR generation itself could go here if needed */}
        </div>
    );
}

export default QrCodeDisplay;