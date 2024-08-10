const mongoose = require('mongoose');
const Order =require('../admin-dashboard-nextjs/model/order'); // Adjust the path based on your project structure

// Connect to your MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL_USER,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const updateOrders = async () => {
  try {
    const orders = await Order.find(); // Fetch all orders

    for (let order of orders) {
      let finalAmount = 0;

      // Recalculate the finalAmount based on the new logic
      order.subProducts.forEach(subProduct => {
        finalAmount += order.totalPrice * 1.18 * subProduct.quantity;
      });

      // Update the finalAmount field
      order.finalAmount = finalAmount;

      // Save the updated order back to the database
      await order.save();
    }

    console.log('Orders updated successfully');
  } catch (err) {
    console.error('Error updating orders:', err);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};

// Run the script
connectDB().then(updateOrders);
