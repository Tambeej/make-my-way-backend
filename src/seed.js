import mongoose from "mongoose"
import connectDB from "./config/db.js"
import User from "./models/User.js"
import Trip from "./models/Trip.js"

// Mock data
const mockUsers = [
  {
    name: "Alice Traveler",
    email: "alice@example.com",
    passwordHash: "hashed_password_1",
    preferences: {
      activities: ["sightseeing", "hiking"],
      food: ["italian", "sushi"],
    },
    role: "user",
    sharedTrips: [],
  },
  {
    name: "Bob Guest",
    email: "bob@example.com",
    passwordHash: "hashed_password_2",
    preferences: {
      activities: ["beach", "swimming"],
      food: ["seafood", "vegan"],
    },
    role: "guest",
    sharedTrips: [],
  },
  {
    name: "Charlie Explorer",
    email: "charlie@example.com",
    passwordHash: "hashed_password_3",
    preferences: {
      activities: ["adventure", "cultural tours"],
      food: ["thai", "desserts"],
    },
    role: "user",
    sharedTrips: [],
  },
]

const mockTrips = [
  {
    userId: null, // Alice
    tripInfo: {
      origin: "London",
      destination: "Paris",
      travelMode: "driving",
      startDate: new Date("2025-10-01T00:00:00Z"),
      endDate: new Date("2025-10-06T00:00:00Z"),
    },
    originInfo: {
      coordinates: { latitude: 51.5074, longitude: -0.1276 },
      address: "London, UK",
      placeId: "ChIJdd4hrwug2EcRmSrV3Vo6llI",
    },
    destinationInfo: {
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
      address: "Paris, France",
      placeId: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
    },
    itinerary: [
      {
        day: 1,
        activities: [
          {
            category: "sightseeing",
            place: {
              placeId: "eiffel_tower_id",
              name: "Eiffel Tower",
              coordinates: { latitude: 48.8584, longitude: 2.2945 },
              address: "Champ de Mars, Paris",
              summary: "Iconic landmark of Paris",
              rating: 4.7,
              types: ["tourist_attraction", "landmark"],
              url: "https://maps.google.com/?cid=eiffel",
            },
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            category: "museum",
            place: {
              placeId: "louvre_id",
              name: "Louvre Museum",
              coordinates: { latitude: 48.8606, longitude: 2.3376 },
              address: "Rue de Rivoli, Paris",
              summary: "World-famous art museum",
              rating: 4.8,
              types: ["museum", "tourist_attraction"],
              url: "https://maps.google.com/?cid=louvre",
            },
          },
        ],
      },
    ],
    tripPath: {
      overviewPolyline: "encoded_polyline_london_paris",
    },
  },

  {
    userId: null, // Bob
    tripInfo: {
      origin: "Osaka",
      destination: "Tokyo",
      travelMode: "driving",
      startDate: new Date("2025-11-01T00:00:00Z"),
      endDate: new Date("2025-11-08T00:00:00Z"),
    },
    originInfo: {
      coordinates: { latitude: 34.6937, longitude: 135.5023 },
      address: "Osaka, Japan",
      placeId: "ChIJ0w5R5MIYAWARPT8nHTy1x1k",
    },
    destinationInfo: {
      coordinates: { latitude: 35.6762, longitude: 139.6503 },
      address: "Tokyo, Japan",
      placeId: "ChIJ51cu8IcbXWARiRtXIothAS4",
    },
    itinerary: [
      {
        day: 1,
        activities: [
          {
            category: "sightseeing",
            place: {
              placeId: "shibuya_id",
              name: "Shibuya Crossing",
              coordinates: { latitude: 35.6595, longitude: 139.7005 },
              address: "Shibuya, Tokyo",
              summary: "Famous bustling crossing",
              rating: 4.6,
              types: ["tourist_attraction"],
              url: "https://maps.google.com/?cid=shibuya",
            },
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            category: "temple",
            place: {
              placeId: "sensoji_id",
              name: "Senso-ji Temple",
              coordinates: { latitude: 35.7148, longitude: 139.7967 },
              address: "Asakusa, Tokyo",
              summary: "Historic Buddhist temple",
              rating: 4.7,
              types: ["temple", "tourist_attraction"],
              url: "https://maps.google.com/?cid=sensoji",
            },
          },
        ],
      },
    ],
    tripPath: {
      overviewPolyline: "encoded_polyline_osaka_tokyo",
    },
  },

  {
    userId: null, // Charlie
    tripInfo: {
      origin: "Tbilisi",
      destination: "Batumi",
      travelMode: "driving",
      startDate: new Date("2025-12-01T00:00:00Z"),
      endDate: new Date("2025-12-05T00:00:00Z"),
    },
    originInfo: {
      coordinates: { latitude: 41.6938026, longitude: 44.8015168 },
      address: "Tbilisi, Georgia",
      placeId: "ChIJa2JP5tcMREARo25X4u2E0GE",
    },
    destinationInfo: {
      coordinates: { latitude: 41.6460978, longitude: 41.64049 },
      address: "Batumi, Georgia",
      placeId: "ChIJIdKiTjCGZ0ARZ6ku4alTMHo",
    },
    itinerary: [
      {
        day: 1,
        activities: [
          {
            category: "sightseeing",
            place: {
              placeId: "batumi_boulevard_id",
              name: "Batumi Boulevard",
              coordinates: { latitude: 41.65095, longitude: 41.636008 },
              address: "Batumi, Georgia",
              summary: "Scenic seaside promenade",
              rating: 4.5,
              types: ["tourist_attraction", "park"],
              url: "https://maps.google.com/?cid=batumi_boulevard",
            },
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            category: "historical",
            place: {
              placeId: "gonio_fortress_id",
              name: "Gonio Fortress",
              coordinates: { latitude: 41.5862, longitude: 41.5721 },
              address: "Gonio, Georgia",
              summary: "Ancient Roman fortress",
              rating: 4.6,
              types: ["historical", "tourist_attraction"],
              url: "https://maps.google.com/?cid=gonio_fortress",
            },
          },
        ],
      },
    ],
    tripPath: {
      overviewPolyline: "encoded_polyline_tbilisi_batumi",
    },
  },
]

// Function to seed data
async function seedDB() {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Trip.deleteMany({})
    console.log("Cleared existing users and trips")

    // Seed users
    const users = await User.insertMany(mockUsers)
    console.log("TripTickler seeded users!")

    // Assign userIds to trips
    mockTrips[0].userId = users[0]._id // Alice owns London->Paris
    mockTrips[1].userId = users[1]._id // Bob owns Osaka->Tokyo and shared with Charlie
    mockTrips[2].userId = users[2]._id // Charlie owns Tbilisi->Batumi

    // Seed trips
    const trips = await Trip.insertMany(mockTrips)
    console.log("TripTickler seeded trips!")

    // Update users with sharedTrips
    await User.findByIdAndUpdate(users[2]._id, { $push: { sharedTrips: trips[1]._id } }) // Charlie has access to Bob's trip
    console.log("TripTickler updated users with shared trips!")

    await mongoose.connection.close()
    console.log("Database connection closed")
    process.exit(0)
  } catch (err) {
    console.error("Error seeding data:", err.message)
    if (err.code === 11000) {
      console.error("Duplicate key error. Ensure unique fields (e.g., email) are not repeated.")
    }
    process.exit(1)
  }
}

seedDB()
