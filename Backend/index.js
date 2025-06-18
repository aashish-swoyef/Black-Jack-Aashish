const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());

///

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
