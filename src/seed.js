import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from './models/User.js';
import Trip from './models/Trip.js';

// Mock data
const mockUsers = [
  {
    name: 'Alice Traveler',
    email: 'alice@example.com',
    passwordHash: 'hashed_password_1',
    preferences: {
      activities: ['sightseeing', 'hiking'],
      food: ['italian', 'sushi'],
    },
    role: 'user',
    sharedTrips: [],
  },
  {
    name: 'Bob Guest',
    email: 'bob@example.com',
    passwordHash: 'hashed_password_2',
    preferences: {
      activities: ['beach', 'swimming'],
      food: ['seafood', 'vegan'],
    },
    role: 'guest',
    sharedTrips: [],
  },
  {
    name: 'Charlie Explorer',
    email: 'charlie@example.com',
    passwordHash: 'hashed_password_3',
    preferences: {
      activities: ['adventure', 'cultural tours'],
      food: ['thai', 'desserts'],
    },
    role: 'user',
    sharedTrips: [],
  },
];

const mockTrips = [
  {
    origin: 'London',
    destination: 'Paris',
    startDate: new Date('2025-10-01T00:00:00Z'),
    endDate: new Date('2025-10-06T00:00:00Z'),
    itinerary: [
      { day: 1, activity: 'Visit Eiffel Tower' },
      { day: 2, activity: 'Louvre Museum tour' },
    ],
    userId: null,
    tripPath: [
      { latitude: 51.5074, longitude: -0.1276 }, // London
      { latitude: 48.8566, longitude: 2.3522 }, // Paris
    ],
  },
  {
    origin: 'Osaka',
    destination: 'Tokyo',
    startDate: new Date('2025-11-01T00:00:00Z'),
    endDate: new Date('2025-11-08T00:00:00Z'),
    itinerary: [
      { day: 1, activity: 'Explore Shibuya Crossing' },
      { day: 2, activity: 'Visit Senso-ji Temple' },
    ],
    userId: null,
    tripPath: [
      { latitude: 34.6937, longitude: 135.5023 }, // Osaka
      { latitude: 35.6762, longitude: 139.6503 }, // Tokyo
    ],
  },
  {
    origin: 'Tbilisi',
    destination: 'Batumi',
    startDate: new Date('2025-12-01T00:00:00Z'),
    endDate: new Date('2025-12-05T00:00:00Z'),
    itinerary: [
      { day: 1, activity: 'Explore Batumi Boulevard' },
      { day: 2, activity: 'Visit Gonio Fortress' },
    ],
    userId: null,
    tripPath: [
      { latitude: 41.6891795, longitude: 44.8036152 },
      { latitude: 41.705254, longitude: 44.8007886 },
      { latitude: 41.8883858, longitude: 44.7075655 },
      { latitude: 41.8797722, longitude: 44.7216991 },
      { latitude: 41.9894518, longitude: 44.1122676 },
      { latitude: 42.0932766, longitude: 43.4228238 },
      { latitude: 42.1003064, longitude: 43.0585155 },
      { latitude: 42.1139902, longitude: 43.0311821 },
      { latitude: 41.8180646, longitude: 41.7745763 }, // Batumi
    ],
  },
];

// Function to seed data
async function seedDB() {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Trip.deleteMany({});
    console.log('Cleared existing users and trips');

    // Seed users
    const users = await User.insertMany(mockUsers);
    console.log('TripTickler seeded users!');

    // Assign userIds to trips
    mockTrips[0].userId = users[0]._id; // Alice owns London->Paris
    mockTrips[1].userId = users[1]._id; // Bob owns Osaka->Tokyo
    mockTrips[2].userId = users[2]._id; // Charlie owns Tbilisi->Batumi

    // Seed trips
    const trips = await Trip.insertMany(mockTrips);
    console.log('TripTickler seeded trips!');

    // Update users with sharedTrips
    await User.findByIdAndUpdate(users[1]._id, { $push: { sharedTrips: trips[0]._id } }); // Bob gets Paris trip
    await User.findByIdAndUpdate(users[2]._id, { $push: { sharedTrips: trips[1]._id } }); // Charlie gets Tokyo trip
    console.log('TripTickler updated users with shared trips!');

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err.message);
    if (err.code === 11000) {
      console.error('Duplicate key error. Ensure unique fields (e.g., email) are not repeated.');
    }
    process.exit(1);
  }
}

seedDB();