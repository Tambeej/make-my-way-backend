import User from "../models/User.js"
import Trip from "../models/Trip.js"

export const inviteUserController = async (req, res) => {
  try {
    const userId = req.user.id
    const invitedUserEmail = req.body.invitedUserEmail
    const tripId = req.params.id

    const invitedUser = await User.findOne({ email: invitedUserEmail })
    if (!invitedUser) return res.status(404).json({ error: "User not found" })

    const trip = await Trip.findById(tripId)
    if (!trip) return res.status(404).json({ error: "Trip not found" })

    if (trip.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not the owner of this trip" })
    }

    if (invitedUser.sharedTrips?.some((id) => id.toString() === tripId))
      return res.status(400).json({ error: "User already invited to this trip" })

    await User.findByIdAndUpdate(invitedUser._id, { $addToSet: { sharedTrips: tripId } })

    res.status(200).json({ message: "Invitation sent" })
  } catch (err) {
    console.error("Error inviting user:", err.message)
    res.status(500).json({ error: "Internal server error (inviteUserController)" })
  }
}
