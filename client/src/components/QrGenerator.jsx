// src/components/QrGenerator.jsx
import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import QRCode from "react-qr-code";
import QrCodeDisplay from './QrCodeDisplay';
import QrCodeActions from './QrCodeActions';
import {
    sanitizeFilename,
    convertQrSvgToPngBlob
    // Removed convertQrSvgToPngDataUrl
} from '../utils/qrUtils';
import './QrGenerator.css'; // Import its CSS
import './QrModal.css'; // Import modal CSS

// Define QR sizes used in this component
const LIST_QR_CODE_SIZE = 128;
const MODAL_QR_CODE_SIZE = Math.min(window.innerWidth * 0.7, window.innerHeight * 0.6, 512);


function QrGenerator() {
    const [inputText, setInputText] = useState('');
    const [linesToProcess, setLinesToProcess] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContentText, setModalContentText] = useState(null);

    // Ref for the QR code container INSIDE the modal
    const modalQrCodeRef = useRef(null);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleGenerateClick = () => {
        // console.log('--- handleGenerateClick START ---');
        // console.log('Input Text:', inputText);

        const lines = inputText.split('\n')
                           .map(line => line.trim())
                           .filter(line => line);

        // console.log('Lines to process:', lines);
        // console.log(`Found ${lines.length} lines.`);

        // Update the list state - this triggers the re-render
        setLinesToProcess(lines);

        // Do NOT update modal state here - prevents double render issues
        // setModalIsOpen(false);
        // setModalContentText(null);

        // console.log('--- handleGenerateClick END (only setLinesToProcess called) ---');
    };

    const openQrModal = (text) => {
        setModalContentText(text); // Set text for the modal
        setModalIsOpen(true);      // Open the modal
    };

    const closeModal = () => {
        setModalIsOpen(false);
        // Optionally delay clearing text to prevent content flash during close animation
        // setTimeout(() => setModalContentText(null), 300); // Match modal close transition time
        setModalContentText(null); // Clear immediately if no animation
    };

    // --- Action handlers specific to the MODAL context ---
    // These use modalContentText and modalQrCodeRef
    const handleModalCopyText = async () => {
         if (!modalContentText) throw new Error("No text in modal to copy.");
         await navigator.clipboard.writeText(modalContentText);
    };

    const handleModalCopyImage = async () => {
         if (!modalQrCodeRef.current) throw new Error("Modal QR Code Ref missing.");
         const blob = await convertQrSvgToPngBlob(modalQrCodeRef, MODAL_QR_CODE_SIZE); // Use modal size
         if (!navigator.clipboard || !navigator.clipboard.write || typeof ClipboardItem === "undefined") {
              throw new Error('Modern Clipboard API for images not supported.');
          }
         await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    };

    const handleModalDownloadImage = async () => { // Make async
         if (!modalQrCodeRef.current) throw new Error("Modal QR Code Ref missing.");
         try {
             const blob = await convertQrSvgToPngBlob(modalQrCodeRef, MODAL_QR_CODE_SIZE); // Use modal size
             const pngUrl = URL.createObjectURL(blob);
             const downloadLink = document.createElement('a');
             downloadLink.href = pngUrl;
             downloadLink.download = `${sanitizeFilename(modalContentText || 'qrcode')}_qrcode.png`;
             document.body.appendChild(downloadLink);
             downloadLink.click();
             document.body.removeChild(downloadLink);
             URL.revokeObjectURL(pngUrl);
         } catch (error) {
             console.error("Modal download failed:", error);
             // Re-throw error for QrCodeActions to display
             throw new Error(`Modal download failed: ${error.message}`);
         }
    };


    return (
        <div className="qr-generator-container">
             <h2>QR Code Batch Generator</h2>
            <label htmlFor="qrInputText">Enter Text to Encode (one per line):</label>
            <textarea
                id="qrInputText"
                value={inputText}
                onChange={handleInputChange}
                placeholder="e.g.,
https://www.google.com
Your Text Here
Another line"
                rows={6}
            />
            <button onClick={handleGenerateClick} className="generate-button">
                Generate QR Codes
            </button>

            {/* {console.log(`Rendering output area. linesToProcess count: ${linesToProcess.length}`)} */}
            <div className="output-area">
                 {/* Map over the lines state and render a QrCodeDisplay for each */}
                 {linesToProcess.map((line, index) => (
                     <QrCodeDisplay
                         key={`${line}-${index}`} // Use combined key for better stability if lines aren't unique
                         // key={index} // Or use index if list is always fully replaced
                         text={line}
                         size={LIST_QR_CODE_SIZE} // Pass list size
                         onQrClick={openQrModal}    // Pass modal open handler
                     />
                 ))}
             </div>

            {/* --- The Single Modal --- */}
            {/* Render modal using state */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Large QR Code View"
                className="qr-modal" // Class for styling modal window
                overlayClassName="qr-modal-overlay" // Class for styling overlay
            >
                {/* Ensure content only renders when text is available */}
                {modalContentText && (
                    <div className="qr-modal-content">
                        <button onClick={closeModal} className="qr-modal-close-button" title="Close">×</button>
                        <p className="qrcode-header">
                            --- QR Code for: <span>{modalContentText}</span> ---
                        </p>
                        {/* Container div needs the ref for modal's actions */}
                        <div ref={modalQrCodeRef} className="qrcode-container modal-qr-container">
                             <QRCode
                                 value={modalContentText}
                                 size={MODAL_QR_CODE_SIZE} // Use modal size
                                 level={"H"}
                                 bgColor={"#FFFFFF"}
                                 fgColor={"#000000"}
                             />
                         </div>
                         {/* Render the reusable actions component INSIDE modal */}
                         <QrCodeActions
                             text={modalContentText}
                             onCopyText={handleModalCopyText}       // Pass modal-specific handler
                             onCopyImage={handleModalCopyImage}      // Pass modal-specific handler
                             onDownloadImage={handleModalDownloadImage} // Pass modal-specific handler
                         />
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default QrGenerator;