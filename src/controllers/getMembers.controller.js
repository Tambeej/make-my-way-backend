import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const getMembersController = async (req, res) => {
  try {
    const tripId = req.params.id

    const trip = await Trip.findById(tripId).populate("userId", "name email")
    if (!trip) return res.status(404).json({ error: "Trip not found" })

    const owner = {
      id: trip.userId._id,
      name: trip.userId.name,
      email: trip.userId.email,
      role: "owner",
    }

    const sharedUsers = await User.find({ sharedTrips: tripId }, "_id name email")

    const members = [
      owner,
      ...sharedUsers.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: "member",
      })),
    ]

    res.status(200).json(members)
  } catch (err) {
    console.error("Error fetching members:", err.message)
    res.status(500).json({ error: "Internal server error (getMembersController)" })
  }
}
