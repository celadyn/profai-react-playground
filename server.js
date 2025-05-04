const express = require('express');
const path = require('path'); // Import the built-in 'path' module
const cors = require('cors'); // <-- Add this line
const app = express();
const port = 3333;


// --- Serve static files from the 'public' directory ---
app.use(express.static(path.join(__dirname, 'public')));
// --- End static file serving ---


// --- Middleware Example: Logger ---

// This function will run for EVERY request that comes in, BEFORE the specific route handlers
app.use((req, res, next) => {
  console.log(`------`); // Separator for clarity
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next(); // IMPORTANT: Call next() to pass control to the next middleware or route handler
});

// --- End Logger Middleware ---


// --- Middleware: JSON Body Parser ---

// This middleware parses incoming requests with JSON payloads
// and makes the parsed data available on req.body
app.use(express.json()); 
// --- End JSON Body Parser ---


// --- Enable CORS for all origins ---
// By default, cors() allows requests from ALL origins.
// For development, this is often fine. For production, you might restrict it.
app.use(cors()); // <-- Add this line
// --- End CORS ---


// --- Routes -- //

// (Keep your existing routes: app.get('/'), app.get('/about'), etc.)
app.get('/', (req, res) => {
  // **Important Change:** We want index.html to serve the root now,
  // so we can actually REMOVE or comment out this specific route handler
  // The express.static middleware will handle serving index.html automatically
  // for requests to '/' if it exists in the 'public' folder.
  // Let's comment it out:
  // res.send('Welcome to the Homepage!');
});


// Route 2: Handle GET requests for '/about'
app.get('/about', (req, res) => {
  res.send('This is the About page.');
});

// Route 3: (Optional) A simple POST handler example - we won't test this via browser easily yet
app.post('/submit', (req, res) => {
   res.send('Received a POST request on /submit');
});


// --- API Routes ---

// Endpoint to send back some sample data
app.get('/api/greeting', (req, res) => {
  console.log('Request received for /api/greeting'); // Server-side log

  // Data we want to send back to the client
  const dataToSend = {
    message: 'Hello from the Astral Express Server API! May this journey lead us ever starward!',
    timestamp: new Date().toISOString(),
    sender: 'Node/Express Backend'
  };

  // Use res.json() to send data as JSON
  // Express automatically sets the Content-Type header to application/json
  res.json(dataToSend);
});

// POST endpoint to receive feedback <--- NEW ROUTE ---
app.post('/api/feedback', (req, res) => {
  console.log('------');
  console.log('Request received for POST /api/feedback');
  console.log('Feedback Received:', req.body); // Requires express.json() middleware
  // Basic validation
  if (req.body && req.body.feedback && typeof req.body.feedback === 'string' && req.body.feedback.trim().length > 0) {
    const receivedFeedback = req.body.feedback;

    // **TODO:** In a real app, save this feedback somewhere!
    // For now, we just log it to the console.
    console.log(`User Feedback: "${receivedFeedback}"`);

    // Add artificial delay before sending the response
    setTimeout(() => {
      res.status(200).json({ // Use 200 OK or 201 Created
        message: 'Feedback received successfully. Thank you!'
      });
    }, 2000); // 2-second delay
  } else {
    // If data is invalid or missing
    console.log('Invalid feedback data received.');
    res.status(400).json({
      error: 'Invalid feedback data. Expected JSON object with a non-empty "feedback" string property.'
    });
  }
});

// POST endpoint to echo back received data <--- NEW ROUTE ---
app.post('/api/echo', (req, res) => {
  console.log('------');
  console.log('Request received for POST /api/echo');
  console.log('Request Body:', req.body); // Thanks to express.json(), req.body contains the parsed JSON

  // Check if we received the expected data structure
  if (req.body && req.body.text) {
    const receivedText = req.body.text;
    console.log('Received text:', receivedText);

    // Send a response back to the client
    res.json({
      message: 'Data received successfully!',
      receivedText: receivedText // Echo the text back
    });
  } else {
    // If the body or 'text' property is missing, send an error response
    console.log('Invalid request body received.');
    res.status(400).json({ // 400 Bad Request status code
      error: 'Invalid request body. Expected JSON object with a "text" property.'
    });
  }
});

// --- End API Routes ---


// --- 404 Handler Middleware (Optional but good practice) ---

// This middleware runs if *no other route* matched above
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that route!");
});
// --- End 404 Handler ---


app.listen(port, () => {
  console.log(`Astral Express server running at http://localhost:${port}/`);
});
