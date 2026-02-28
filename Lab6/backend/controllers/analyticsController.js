const Clothes = require('../models/clothesModel');

exports.wardrobeAnalytics = async (req, res) => {
    try {
        // Fetch all clothes (no user field exists)
        const clothes = await Clothes.find();

        // Date for 1 year ago
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Most-used items (wearCount >= 7 per Lab specifications)
        const mostUsed = clothes.filter(item => item.wearCount >= 7);

        // Least-used items
        const leastUsed = clothes.filter(item =>
            item.wearCount <= 2 ||
            (item.lastWorn && item.lastWorn <= oneYearAgo)
        );

        // Donation suggestions (do NOT delete)
        const donationSuggestions = leastUsed.filter(
            item => item.status === 'active'
        );

        // Category Distribution
        const categoryDistribution = {};
        clothes.forEach(item => {
            const cat = item.category || 'Uncategorized';
            categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            totalItems: clothes.length,
            categoryDistribution,
            mostUsed,
            leastUsed,
            donationSuggestions
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error generating wardrobe analytics'
        });
    }
};
