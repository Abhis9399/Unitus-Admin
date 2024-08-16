// services/shipdayService.js
import axios from 'axios';

const shipdayApiBaseUrl = 'https://api.shipday.com/v1';

const shipdayService = axios.create({
  baseURL: shipdayApiBaseUrl,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SHIPDAY}`,
    'Content-Type': 'application/json',
  },
});

export const getOrderTracking = async (shipdayOrderId) => {
  try {
    const response = await shipdayService.get(`/orders/${shipdayOrderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order tracking from Shipday:', error);
    throw error;
  }
};
