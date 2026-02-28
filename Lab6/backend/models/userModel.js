const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    stylePreferences: [{ type: String, enum: ['minimalist', 'comfortable', 'formal'] }],
    profilePicture: {
    url: String,
    public_id: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('StyleSyncUser', userSchema);
