// /app/components/EditCustomers.js
"use client";

import { useEffect, useState } from "react";

export default function EditCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6  shadow-md rounded-md w-full max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Edit Customers</h2>

      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-400">
            <th className="px-4 py-2 border">#</th> {/* Column for serial number */}
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Phone Number</th>
            <th className="px-4 py-2 border">Instagram ID</th>
            <th className="px-4 py-2 border">Attended</th>
            <th className="px-4 py-2 border">Order Confirmed</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer._id}>
              <td className="px-4 py-2 border">{index + 1}</td> {/* Serial number */}
              <td className="px-4 py-2 border">{customer.name}</td>
              <td className="px-4 py-2 border">{customer.phoneNumber}</td>
              <td className="px-4 py-2 border">{customer.instagramId || 'N/A'}</td>
              <td className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={customer.attended}
                  onChange={() => handleCheckboxChange(index, 'attended')}
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={customer.orderConfirmed}
                  onChange={() => handleCheckboxChange(index, 'orderConfirmed')}
                />
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() =>
                    handleSave(
                      customer.phoneNumber,  // Use phoneNumber instead of _id
                      customer.attended,
                      customer.orderConfirmed
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
