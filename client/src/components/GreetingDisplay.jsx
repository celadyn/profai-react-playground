import React from 'react'; // Good practice to import React, though not strictly needed in newer versions with new JSX transform

// This is a "functional component". It receives 'props' as an argument.
// We are using object destructuring ({ greeting, error }) to directly get the props we expect.
function GreetingDisplay({ greeting, error }) {
  // --- Component Structure Best Practice ---
  // Generally: Imports -> Component Function -> (Internal State/Effects if needed) -> Return JSX

  // This component *receives* data via props, it doesn't fetch it itself (for now).

  // --- Return JSX ---
  // Best Practice: Return a single root element. Can be a real element (div) or a Fragment (<>...</>)
  return (
    <div className="greeting-container">
      {/* Conditionally render based on the props passed down */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {greeting && !error && <p>{greeting}</p>}
      {!greeting && !error && <p>Loading greeting...</p>} {/* Added a default loading message */}
    </div>
  );
}

// Optional but Recommended: PropTypes for type checking props during development
// You might need to install prop-types: npm install prop-types
// import PropTypes from 'prop-types';
// GreetingDisplay.propTypes = {
//   greeting: PropTypes.string,
//   error: PropTypes.string
// };

export default GreetingDisplay; // Make the component available for import