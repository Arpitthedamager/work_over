"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CustomerTable() {
  const { data: session, status } = useSession();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);
  const [filters, setFilters] = useState({
    orderConfirmed: false,
    attended: false,
    declined: false, // New filter for declined status
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers", {
          headers: {
            "x-admin-email": session.user.name, // Send the admin email in the request header
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
          setFilteredCustomers(data);
        } else {
          setError("Failed to fetch customer data.");
        }
      } catch (error) {
        setError("An error occurred while fetching customer data.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchCustomers();
    }
  }, [status, session]);

  const deleteCustomer = async (customerId) => {
    try {
      const res = await fetch(`/api/customers`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": session.user.name,
        },
        body: JSON.stringify({ customerId }),
      });

      if (res.ok) {
        const updatedCustomers = customers.filter((customer) => customer._id !== customerId);
        setCustomers(updatedCustomers);
        setFilteredCustomers(updatedCustomers);

        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        setError("Failed to delete customer.");
      }
    } catch (error) {
      setError("An error occurred while deleting customer.");
    }
  };

  const applyFilters = () => {
    let filteredData = customers;

    if (filters.orderConfirmed) {
      filteredData = filteredData.filter((customer) => customer.orderConfirmed);
    }

    if (filters.attended) {
      filteredData = filteredData.filter((customer) => customer.attended);
    }

    if (filters.declined) {
      filteredData = filteredData.filter((customer) => customer.declined);
    }

    setFilteredCustomers(filteredData);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg mt-6">
      {showSuccessMessage && (
        <div
          className={`fixed top-10 left-0 bg-green-500 text-white py-2 px-4 rounded-md shadow-md transform transition-transform duration-500 ease-in-out ${showSuccessMessage ? "translate-x-0" : "-translate-x-full"}`}
        >
          Customer deleted successfully!
        </div>
      )}

      <h2 className="text-2xl mb-4">Customer List</h2>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setFilterOptionsVisible(!filterOptionsVisible)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Filter Options
        </button>

        {filterOptionsVisible && (
          <div className="absolute mt-60 left-0 w-48 bg-white border text-gray-600 border-gray-200 shadow-md rounded-md z-10">
            <div className="p-2">
              <label className="block">
                <input
                  type="checkbox"
                  checked={filters.orderConfirmed}
                  onChange={(e) => setFilters({ ...filters, orderConfirmed: e.target.checked })}
                  className="mr-2"
                />
                Order Confirmed
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  checked={filters.attended}
                  onChange={(e) => setFilters({ ...filters, attended: e.target.checked })}
                  className="mr-2"
                />
                Attended
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  checked={filters.declined}
                  onChange={(e) => setFilters({ ...filters, declined: e.target.checked })}
                  className="mr-2"
                />
                Declined
              </label>
              <button onClick={applyFilters} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md w-full">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-64 mt-20 overflow-auto overflow-x-hidden">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-4">
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Phone Number</th>
              <th className="px-4 py-2 border text-left">Instagram ID</th>
              <th className="px-4 py-2 border text-left">Attended</th>
              <th className="px-4 py-2 border text-left">Order Confirmed</th>
              <th className="px-4 py-2 border text-left">Declined</th>
              <th className="px-4 py-2 border text-left">Attended Updated By</th>
              <th className="px-4 py-2 border text-left">Attended Updated At</th>
              <th className="px-4 py-2 border text-left">Order Confirmed Updated By</th>
              <th className="px-4 py-2 border text-left">Order Confirmed Updated At</th>
              <th className="px-4 py-2 border text-left">Declined Updated By</th>
              <th className="px-4 py-2 border text-left">Declined Updated At</th>
              <th className="px-4 py-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id} className="hover:bg-orange-800">
                <td className="px-4 py-2 border-b">{customer.name}</td>
                <td className="px-4 py-2 border-b">{customer.phoneNumber}</td>
                <td className="px-4 py-2 border-b">{customer.instagramId}</td>
                <td className="px-4 py-2 border-b">{customer.attended ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border-b">{customer.orderConfirmed ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border-b">{customer.declined ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border-b">{customer.attendedUpdatedBy || "N/A"}</td>
                <td className="px-4 py-2 border-b">{customer.attendedUpdatedAt ? new Date(customer.attendedUpdatedAt).toLocaleString() : "N/A"}</td>
                <td className="px-4 py-2 border-b">{customer.orderConfirmedUpdatedBy || "N/A"}</td>
                <td className="px-4 py-2 border-b">{customer.orderConfirmedUpdatedAt ? new Date(customer.orderConfirmedUpdatedAt).toLocaleString() : "N/A"}</td>
                <td className="px-4 py-2 border-b">{customer.declinedUpdatedBy || "N/A"}</td>
                <td className="px-4 py-2 border-b">{customer.declinedUpdatedAt ? new Date(customer.declinedUpdatedAt).toLocaleString() : "N/A"}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => deleteCustomer(customer._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Delete
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
