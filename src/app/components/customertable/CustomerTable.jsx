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
  });

  // Fetch customer data when component is mounted
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
          setCustomers(data); // Set all customers
          setFilteredCustomers(data); // Set initially to all customers
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

  // Filter customers based on selected filters
  const applyFilters = () => {
    let filteredData = customers;

    if (filters.orderConfirmed) {
      filteredData = filteredData.filter((customer) => customer.orderConfirmed);
    }

    if (filters.attended) {
      filteredData = filteredData.filter((customer) => customer.attended);
    }

    setFilteredCustomers(filteredData);
  };

  // Toggle visibility of filter options on hover or click
  const handleFilterToggle = () => {
    setFilterOptionsVisible(!filterOptionsVisible);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg mt-6">
      {/* Filter button with hover and click dropdown */}
      <div
        className="relative float-left mb-4"
        onMouseEnter={() => setFilterOptionsVisible(true)} // Show on hover
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Full Customer Table</h2>
          <button
            onClick={handleFilterToggle} // Toggle on click
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Filter Options
          </button>
        </div>

        {/* Sliding dropdown with filter options */}
        {filterOptionsVisible && (
          <div className="absolute top-full mt-2 left-0 w-48 bg-white border text-gray-600 border-gray-200 shadow-md rounded-md z-10">
            <div className="p-2">
              <label className="block">
                <input
                  type="checkbox"
                  checked={filters.orderConfirmed}
                  onChange={(e) =>
                    setFilters({ ...filters, orderConfirmed: e.target.checked })
                  }
                  className="mr-2"
                />
                Order Confirmed
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  checked={filters.attended}
                  onChange={(e) =>
                    setFilters({ ...filters, attended: e.target.checked })
                  }
                  className="mr-2"
                />
                Attended
              </label>
              <button
                onClick={applyFilters}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md w-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table with scrollbar and height set to 44 */}
      <div className="h-64 mt-20 overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="">
            <tr className="border-4">
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Phone Number</th>
              <th className="px-4 py-2 border text-left">Instagram ID</th>
              <th className="px-4 py-2 border text-left">Attended</th>
              <th className="px-4 py-2 border text-left">Order Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr key={index} className="hover:bg-orange-800">
                <td className="px-4 py-2 border-b">{customer.name}</td>
                <td className="px-4 py-2 border-b">{customer.phoneNumber}</td>
                <td className="px-4 py-2 border-b">{customer.instagramId}</td>
                <td className="px-4 py-2 border-b">
                  {customer.attended ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2 border-b">
                  {customer.orderConfirmed ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
