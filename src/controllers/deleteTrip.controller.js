import mongoose from "mongoose"
import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const deleteTripController = async (req, res) => {
  try {
    const tripId = req.params.id

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
