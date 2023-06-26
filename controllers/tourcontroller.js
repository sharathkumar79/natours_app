const Tour = require('./../models/tourmodel');
const APIFeatuers = require('./../utils/APIFeatueres');

const CatchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.addtour = factory.createOne(Tour);
exports.updatetour = factory.updateOne(Tour);
exports.deletetour = factory.deleteOne(Tour);
exports.getAllTours = factory.read(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.topFiveCheapTour = (req, res, next) => {
  req.query.sort = 'price';
  req.query.limit = 5;
  next();
};

exports.getMonthlyPlan = CatchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const monthlydata = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numberoftours: {
          $sum: 1,
        },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $sort: {
        numberoftours: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'sucesses',
    data: { monthlydata },
  });
});

exports.getStats = CatchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $group: {
        _id: '$difficulty',
        numberoftours: { $sum: 1 },
        numberofratings: {
          $sum: '$ratingsQuantity',
        },
        ratingsAverage: {
          $avg: '$ratingsAverage',
        },
        averagePrice: {
          $avg: '$price',
        },
        maxPrice: {
          $max: '$price',
        },
        minPrice: {
          $min: '$price',
        },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    body: stats,
  });
});

exports.toursWithIn = CatchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) return next(new AppError('lat lng s are missing', 400));
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.distanceFromLocation = CatchAsync(async (req, res, next) => {
  const [lat, lng] = req.params.latlng.split(',');
  if (!lat || !lng) return next(new AppError('lat lng s are missing', 400));
  const tours = await Tour.aggregate({
    $geoNear: {
      near: {
        type: 'point',
        cordinates: [lng * 1, lat * 1],
      },
      distanceField: 'distance',
      distanceMultiplier: 0.001,
    },
    $project: {
      name: 1,
      distance: 1,
    },
  });

  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: {
    //   tours: tours,
    // },
  });
});

// exports.addtour = CatchAsync(async (req, res, next) => {
//   const newtour = await tour.create(req.body);
//   res.status(201).json({
//     status: 'sucesses',
//     data: {
//       tour: newtour,
//     },
//   });
// });

// exports.updatetour = CatchAsync(async (req, res, next) => {
//   console.log(req.body);
//   const newtour = await tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!newtour) {
//     return next(new AppError('specified tour not found', 404));
//   }

//   // const newtour = await tour.findById(req.params.id);
//   // if (!newtour) {
//   //   return next(new AppError('specified tour not found', 404));
//   // }
//   // Object.keys(req.body).forEach((el) => {
//   //   newtour[el] = req.body[el];
//   // });
//   // await newtour.save();

//   res.status(200).json({
//     status: 'sucesses',
//     data: {
//       tour: newtour,
//     },
//   });
// });

// exports.deletetour = CatchAsync(async (req, res, next) => {
//   await tour.findByIdAndDelete(req.params.id);
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

// exports.totalTours = CatchAsync(async (req, res, next) => {
//   const Featuers = new APIFeatuers(tour.find(), req.query)
//     .filtering()
//     .sort()
//     .limitFields()
//     .pagination();
//   const tours = await Featuers.query;
//   ///////////////////////////////////////////////
//   /////////////sending response///////////////////////////
//   res.status(200).json({
//     status: 'sucesses',
//     result: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// });
