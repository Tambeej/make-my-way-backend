import mongoose from "mongoose"
import User from "../models/User.js"
import Trip from "../models/Trip.js"
import { deleteTripPDF, generateTripPDF } from "../services/pdf.service.js"

// const body = {
//   tripInfo: {
//     origin: "New York",
//     destination: "Los Angeles",
//     travelMode: "driving",
//     startDate: new Date("2025-10-01T00:00:00Z"),
//     endDate: new Date("2025-10-06T00:00:00Z"),
//   },
//   originInfo: {
//     coordinates: { latitude: 40.7128, longitude: -74.006 },
//     address: "New York, NY, USA",
//     placeId: "ChIJOwg_06VPwokRYv534QaPC8g",
//   },
//   destinationInfo: {
//     coordinates: { latitude: 34.0522, longitude: -118.2437 },
//     address: "Los Angeles, CA, USA",
//     placeId: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
//   },
//   itinerary: [
//     {
//       day: 1,
//       activities: [
//         {
//           category: "sightseeing",
//           place: {
//             placeId: "statue_of_liberty_id",
//             name: "Statue of Liberty",
//             coordinates: { latitude: 40.6892, longitude: -74.0445 },
//             address: "Liberty Island, New York, NY 10004, USA",
//             types: ["tourist_attraction", "landmark"],
//             summary: "Iconic symbol of freedom",
//             rating: 4.8,
//             url: "https://maps.google.com/?cid=statue_of_liberty",
//             photo: "https://example.com/eiffel.jpg",
//             phone: "+33 892 70 12 39",
//             website: "https://www.toureiffel.paris/",
//             openingHours: [
//               {
//                 open: { day: 1, time: "09:00" },
//                 close: { day: 1, time: "23:00" },
//               },
//             ],
//           },
//         },
//         {
//           category: "restaurant",
//           place: {
//             placeId: "central_park_id",
//             name: "Central Park",
//             coordinates: { latitude: 40.785091, longitude: -73.968285 },
//             address: "New York, NY, USA",
//             types: ["park", "tourist_attraction"],
//             summary: "Urban park in Manhattan",
//             rating: 4.7,
//             url: "https://maps.google.com/?cid=central_park",
//             photo: "https://example.com/central_park.jpg",
//             phone: "+1 212-310-6600",
//             website: "https://www.centralparknyc.org/",
//             openingHours: [
//               {
//                 open: { day: 1, time: "06:00" },
//                 close: { day: 1, time: "01:00" },
//               },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       day: 2,
//       activities: [
//         {
//           category: "dining",
//           place: {
//             placeId: "famous_restaurant_id",
//             name: "Famous Restaurant",
//             coordinates: { latitude: 40.73061, longitude: -73.935242 },
//             address: "123 Food St, New York, NY 10003, USA",
//             types: ["restaurant", "food"],
//             summary: "Popular spot for local cuisine",
//             rating: 4.5,
//             url: "https://maps.google.com/?cid=famous_restaurant",
//             photo: "https://example.com/restaurant.jpg",
//             phone: "+1 212-555-1234",
//             website: "https://www.famousrestaurant.com/",
//             openingHours: [
//               {
//                 open: { day: 1, time: "11:00" },
//                 close: { day: 1, time: "22:00" },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   tripPath: {
//     overviewPolyline: "encoded_polyline_new_york_los_angeles",
//   },
// }

export const saveTripController = async (req, res) => {
  try {
    //TODO: get userId from auth middleware
    //const userId = req.user.id // Assuming user ID is available in req.user
    const userId = "68c9558bf52e0dab4349930a" // Placeholder user ID

    const tripData = req.body

    const newTrip = new Trip({
      userId,
      ...tripData,
    })

    const validationError = newTrip.validateSync()
    if (validationError) {
      return res.status(400).json({ error: "Validation failed", details: validationError.errors })
    }

    // Generate PDF for the saved trip
    const pdfUrl = await generateTripPDF(newTrip)
    newTrip.pdfUrl = pdfUrl

    const savedTrip = await newTrip.save()

    res.status(201).json({
      message: "Trip saved successfully",
      trip: savedTrip,
    })
  } catch (err) {
    console.error("Error saving trip:", err)
    try {
      await deleteTripPDF(newTrip._id)
    } catch (deleteErr) {
      console.error("Error deleting PDF:", deleteErr)
    }
    return res.status(500).json({ error: "Failed to save trip" })
  }
}
