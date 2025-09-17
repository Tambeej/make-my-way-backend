import { Router } from "express"
import { planTripController } from "../controllers/trip.controller.js"
import { getTripPathController } from "../controllers/getTripPath.controller.js"
import { saveTripController } from "../controllers/saveTrip.controller.js"
import { getTripByIdController } from "../controllers/getTripById.controller.js"
import { getTripsOfUserController } from "../controllers/getTripOfUser.controller.js"
import { deleteTripController } from "../controllers/deleteTrip.controller.js"
import { getSharedWithUserTripsController } from "../controllers/getSharedWithUserTrips.controller.js"
import { inviteUserController } from "../controllers/inviteUser.controller.js"
import { rejectInviteController } from "../controllers/rejectInvite.controller.js"
import { getMembersController } from "../controllers/getMembers.controller.js"
import { leaveSharedTripController } from "../controllers/leaveSharedTrip.controller.js"
import authenticate from "../middlewares/authMiddleware.js"

const router = Router()

//Google API and Gemini AI
router.post("/plan", authenticate, planTripController) // Generate a travel plan (using Google/Gemini APIs)
router.post("/path", authenticate, getTripPathController) // Get the trip path/route polyline between locations

//Trips of user
router.get("/my", authenticate, getTripsOfUserController) // Get all trips created by the current user
router.get("/shared", authenticate, getSharedWithUserTripsController) // Get trips shared with the current user

//Trip sharing
router.post("/:id/share", authenticate, inviteUserController) // Invite another user to a trip by email
router.get("/:id/members", authenticate, getMembersController) // Get all members of a trip (owner + invited users)
router.delete("/:id/share", authenticate, rejectInviteController) // Owner removes a user from the trip (revoke access)
router.delete("/shared/:id", authenticate, leaveSharedTripController) // Current user leaves a shared trip

//Trip CRUD
router.post("/", authenticate, saveTripController) // Create and save a new trip
router.get("/:id", authenticate, getTripByIdController) // Get trip details by trip ID
router.delete("/:id", authenticate, deleteTripController) // Delete a trip (only owner can delete)

export default router
