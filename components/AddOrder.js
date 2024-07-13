import React, { useState } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddOrder = ({ customerId }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        else if (name === 'quantity') setQuantity(value);
        else if (name === 'price') setPrice(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = { name, quantity, price };

        try {
            const res = await fetch(`/api/customers/${customerId}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!res.ok) {
                const errorResponse = await res.json();
                throw new Error(errorResponse.message || 'Something went wrong!');
            }

            const response = await res.json();
            console.log(response);

            setName('');
            setQuantity('');
            setPrice('');

            toast.success('Order added successfully!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        } catch (error) {
            toast.error(`Error: ${error.message}`, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    };

    return (
        <div className="min-w-screen min-h-screen bg-gray-200 flex items-center justify-center px-5 py-5">
            <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{ maxWidth: '1000px' }}>
                <div className="md:flex w-full">
                    <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                        <div className="text-center mb-10">
                            <h1 className="font-bold text-3xl text-gray-900">Add Order</h1>
                        </div>
                        <form onSubmit={handleSubmit} method="POST">
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5">
                                    <label htmlFor="name" className="text-xs font-semibold px-1">Order Name</label>
                                    <input type="text" onChange={handleChange} id='name' name='name' className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="Order Name" value={name} />
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5">
                                    <label htmlFor="quantity" className="text-xs font-semibold px-1">Quantity</label>
                                    <input type="number" onChange={handleChange} id='quantity' name='quantity' className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="Quantity" value={quantity} />
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5">
                                    <label htmlFor="price" className="text-xs font-semibold px-1">Price</label>
                                    <input type="number" onChange={handleChange} id='price' name='price' className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="Price" value={price} />
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5">
                                    <button type="submit" className="block w-full bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white font-semibold rounded-lg px-3 py-3 mt-4">Add Order</button>
                                </div>
                            </div>
                        </form>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOrder;
