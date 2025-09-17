import mongoose from "mongoose"
import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const deleteTripController = async (req, res) => {
  try {
    const tripId = req.params.id
    //check if user is owner before deleting
    const userId = "68c9558bf52e0dab4349930a" // Placeholder user ID
    const trip = await Trip.findById(tripId)

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" })
    }

    if (trip.userId.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this trip" })
    }

    const deletedTrip = await Trip.findByIdAndDelete(tripId)

    if (!deletedTrip) {
      return res.status(404).json({ error: "Trip not found" })
    }

    await User.updateMany({ sharedTrips: tripId }, { $pull: { sharedTrips: tripId } })

    res.status(200).json({ message: "Trip deleted successfully" })
  } catch (err) {
    console.error("Error deleting trip:", err.message)
    res.status(500).json({ error: "Internal server error (deleteTripController)" })
  }
}
