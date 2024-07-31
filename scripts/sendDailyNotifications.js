import twilio from 'twilio';
import mongoose from 'mongoose';
import Supplier from '../models/supplierModel';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendDailyNotifications = async () => {
  await mongoose.connect(process.env.MONGODB_URL_USER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const suppliers = await Supplier.find({});
  const message = "Good morning! Please enter today's price and vehicle availability in the format: Price:XX, Capacity:YY, Material:ZZ. Reply to this message.";

  suppliers.forEach(supplier => {
    client.messages.create({
      from: `whatsapp:${process.env.TWILIO_FROM_NUMBER}`,
      to: `whatsapp:${supplier.contact}`,
      body: message
    })
    .then(message => console.log(`Message sent to ${supplier.phone}`))
    .catch(err => console.error(err));
  });
};

sendDailyNotifications();
