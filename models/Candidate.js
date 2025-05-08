const mongoose = require('mongoose');

// Define candidate schema
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // Candidate's name
  votes: { type: Number, default: 0 },  // Initial votes (default to 0)
  image: { type: String },  // URL or path for the candidate's image
});

// Create and export the Candidate model
module.exports = mongoose.model('Candidate', candidateSchema);
