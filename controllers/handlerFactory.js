const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatuers = require('../utils/APIFeatueres');

exports.deleteOne = (Model) => {
  return CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('doc not found with that that id', 404));
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

exports.updateOne = (Model) => {
  return CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('specified doc not found', 404));
    }
    res.status(200).json({
      status: 'sucesses',
      data: doc,
    });
  });
};

exports.createOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'sucesses',
      data: {
        data: doc,
      },
    });
  });

exports.read = (Model) =>
  CatchAsync(async (req, res, next) => {
    const Featuers = new APIFeatuers(Model.find(), req.query)
      .filtering()
      .sort()
      .limitFields()
      .pagination();
    const doc = await Featuers.query;
    ///////////////////////////////////////////////
    /////////////sending response///////////////////////////
    res.status(200).json({
      status: 'sucesses',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  CatchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('specified document is not found', 404));
    }

    res.status(200).json({
      status: 'sucesses',
      data: {
        data: doc,
      },
    });
  });
