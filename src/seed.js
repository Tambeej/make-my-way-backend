import mongoose from 'mongoose';
import connectDB from './config/db';
import User from '../models/User';
import tripSchema from '../models/Trip';
import sharedTripSchema from '../models/SharedTrip';

const mockUsers = [
  {
    name: 'Alice Traveler',
    email: 'alice@example.com',
    passwordHash: 'hashed_password_1', // Replace with bcrypt in production
    user_preferences: ['history', 'food'],
    role: 'user',
  },
  {
    name: 'Bob Guest',
    email: 'bob@example.com',
    passwordHash: 'hashed_password_2',
    user_preferences: ['beach', 'relaxation'],
    role: 'guest',
  },
  {
    name: 'Charlie Explorer',
    email: 'charlie@example.com',
    passwordHash: 'hashed_password_3',
    user_preferences: ['adventure', 'culture'],
    role: 'user',
  },
];

const mockTrips = [
  {
    destination: 'Paris',
    startDate: new Date('2025-10-01T00:00:00Z'),
    endDate: new Date('2025-10-06T00:00:00Z'),
    preferences: ['history', 'food', 'art'],
    itinerary: [
      { day: 1, activity: 'Visit Eiffel Tower' },
      { day: 2, activity: 'Louvre Museum tour' },
    ],
    userId: null, 
  },
  {
    destination: 'Tokyo',
    startDate: new Date('2025-11-01T00:00:00Z'),
    endDate: new Date('2025-11-08T00:00:00Z'),
    preferences: ['culture', 'tech', 'food'],
    itinerary: [
      { day: 1, activity: 'Explore Shibuya Crossing' },
      { day: 2, activity: 'Visit Senso-ji Temple' },
    ],
    userId: null,
  },
  {
    destination: 'Rome',
    startDate: new Date('2025-12-01T00:00:00Z'),
    endDate: new Date('2025-12-05T00:00:00Z'),
    preferences: ['history', 'food'],
    itinerary: [
      { day: 1, activity: 'Visit Colosseum' },
      { day: 2, activity: 'Tour Vatican City' },
    ],
    userId: null,
  },
];

const mockSharedTrips = [
  {
    sharedWithUserId: null, 
    tripId: null, 
  },
  {
    sharedWithUserId: null, 
    tripId: null, 
  },
];

async function seedDB() {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Trip.deleteMany({});
    await SharedTrip.deleteMany({});
    console.log('Cleared existing users, trips, and shared trips');

    // Seed users
    const users = await User.insertMany(mockUsers);
    console.log('TripTickler seeded users!');

    // Assign userIds to trips
    mockTrips[0].userId = users[0]._id; // Alice owns Paris trip
    mockTrips[1].userId = users[1]._id; // Bob owns Tokyo trip
    mockTrips[2].userId = users[2]._id; // Charlie owns Rome trip

    // Seed trips
    const trips = await Trip.insertMany(mockTrips);
    console.log('TripTickler seeded trips!');

    // Assign IDs to shared trips
    mockSharedTrips[0].sharedWithUserId = users[1]._id; // Share with Bob
    mockSharedTrips[0].tripId = trips[0]._id; // Paris trip
    mockSharedTrips[1].sharedWithUserId = users[2]._id; // Share with Charlie
    mockSharedTrips[1].tripId = trips[1]._id; // Tokyo trip

    // Seed shared trips
    await SharedTrip.insertMany(mockSharedTrips);
    console.log('TripTickler seeded shared trips!');

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedDB();