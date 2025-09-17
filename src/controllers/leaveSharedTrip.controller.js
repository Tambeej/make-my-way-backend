import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const leaveSharedTripController = async (req, res) => {
  try {
    //TODO: get userId from auth middleware
    //const userId = req.user.id // Assuming user ID is available in req.user
    const userId = "68c9558bf52e0dab4349930a" // Placeholder user ID
    const tripId = req.params.id

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { sharedTrips: tripId } },
      { new: true }
    )

    if (!updateUser) return res.status(404).json({ error: "User not found" })

    res.status(200).json({ message: "Trip removed from shared trips" })
  } catch (err) {
    console.error("Error deleting trip:", err.message)
    res.status(500).json({ error: "Internal server error (rejectInviteController)" })
  }
}
