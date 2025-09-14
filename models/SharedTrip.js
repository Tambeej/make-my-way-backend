const mongoose = require('mongoose');

const sharedTripSchema = new mongoose.Schema({
  sharedWithUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  sharedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SharedTrip', sharedTripSchema);
