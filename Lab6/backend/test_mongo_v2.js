const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection to:', process.env.MongoDB_URI.split('@')[1]);

mongoose.connect(process.env.MongoDB_URI, {
    serverSelectionTimeoutMS: 5000 // 5 seconds instead of 30
})
    .then(() => {
        console.log('SUCCESS');
        process.exit(0);
    })
    .catch((err) => {
        console.error('ERROR_START');
        console.error(err.toString());
        console.error('ERROR_END');
        process.exit(1);
    });
