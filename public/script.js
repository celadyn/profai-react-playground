console.log("Hello from the client-side script.js!");

// Add an element to the page after a delay
setTimeout(() => {
  const newPara = document.createElement('p');
  newPara.textContent = 'This paragraph was added by script.js after 2 seconds.';
  document.body.appendChild(newPara);
}, 2000);


// --- Fetch data from our server API ---

console.log('Attempting to fetch data from /api/greeting...');

fetch('/api/greeting') // Make a GET request to our API endpoint
  .then(response => {
    // Check if the request was successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Parse the JSON body of the response
    return response.json();
  })
  .then(data => {
    // We have the parsed JSON data!
    console.log('Data received from server:', data);

    // Let's display the message on the page
    const greetingDiv = document.getElementById('server-greeting');
    if (greetingDiv) {
      greetingDiv.textContent = `Server says: "${data.message}" at ${data.timestamp}`;
    } else {
      console.error('Could not find element with ID "server-greeting"');
    }
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching data:', error);
    const greetingDiv = document.getElementById('server-greeting');
    if (greetingDiv) {
      greetingDiv.textContent = 'Failed to load greeting from server.';
      greetingDiv.style.color = 'red';
    }
  });

console.log('Fetch request initiated (will complete asynchronously).');
