import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const rejectInviteController = async (req, res) => {
  try {
    const userId = req.user.id
    const invitedUserEmail = req.body.invitedUserEmail
    const tripId = req.params.id

    const trip = await Trip.findById(tripId)
    if (!trip) return res.status(404).json({ error: "Trip not found" })

    if (trip.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not the owner of this trip" })
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: invitedUserEmail },
      { $pull: { sharedTrips: tripId } },
      { new: true }
    )

    if (!updatedUser) return res.status(404).json({ error: "User not found" })

    res.status(200).json({ message: "User removed from trip" })
  } catch (err) {
    console.error("Error deleting trip:", err.message)
    res.status(500).json({ error: "Internal server error (rejectInviteController)" })
  }
}
