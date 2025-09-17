import Trip from "../models/Trip.js"

export const checkTripOwner = async (req, res, next) => {
  try {
    const tripId = req.params.id
    const userId = req.user.id

    const trip = await Trip.findById(tripId)

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" })
    }

    if (trip.userId.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to access this trip" })
    }

    req.trip = trip
    next()
  } catch (err) {
    console.error("Error in checkTripOwner middleware:", err)
    res.status(500).json({ error: "Internal server error (checkTripOwner)" })
  }
}
