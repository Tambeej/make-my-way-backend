import mongoose from "mongoose"
import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const getTripsOfUserController = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const trips = await Trip.find({ userId: user._id }).sort({ createdAt: -1 })

    const response = trips.map((trip) => ({
      id: trip._id,
      tripInfo: trip.tripInfo,
      originInfo: trip.originInfo,
      destinationInfo: trip.destinationInfo,
      tripPath: trip.tripPath.overviewPolyline,
      pdfUrl: trip.pdfUrl,
      itinerary: trip.itinerary,
      createdAt: trip.createdAt,
    }))

    res.status(200).json(response)
  } catch (err) {
    console.error("Error fetching user's trips:", err.message)
    res.status(500).json({ error: "Internal server error (getTripsOfUserController)" })
  }
}
