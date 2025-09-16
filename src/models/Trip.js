import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: "endDate must be on or after startDate",
    },
  },
  itinerary: [{ day: Number, activity: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripPath: [
    {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

tripSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
tripSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export default mongoose.model("Trip", tripSchema);
