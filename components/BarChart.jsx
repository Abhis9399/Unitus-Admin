import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getWeekRange = (date) => {
  const currentDate = new Date(date);
  const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
  
  return {
    start: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    end: lastDayOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  };
};

const BarChart = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const orders = response.data;

        // Process the data to calculate daily revenue
        const revenueByDay = orders.reduce((acc, order) => {
          const orderDate = new Date(order.createdAt);
          const day = orderDate.toLocaleString('en-US', { weekday: 'short' });

          if (!acc[day]) {
            acc[day] = 0;
          }
          acc[day] += order.totalPrice;

          return acc;
        }, {});

        // Sort the data by days of the week
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const sortedRevenueByDay = daysOfWeek.map(day => revenueByDay[day] || 0);

        const currentWeekRange = getWeekRange(new Date());

        setWeekRange(currentWeekRange);

        setChartData({
          labels: daysOfWeek,
          datasets: [
            {
              label: "Sales $",
              data: sortedRevenueByDay,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.4)",
            },
          ],
        });

        setChartOptions({
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: {
                  size: 14,
                  weight: 'bold'
                },
                color: 'rgb(75, 85, 99)'
              }
            },
            title: {
              display: true,
              text: `Daily Revenue (${currentWeekRange.start} - ${currentWeekRange.end})`,
              font: {
                size: 18,
                weight: 'bold'
              },
              color: 'rgb(31, 41, 55)'
            },
          },
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            x: {
              ticks: {
                font: {
                  size: 12,
                },
                color: 'rgb(75, 85, 99)'
              },
              grid: {
                display: false
              }
            },
            y: {
              ticks: {
                font: {
                  size: 12,
                },
                color: 'rgb(75, 85, 99)'
              },
              grid: {
                color: 'rgb(229, 231, 235)'
              }
            }
          }
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-6 border rounded-lg bg-white shadow-md shadow-blue-900">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarChart;
