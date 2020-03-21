// Require modules
//
const fs = require('fs');
const express = require('express');

const app = express();

// Middleware
// can modify the incoming request data
// "middle" because it is between the req and res
// a step added to the request

app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint.');
// });

// Assign the parsed tour data to a variable
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route Handlers

// Get All Tours
app.get('/api/v1/tours', (req, resp) => {
  resp.status(200).json({
    status: 'success',
    // number of results if sending an array with multiple objects
    results: tours.length,
    data: {
      // do not have to specify if the key and value have the same name
      tours
    }
  });
});

// Response Example
/*
  {
    "status": "success",
    "results": 9,
    "data" : {
      "tours":[
        {  all tour objects }
      ]
    }
  }
*/

// Create New Tour
//only change the method, not route

app.post('/api/v1/tours', (req, res) => {
  // sent data
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      // 201 === created
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
  // res.send('Done 😆');
});

// Get One Tour by ID
// define the variable in the route with a /:varName referred to the req as params
// can change multiple variables /:var1/:var2/:var3
// the url is required to have all params to be successful
// Optional Params so we do not have to specify with a ? after /:var1/:var2/:var3?

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  // Automatically convert the string of the request id to a number
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  // Error handling for not found
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  resp.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

// Patch - Update a single tour by id

app.patch(`/api/v1/tours/:id`, (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<UPDATED TOUR HERE>'
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});