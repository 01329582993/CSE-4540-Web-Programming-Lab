const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT || 3000;



app.use(express.json()); //allows your application to read and parse JSON data sent in the request body.


// Routes
const userRoutes = require('./routes/userRoutes');
const clothesRoutes = require('./routes/clothesRoutes');
const accessoriesRoutes = require('./routes/accessoriesRoutes');
const outfitRoutes = require('./routes/outfitRoutes');
const laundryRoutes = require('./routes/laundryRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/users', userRoutes);
app.use('/api/clothes', clothesRoutes);
app.use('/api/accessories', accessoriesRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/laundry', laundryRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to StyleSync API! The server is running and connected.');
});

//monngodb connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MongoDB_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});



