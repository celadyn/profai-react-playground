import React, { useState } from 'react'; // Need useState here

function EchoForm() {
  // --- Component Structure Best Practice ---
  // Imports -> Component Function -> State -> Effects -> Handlers -> Return JSX

  // --- State ---
  // State related to the form is now fully contained within this component
  const [inputValue, setInputValue] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null); // Use a different name to avoid confusion if App also has 'error' state

  // --- Event Handlers ---
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Submit button clicked in EchoForm, sending value:', inputValue);
    setIsLoading(true);
    setServerResponse('');
    setFormError(null); // Use the specific error state for this form

    const postApiUrl = 'http://localhost:3333/api/echo';

    fetch(postApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: inputValue }),
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
           throw new Error(`HTTP error! Status: ${response.status} - ${text || 'No details'}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Response from POST in EchoForm:', data);
      setServerResponse(`Server echoed back: "${data.receivedText}"`);
    })
    .catch(err => {
      console.error("Failed to send data from EchoForm:", err);
      setFormError(`Failed to send data. ${err.message}`); // Update specific error state
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  // --- Return JSX ---
  return (
    <div> {/* Single root element */}
      <h2>Send Data to Server</h2>
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter text to send"
          disabled={isLoading}
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send to Backend'}
        </button>
      </div>

      {/* Display form-specific error or server response */}
      {formError && <p style={{ color: 'red' }}>Error: {formError}</p>}
      {serverResponse && !formError && <p><strong>Server Response:</strong> {serverResponse}</p>}
    </div>
  );
}

export default EchoForm;