"use client";

import { useEffect, useState } from "react";

export default function EditCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Fetch all customers when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customersgetAll');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data); // Set the fetched customers data
        } else {
          setMessage('Error fetching customer data');
        }
      } catch (error) {
        setMessage('Error fetching customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Handle checkbox changes for attended and orderConfirmed
  const handleCheckboxChange = (index, field) => {
    const updatedCustomers = [...customers];
    updatedCustomers[index][field] = !updatedCustomers[index][field]; // Toggle the value
    setCustomers(updatedCustomers);
  };

  // Handle saving the updated customer data to the backend
  const handleSave = async (phoneNumber, attended, orderConfirmed) => {
    try {
      const res = await fetch('/api/editcustomerstatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,  // Use phoneNumber instead of _id
          attended,
          orderConfirmed,
        }),
      });

      if (res.ok) {
        setMessage('Customer updated successfully');
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('Error: Unable to update customer');
    }

    // Show notification and auto-hide after 3 seconds
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin w-10 h-10 border-4 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 shadow-lg rounded-xl w-full relative">
      <h2 className="text-3xl font-semibold mb-6 text-gray-300">Edit Customers</h2>

      {/* Sliding notification */}
      <div
        className={`fixed top-4 left-0 transform ${
          showNotification ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-500 ease-in-out p-4 rounded-md text-white ${
          message.includes("Error") ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        {message}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse  shadow-md rounded-md">
          <thead className="">
            <tr>
              <th className="px-6 py-3 border text-left text-gray-600">#</th>
              <th className="px-6 py-3 border text-left text-gray-600">Name</th>
              <th className="px-6 py-3 border text-left text-gray-600">Phone Number</th>
              <th className="px-6 py-3 border text-left text-gray-600">Instagram ID</th>
              <th className="px-6 py-3 border text-left text-gray-600">Attended</th>
              <th className="px-6 py-3 border text-left text-gray-600">Order Confirmed</th>
              <th className="px-6 py-3 border text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer._id} className="hover:bg-orange-700 transition-colors">
                <td className="px-6 py-3 border">{index + 1}</td>
                <td className="px-6 py-3 border">{customer.name}</td>
                <td className="px-6 py-3 border">{customer.phoneNumber}</td>
                <td className="px-6 py-3 border">{customer.instagramId || 'N/A'}</td>
                <td className="px-6 py-3 border text-center">
                  <input
                    type="checkbox"
                    checked={customer.attended}
                    onChange={() => handleCheckboxChange(index, 'attended')}
                    className="w-5 h-5"
                  />
                </td>
                <td className="px-6 py-3 border text-center">
                  <input
                    type="checkbox"
                    checked={customer.orderConfirmed}
                    onChange={() => handleCheckboxChange(index, 'orderConfirmed')}
                    className="w-5 h-5"
                  />
                </td>
                <td className="px-6 py-3 border text-center">
                  <button
                    onClick={() =>
                      handleSave(
                        customer.phoneNumber,  // Use phoneNumber instead of _id
                        customer.attended,
                        customer.orderConfirmed
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
