import React, { useState } from 'react';
import Modal from 'react-modal';
import './FeedbackWidget.css'; // We will create this CSS file next
import Spinner from './Spinner.jsx'; // Import Spinner CSS for loading state

function FeedbackWidget() {
  // State for controlling the modal visibility
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // State for the feedback text input
  const [feedbackText, setFeedbackText] = useState('');
  // State for loading/submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // To show success/error messages

  // Function to open the modal
  const openModal = () => {
    setModalIsOpen(true);
    setSubmitStatus(''); // Clear status when opening
    setFeedbackText(''); // Clear text when opening
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Function to handle text area changes
  const handleTextChange = (event) => {
    setFeedbackText(event.target.value);
  };

  // Function to handle the feedback submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission if we used a <form> tag
    console.log('Submitting feedback:', feedbackText);
    setIsSubmitting(true);
    setSubmitStatus('Submitting...');

    // POST request to the backend
    fetch('http://localhost:3333/api/feedback', { // The new backend endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback: feedbackText }), // Send feedback text
    })
    .then(response => {
      if (!response.ok) {
        // If response not OK, try to parse error text, otherwise throw generic error
        return response.text().then(text => {
           throw new Error(`Server error: ${response.status} - ${text || 'Unknown error'}`);
        });
      }
      return response.json(); // Expecting JSON back, like { message: 'Success' }
    })
    .then(data => {
      console.log('Feedback submission success:', data);
      setSubmitStatus('Feedback submitted successfully!');
      // Optionally close modal after a short delay
      setTimeout(() => {
         closeModal();
      }, 1500);
    })
    .catch(error => {
      console.error('Feedback submission error:', error);
      setSubmitStatus(`Submission failed: ${error.message}`);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <>
      {/* The button that triggers the modal */}
      <button onClick={openModal} className="feedback-open-button">
        Feedback
      </button>

      {/* The Modal component */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} // Allows closing by clicking overlay or pressing Esc
        contentLabel="Feedback Form" // For screen readers
        className="feedback-modal" // Class for styling the modal window itself
        overlayClassName="feedback-modal-overlay" // Class for styling the background overlay
      >
        {/* Modal Content */}
        <h2>Provide Feedback</h2>
        <textarea
          value={feedbackText}
          onChange={handleTextChange}
          placeholder="Enter your feedback here..."
          rows={5}
          disabled={isSubmitting}
          className="feedback-textarea"
        />
        <div className="feedback-modal-actions">
          <button onClick={closeModal} disabled={isSubmitting} className="feedback-button cancel">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting || !feedbackText.trim()} className="feedback-button submit">
            {/* Conditionally render Spinner or Text */}
            {isSubmitting ? <Spinner size="small" /> : 'Submit Feedback'} {/* <-- Use Spinner */}
          </button>
        </div>
        {/* Display submission status */}
        {submitStatus && <p className="feedback-status">{submitStatus}</p>}
      </Modal>
    </>
  );
}

export default FeedbackWidget;