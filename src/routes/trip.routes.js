import { Router } from "express"
import { planTripController } from "../controllers/trip.controller.js"
import { getTripPathController } from "../controllers/getTripPath.controller.js"
import { saveTripController } from "../controllers/saveTrip.controller.js"

const router = Router()

router.post("/planTrip", planTripController)
router.post("/tripPath", getTripPathController)
router.post("/save", saveTripController)

export default router
