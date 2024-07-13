import connectMongo from  '@/mongoose/mongodbUser'
import Customer from '../../model/customer';

const  handler=async (req, res) =>{
  const { firstName, lastName, email, phone, postalCode, address, date, products } = req.body;

  try {
    const customer = new Customer({
      firstName,
      lastName,
      email,
      phone,
      postalCode,
      address,
      date,
      products,
    });

    await customer.save();
    res.status(200).json({ message: "Customer added successfully!" });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: "Failed to add customer." });
  }
}

export default connectMongo(handler);