const cron = require('node-cron');
const Supplier = require('../model/supplier'); // Adjust the path based on your structure
const Notification = require('../model/notificationModel'); // Adjust the path based on your structure

// Define the task
cron.schedule('0 0 * * *', async () => { // Runs daily at midnight
    try {
        const suppliers = await Supplier.find(); // Fetch all suppliers
        suppliers.forEach(async (supplier) => {
            // Log notification to the database
            await Notification.create({
                supplierId: supplier._id,
                date: new Date(),
                materialRate: supplier.materialRate,
                vehicleAvailability: supplier.vehicleAvailability
            });
        });
        console.log('Daily notifications created for all suppliers.');
    } catch (error) {
        console.error('Error creating notifications:', error);
    }
});
