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

const router = Router()

//Google API and Gemini AI
router.post("/planTrip", planTripController)
router.post("/tripPath", getTripPathController)

//Trip CRUD
router.get("/my", getTripsOfUserController)
router.get("/sharedWithMe", getSharedWithUserTripsController)
router.get("/:id", getTripByIdController)

router.post("/save", saveTripController)
router.delete("/:id", deleteTripController)

//Trip sharing
router.post("/:id/share", inviteUserController)
router.delete("/:id/share/", rejectInviteController)
router.get("/:id/members", getMembersController)
router.delete("/sharedWithMe/:id", leaveSharedTripController)

// // Google API + planning
// router.post("/plan", planTripController)
// router.post("/path", getTripPathController)

// // Trips of user
// router.get("/my", getTripsOfUserController)
// router.get("/shared", getSharedWithUserTripsController)

// // Trip sharing
// router.post("/:id/share", inviteUserController)          // пригласить
// router.get("/:id/members", getMembersController)         // список участников
// router.delete("/:id/share", rejectInviteController)      // владелец удаляет участника
// router.delete("/shared/:id", leaveSharedTripController)  // сам пользователь уходит из чужого трипа

// // Trip CRUD
// router.post("/", saveTripController)
// router.get("/:id", getTripByIdController)
// router.delete("/:id", deleteTripController)

export default router
