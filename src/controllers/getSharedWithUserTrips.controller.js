import mongoose from "mongoose"
import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const getSharedWithUserTripsController = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const sharedTrips = await Trip.find({ _id: { $in: user.sharedTrips } }).populate("userId")

    if (!sharedTrips || sharedTrips.length === 0) {
      return res.status(404).json({ error: "No shared trips found" })
    }

    const response = sharedTrips.map((trip) => ({
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
    }))

    res.status(200).json(response)
  } catch (err) {
    console.error("Error fetching shared trips:", err.message)
    res.status(500).json({ error: "Internal server error (getSharedWithUserTripsController)" })
  }
}
