import { Router } from "express"
import { planTripController } from "../controllers/trip.controller.js"
import { getTripPathController } from "../controllers/getTripPath.controller.js"
import { saveTripController } from "../controllers/saveTrip.controller.js"
import { getTripByIdController } from "../controllers/getTripById.controller.js"
import { getTripsOfUserController } from "../controllers/getTripOfUser.controller.js"
import { deleteTripController } from "../controllers/deleteTrip.controller.js"
import { getSharedWithUserTripsController } from "../controllers/getSharedWithUserTrips.controller.js"

const router = Router()

router.post("/planTrip", planTripController)
router.post("/tripPath", getTripPathController)

router.get("/my", getTripsOfUserController)
router.get("/sharedWithMe", getSharedWithUserTripsController)
router.get("/:id", getTripByIdController)

router.post("/save", saveTripController)
router.delete("/:id", deleteTripController)

export default router
