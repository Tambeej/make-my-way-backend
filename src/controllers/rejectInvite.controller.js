import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const rejectInviteController = async (req, res) => {
  try {
    //TODO: get userId from auth middleware
    //const UserId = req.user.id // Assuming user ID is available in req.user
    const UserId = "68c9558bf52e0dab4349930a" // Placeholder user ID
    const userToRemoveId = req.body.userId
    const tripId = req.params.id

    const trip = await Trip.findById(tripId)
    if (!trip) return res.status(404).json({ error: "Trip not found" })

    if (trip.userId.toString() !== currentUserId.toString()) {
      return res.status(403).json({ error: "You are not the owner of this trip" })
    }

    const updateUser = await User.findByIdAndUpdate(
      userToRemoveId,
      { $pull: { sharedTrips: tripId } },
      { new: true }
    )

    if (!updateUser) return res.status(404).json({ error: "User not found" })

    res.status(200).json({ message: "User removed from trip" })
  } catch (err) {
    console.error("Error deleting trip:", err.message)
    res.status(500).json({ error: "Internal server error (rejectInviteController)" })
  }
}
