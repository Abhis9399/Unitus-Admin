// itemService.js

const mongoose = require('mongoose');
const Item = require('@/model/item').default; // Adjust path to your Item model

// Function to fetch item details by itemId
async function getItemDetails(itemId) {
  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const item = await Item.findById(itemId);

    if (!item) {
      throw new Error('Item not found');
    }

    return {
      id: item._id,
      name: item.name,
      description: item.description,
      // Add more fields as needed
    };
  } catch (error) {
    console.error('Error fetching item details:', error);
    throw error; // Propagate the error to handle it in the caller function
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = {
  getItemDetails,
};
