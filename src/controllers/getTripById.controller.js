import mongoose from "mongoose"
import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const getTripByIdController = async (req, res) => {
  try {
    const tripId = req.params.id

    const trip = await Trip.findById(tripId).populate("userId")

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" })
    }

    const response = {
      id: trip._id,
      owner: {
        id: trip.userId._id,
        name: trip.userId.name,
        email: trip.userId.email,
      },
      tripInfo: trip.tripInfo,
      originInfo: trip.originInfo,
      destinationInfo: trip.destinationInfo,
      tripPath: trip.tripPath.overviewPolyline,
      itinerary: trip.itinerary,
      createdAt: trip.createdAt,
    }

    //console.log("trip", trip)

    res.status(200).json(response)
  } catch (err) {
    console.error("Error fetching trip:", err.message)
    res.status(500).json({ error: "Internal server error (getTripByIdController)" })
  }
}
