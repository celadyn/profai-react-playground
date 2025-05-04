// src/components/QrCodeActions.jsx
import React, { useState, useRef } from 'react';
import './QrCodeActions.css'; // Import its CSS

// Local Helper for button feedback state
function showFeedback(buttonRef, originalContent, message, wasSuccess) {
    if (!buttonRef.current) return;
    const button = buttonRef.current;
    // Store current dimensions before changing content
    const currentHeight = `${button.offsetHeight}px`;
    const currentWidth = `${button.offsetWidth}px`;
    button.style.height = currentHeight; // Fix height
    button.style.width = currentWidth;   // Fix width

    button.textContent = message;
    button.disabled = true;
    button.classList.add(wasSuccess ? 'success' : 'error');

    setTimeout(() => {
        if (buttonRef.current) {
            button.textContent = originalContent;
            button.disabled = false;
            button.classList.remove('success', 'error');
            // Reset styles to allow natural size
            button.style.height = '';
            button.style.width = '';
        }
    }, 1500);
}


// Component receives text and action handlers as props
function QrCodeActions({ text, onCopyText, onCopyImage, onDownloadImage }) {
    const [actionErrorMsg, setActionErrorMsg] = useState('');

    // Refs for THESE action buttons
    const copyInputBtnRef = useRef(null);
    const copyImageBtnRef = useRef(null);
    const downloadBtnRef = useRef(null);

    // Wrapper handlers to manage local state (errors, button feedback) and call prop functions
    const handleCopyTextInput = async () => {
        setActionErrorMsg(''); // Clear previous errors
        if (!copyInputBtnRef.current) return;
        const originalContent = copyInputBtnRef.current.textContent; // Get text like '📋'
        try {
            await onCopyText(); // Call the function passed via props
            showFeedback(copyInputBtnRef, originalContent, '✔️', true);
        } catch (error) {
            console.error("Copy Text Action Failed:", error);
            setActionErrorMsg(`Copy text failed: ${error.message}`);
            showFeedback(copyInputBtnRef, originalContent, '❌', false);
        }
    };

    const handleCopyImageOutput = async () => {
        setActionErrorMsg('');
        if (!copyImageBtnRef.current) return;
        const originalContent = copyImageBtnRef.current.textContent; // Get text like '🖼️'
        try {
            await onCopyImage(); // Call the function passed via props
            showFeedback(copyImageBtnRef, originalContent, '✔️', true);
        } catch (error) {
            console.error("Copy Image Action Failed:", error);
            setActionErrorMsg(`Copy image failed: ${error.message}`);
            showFeedback(copyImageBtnRef, originalContent, '❌', false);
        }
    };

    const handleDownloadImageOutput = async () => { // Use async to await the prop if it becomes async
        setActionErrorMsg('');
        if (!downloadBtnRef.current) return;
        // Download doesn't usually need button text feedback, but handle errors
        try {
             await onDownloadImage(); // Call the function passed via props
             // Maybe brief success visual if desired, but browser handles download UI
        } catch (error) {
            console.error("Download Action Failed:", error);
            setActionErrorMsg(`Download failed: ${error.message}`);
            // Could add visual feedback here too if needed
        }
    };


    return (
        <> {/* Use Fragment to group actions and error message */}
            <div className="qrcode-actions">
                <button ref={copyInputBtnRef} onClick={handleCopyTextInput} className="action-button" title="Copy Input String">📋</button>
                <button ref={copyImageBtnRef} onClick={handleCopyImageOutput} className="action-button" title="Copy QR Code Image">🖼️</button>
                <button ref={downloadBtnRef} onClick={handleDownloadImageOutput} className="action-button" title="Download QR Code (PNG)">💾</button>
            </div>
            {/* Conditionally render the error message */}
            {actionErrorMsg && <p className="error-message action-error">{actionErrorMsg}</p>}
        </>
    );
}

export default QrCodeActions;