const fs = require('fs');

// Assign the parsed tour data to a variable
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID'
  //   });
  // }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // number of results if sending an array with multiple objects
    results: tours.length,
    data: {
      tours
    }
  });
};

// Get One Tour by ID
// define the variable in the route with a /:varName referred to the req as params
// can change multiple variables /:var1/:var2/:var3
// the url is required to have all params to be successful
// Optional Params so we do not have to specify with a ? after /:var1/:var2/:var3?
exports.getTour = (req, res) => {
  // Automatically convert the string of the request id to a number
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

// Create New Tour - only change the method, not route
exports.createTour = (req, res) => {
  // sent data => req.body
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
};

// Patch - Update a single tour by id
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<UPDATED TOUR HERE...>'
    }
  });
};

// Delete
exports.deleteTour = (req, res) => {
  // 204 === successful request w/o content
  res.status(204).json({
    status: 'success',
    data: null
  });
};
