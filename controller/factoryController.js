const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const APIfeatures = require('./../util/APIfeatures');

exports.deleteOne = (Model)=>{
  return catchAsync(async (req,res,next)=>{
      const id = req.params.id;
      const doc = await Model.findByIdAndDelete(id);
      if(!doc){
        return next(new AppError("document was not found",404));
      }
      res.status(204).json({
        status:'success',
        data:{
          doc
        }
      })
  });
}

exports.updateOne =(Model)=>{
  return catchAsync(async (req,res,next)=>{
      const id = req.params.id;
      const doc = await Model.findByIdAndUpdate(id,res.body,{
        new:true,
        runValidators: true
      })
      if(!doc){
        return next(new AppError("document was not found",404));
      }
      res.status(200).json({
        status:'success',
        data:{
          data:doc
          }
      })
  })
};

exports.createOne = Model =>{
  return catchAsync(async (req,res,next)=>{
      const doc = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          data: doc
        }
      });
  });
}

exports.getOne = (Model, populateOpt) =>{
  return catchAsync(async (req,res,next)=>{
      const id = req.params.id;
      let query =  Model.findById(id)
      if(populateOpt) query.populate(populateOpt);
      const doc = await query;
      // const tour = await Tour.findOne({_id:id});
      if(!doc){
        return next(new AppError("document not found",404));
      }
      res.status(200).json({
        status:'success',
        data:{
          data:doc
        }
      })
  });
}

exports.getAll = (Model) => {
  return catchAsync(async (req,res,next)=>{
      let check = {};
      if(req.params.tourId){
         check = {tour:req.params.tourId}
      }
      const features = new APIfeatures(Model.find(check),req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .paginate();
      const doc = await features.query;
      res.status(200).json({
        status:'success',
        results: doc.length,
        data:{
          data:doc
        }
      })
  });
}
