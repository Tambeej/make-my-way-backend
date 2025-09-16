import mongoose from "mongoose"
import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const getTripByIdController = async (req, res) => {
  try {
    //TODO: get userId from auth middleware
    //const userId = req.user.id // Assuming user ID is available in req.user
    const userId = "68c9558bf52e0dab4349930c" // Placeholder user ID
    const tripId = req.params.id

    const trip = await Trip.findById(tripId).populate("userId")

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" })
    }

    if (trip.userId._id.toString() !== userId.toString()) {
      const user = await User.findById(userId).select("sharedTrips")
      if (!user || !user.sharedTrips.some((id) => id.toString() === tripId)) {
        return res
          .status(403)
          .json({ error: "Access denied. You do not have permission to view this trip." })
      }
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
