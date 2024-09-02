import { useEffect, useState } from 'react';
import axios from 'axios';

const formatValue = (value) => {
  if (value && typeof value === 'object' && value.$numberDecimal) {
    return parseFloat(value.$numberDecimal);
  }
  return value;
};

const applyPercentageIncrease = (value, percentage) => {
  return value * (1 + percentage / 100);
};

const SupplierDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const res = await axios.get('/api/admin/supplier-data');
        const formattedData = {
          ...res.data,
          bestRate: {
            ...res.data.bestRate,
            supplier: {
              ...res.data.bestRate.supplier,
              dailyPrice: applyPercentageIncrease(formatValue(res.data.bestRate.supplier.dailyPrice), 3), // Apply 3% increase
              dailyCapacity: formatValue(res.data.bestRate.supplier.dailyCapacity),
            },
          },
          bestAvailability: {
            ...res.data.bestAvailability,
            supplier: {
              ...res.data.bestAvailability.supplier,
              dailyPrice: formatValue(res.data.bestAvailability.supplier.dailyPrice),
              dailyCapacity: formatValue(res.data.bestAvailability.supplier.dailyCapacity),
            },
          },
          suppliers: res.data.suppliers.map(supplier => ({
            ...supplier,
            dailyPrice: formatValue(supplier.dailyPrice),
            dailyCapacity: formatValue(supplier.dailyCapacity),
          })),
        };
        setData(formattedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
        setError('Failed to fetch supplier data. Please try again later.');
      }
    };

    fetchSupplierData();
  }, []);

  const downloadCSV = () => {
    if (!data) return;

    const csvRows = [];
    const headers = ['Supplier', 'Price', 'Availability', 'Material Type'];
    csvRows.push(headers.join(','));

    data.suppliers.forEach(supplier => {
      const row = [
        supplier.representativeName,
        supplier.dailyPrice,
        supplier.dailyCapacity,
        supplier.materialType
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = `data:text/csv;charset=utf-8,${csvRows.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'supplier_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!data) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
        >
          Download CSV
        </button>
      </div>

      <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Best Rate</h2>
        {data.bestRate.supplier ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg shadow-inner">
              <p className="text-lg font-semibold text-gray-800">Supplier: {data.bestRate.supplier.representativeName}</p>
              <p className="text-lg text-gray-700">Price: <span className="font-bold text-green-700">{data.bestRate.supplier.dailyPrice}</span></p>
              <p className="text-lg text-gray-700">Material Type: <span className="font-medium text-gray-600">{data.bestRate.supplier.materialType}</span></p>
              <p className="text-lg text-gray-700">Availability: <span className="font-bold text-green-700">{data.bestRate.supplier.dailyCapacity}</span></p>
              <p className="text-lg text-gray-600">{data.bestRate.message}</p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600">No data available for best rate.</p>
        )}
      </div>

      <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Best Availability</h2>
        {data.bestAvailability.supplier ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg shadow-inner">
              <p className="text-lg font-semibold text-gray-800">Supplier: {data.bestAvailability.supplier.representativeName}</p>
              <p className="text-lg text-gray-700">Availability: <span className="font-bold text-yellow-700">{data.bestAvailability.supplier.dailyCapacity}</span></p>
              <p className="text-lg text-gray-700">Material Type: <span className="font-medium text-gray-600">{data.bestAvailability.supplier.materialType}</span></p>
              <p className="text-lg text-gray-700">Price: <span className="font-bold text-yellow-700">{data.bestAvailability.supplier.dailyPrice}</span></p>
              <p className="text-lg text-gray-600">{data.bestAvailability.message}</p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600">No data available for best availability.</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">All Suppliers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.suppliers.map(supplier => (
              <tr key={supplier._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{supplier.representativeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{supplier.dailyPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{supplier.dailyCapacity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{supplier.materialType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierDashboard;
