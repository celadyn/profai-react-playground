import { useState, useEffect } from 'react';
import './App.css';
import GreetingDisplay from './components/GreetingDisplay';
import EchoForm from './components/EchoForm';
import FeedbackWidget from './components/FeedbackWidget';
import QrGenerator from './components/QrGenerator'; // <-- Import


function App() {
  // --- State ---
  const [greeting, setGreeting] = useState('');
  const [error, setError] = useState(null); // For greeting fetch errors

  // --- State MOVED to EchoForm ---
  // const [inputValue, setInputValue] = useState('');
  // const [serverResponse, setServerResponse] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [appLevelErrorForForm, setAppLevelErrorForForm] = useState(null); // Name might change

  // --- Effect Hook (Fetches initial greeting) ---
  useEffect(() => {
    console.log('App component rendered, attempting to fetch initial greeting...');
    const apiUrl = 'http://localhost:3333/api/greeting';
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => { // <--- SUCCESS CASE
        // Construct the message from the received data
        const message = `Server says: "${data.message}" at ${data.timestamp}`;
        // ****** HERE is where setGreeting is called ******
        setGreeting(message);
        // ****** And here is where setError is called (to clear any previous error) ******
        setError(null);
      })
      .catch(err => { // <--- ERROR CASE
        console.error("Failed to fetch greeting:", err);
        // ****** HERE is where setError is called with the error message ******
        setError(`Failed to load greeting. ${err.message}`);
        // ****** And here setGreeting is called (to clear any previous greeting) ******
        setGreeting('');
      });
  }, []); // Runs once on mount


  // --- Handlers MOVED to EchoForm ---
  // const handleInputChange = (event) => {
  //   setInputValue(event.target.value);
  // };
  //
  // const handleSubmit = () => {
  //   console.log('Submit button clicked in App, sending value:', inputValue);
  //   setIsLoading(true);
  //   setServerResponse('');
  //   setAppLevelErrorForForm(null);
  //
  //   const postApiUrl = 'http://localhost:3333/api/echo';
  //
  //   fetch(postApiUrl, { /* ... fetch options ... */ })
  //   .then(response => { /* ... */ })
  //   .then(data => {
  //     console.log('Response from POST in App:', data);
  //     setServerResponse(`Server echoed back: "${data.receivedText}"`);
  //   })
  //   .catch(err => {
  //     console.error("Failed to send data from App:", err);
  //     setAppLevelErrorForForm(`Failed to send data. ${err.message}`);
  //   })
  //   .finally(() => {
  //     setIsLoading(false);
  //   });
  // };

  // --- Render ---
  return (
    <div className="App">
      <h1>My QR Project Frontend</h1>

      <GreetingDisplay greeting={greeting} error={error} />

      <hr />

      {/* Render the QR Generator */}
      <QrGenerator /> 

      <EchoForm />

      {/* --- JSX MOVED to EchoForm --- */}
      {/* <h2>Send Data to Server</h2>
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
      {appLevelErrorForForm && <p style={{ color: 'red' }}>Error: {appLevelErrorForForm}</p>}
      {serverResponse && !appLevelErrorForForm && <p><strong>Server Response:</strong> {serverResponse}</p>} */}
      {/* --- End Moved JSX --- */}

      <FeedbackWidget />

    </div>
  );
}

export default App;