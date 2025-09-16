import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  startDate:{ type: Date, required: true}, 
    endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: 'endDate must be on or after startDate',
    },
  },
  itinerary: [{ day: Number, activity: String }], 
  //budget: { type: Number, required: true }, ?
  preferences: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default tripSchema;

tripSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
tripSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});
