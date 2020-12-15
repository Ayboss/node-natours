const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIfeatures = require('./../util/APIfeatures');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const factoryController = require('./factoryController');

exports.top5tour = (req,res,next)=>{
  req.query.limit = '5';
  req.query.sort= "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
}


exports.getAllTours = factoryController.getAll(Tour);

exports.getTour = factoryController.getOne(Tour,{path:'reviews'});

exports.createTour = factoryController.createOne(Tour);

exports.updateTour = factoryController.updateOne(Tour);

exports.deleteTour = factoryController.deleteOne(Tour);

// ('/tours-within/:distance/center/:latlng/unit/:unit')
exports.getTourWithin = catchAsync(async (req,res,next)=>{
  const {distance,latlng,unit} = req.params;
  const radius = unit === 'mi'? distance/3963.2: distance/6378.1;
  const [lat,lng] = latlng.split(',');
  if(!lat || !lng){
    return next(new AppError('please provide latlng in format lat,lng', 400))
  }
  const tours = Tour.find({
    startLocation:{
      $geoWithin:{
        $centerSphere:[[lng,lat],radius]
      }
    }
  });
  res.status(200).send({
    status: 'success',
    length: tours.length,
    data:{
      data: tours
    }
  })
});

exports.getDistances = catchAsync(async (req,res,next)=>{
  const {latlng,unit} = req.params;
  const [lat,lng] = latlng.split(',');
  if(!lat || !lng){
    return next(new AppError('please provide latlng in format lat,lng', 400))
  }
  const multiplier = unit === 'mi'? 0.000621371: 0.001;
  const distances = Tour.aggregate([
    {
      $geoNear:{
        near: {
          type:'Point',
          coordinates:[lng *1, lat*1]
          },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project:{
        distance:1,
        name:1
      }
    }
  ]);

  res.status(200).send({
    status:'success',
    data:{
      data: distances
    }
  })
})

exports.getTourStat = catchAsync(async(req,res,next)=>{
    const stats = await Tour.aggregate([
      {
      $match:{ratingsAverage:{$gte: 4.5}}
      },
      {
      $group:{
        _id:{$toUpper: "$difficulty"},
        numTours:{$sum: 1},
        numRatings: {$sum: "$ratingsQuantity"},
        avgRating: {$avg : "$ratingsAverage"},
        avgPrice: {$avg: "$price"},
        minPrice: {$min: "$price"},
        maxPrice: {$max: "$price"}
            }
      },
      {
        $sort : {avgPrice : 1}
      }
  ])

  res.status(200).json({
    status:'success',
    data:{
        stats
      }
    });
})

exports.getMonthlyPlan = catchAsync(async (req,res,next)=>{
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind : "$startDates"},
      {$match: {
        startDates:{$gte: new Date(`${year}-01-01`)},
        startDates:{$lte: new Date(`${year}-12-31`)}
      }},
      {
        $group:{
          _id:{$month:"$startDates"},
          numTourStats:{$sum : 1},
          tours:{$push: "$name"}
        }
      },
      {
        $addFields:{month:"$_id"}
      },
      {
        $project:{
          _id:0
        }
      },
      {
        $sort:{ numTourStats: -1}
      },
      {
        $limit: 12
      }

    ])
    res.status(200).json({
      status: 'success',
      data:{
        plan
      }
    })

})
