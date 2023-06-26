const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      minlength: 6,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: String,
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a maxgroupsize'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: ['easy', 'difficult', 'medium'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a summary'],
    },
    ratingsAverage: {
      type: Number,
      default: 4,
      min: [1, 'ratings  must be greater than 1 '],
      max: [5, 'rating must be less than 5'],
      set: (el) => Math.round(el * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have a imagecover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //geojson object
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema
  .virtual('durationInWeeks')
  .get(function () {
    return this.duration / 7;
  })
  .set(function (n) {
    this.duration = n * 7;
  });

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

///document middleware//////

//for embedding guides in tour
// tourSchema.pre('save', async function (next) {
//   console.log('hi');
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save',function(next) {
//   console.log(this);
//   next();
// })

// tourSchema.post('save',function(docs,next) {
//   console.log('///////////////////////////////////////////////hello//////////////n/////')
//   console.log(docs);
//   next();
// })

///query middleware//

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.time = new Date();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordResetToken -passwordResetTokenExpires',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`time taken ${new Date() - this.time}`);
  // console.log(doc);
  next();
});

///////////// aggregate  middlleware///////////////

// tourSchema.pre('aggregate', function (next) {
//   // console.log(this.pipeline());
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('tour', tourSchema);
module.exports = Tour;
