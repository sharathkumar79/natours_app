const User = require('../models/usermodel');
const CatchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, getOne, read } = require('./handlerFactory');

const multer = require('multer');
const AppError = require('../utils/appError');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users/');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerfilter = (req, file, cb) => {
  console.log(req.file,req.body);
  if (file.mimetype.split('/')[0] == 'image') {
    cb(null, true);
  } else {
    cb(new AppError('only images are supported', 400), false);
  }
};

exports.resizeUserPhoto = (req, res, next) => {
  const fileName = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${fileName}`);
  next();
};

const upload = multer({ storage: multerStorage, fileFilter: multerfilter });
exports.uploadUserImage = upload.single('photo');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const filterObj = (obj, ...feilds) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (feilds.includes(el)) {
      newobj[el] = obj[el];
    }
  });
  return newobj;
};

exports.updateMe = CatchAsync(async (req, res) => {
  const filterBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filterBody.photo = req.file.filename;
  }

  console.log('update me', filterBody);
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'successfully updated',
    updateduser: user,
  });
});

exports.deleteMe = CatchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    { new: true }
  ).select('+active');
  console.log(user);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.adduser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'internal server error',
  });
};

exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
exports.getUser = getOne(User);
exports.getallusers = read(User);
