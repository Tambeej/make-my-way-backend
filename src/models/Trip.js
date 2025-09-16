import mongoose from "mongoose"

const ItinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  activities: [
    {
      category: { type: String, required: true },
      place: {
        placeId: { type: String, required: true },
        name: { type: String, required: true },
        coordinates: {
          latitude: { type: Number, required: true },
          longitude: { type: Number, required: true },
        },
        address: { type: String },
        category: {
          type: { type: String },
          keyword: { type: String },
        },
        summary: { type: String },
        openingHours: [
          {
            open: {
              day: { type: Number },
              time: { type: String },
            },
            close: {
              day: { type: Number },
              time: { type: String },
            },
          },
        ],
        phone: { type: String },
        website: { type: String },
        url: { type: String },
        rating: { type: Number },
        types: [{ type: String }],
        photo: { type: String },
      },
    },
  ],
})

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tripInfo: {
      origin: { type: String, required: true },
      destination: { type: String, required: true },
      travelMode: { type: String, enum: ["driving", "walking", "bicycling"], required: true },
      startDate: { type: Date, required: true },
      endDate: {
        type: Date,
        required: true,
        validate: {
          validator: function (value) {
            return !this.startDate || value >= this.startDate
          },
          message: "endDate must be on or after startDate",
        },
      },
    },

    originInfo: {
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      address: { type: String, required: true },
      placeId: { type: String, required: true },
    },

    destinationInfo: {
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      address: { type: String, required: true },
      placeId: { type: String, required: true },
    },

    itinerary: [ItinerarySchema],
    tripPath: {
      overviewPolyline: { type: String, required: true },
    },
  },
  { timestamps: true }
)

tripSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})
tripSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() })
  next()
})

export default mongoose.model("Trip", tripSchema)
