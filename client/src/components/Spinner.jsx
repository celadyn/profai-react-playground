import React from 'react';
import './Spinner.css'; // We'll create this CSS file next

// A simple functional component for the spinner
// It accepts an optional 'size' prop ('small', 'medium', 'large')
function Spinner({ size = 'medium' }) {
  // Construct the className string including the base class and the size class
  const spinnerClassName = `spinner spinner-${size}`;

  // Return a simple div that will be styled entirely by CSS
  return <div className={spinnerClassName}></div>;
}

export default Spinner;