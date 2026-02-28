const mongoose = require('mongoose');
require('dotenv').config();

console.log('Attempting to connect to MongoDB Atlas...');
console.log('URI:', process.env.MongoDB_URI.replace(/:([^@]+)@/, ':****@')); // Log URI with hidden password

mongoose.connect(process.env.MongoDB_URI)
    .then(() => {
        console.log('Success! Connected to MongoDB Atlas.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB Atlas:');
        console.error('Error Message:', err.message);
        if (err.reason) {
            console.error('Reason:', JSON.stringify(err.reason, null, 2));
        }
        process.exit(1);
    });
