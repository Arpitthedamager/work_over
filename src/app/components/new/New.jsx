"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Import for session to get user role

export default function New() {
  const { data: session } = useSession(); // Get session data to identify the user role
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    phoneNumber: "",
    attended: false,
    orderConfirmed: false,
  });

  // Fetch customers when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customersgetAll");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
          setFilteredCustomers(data);
        } else {
          setMessage("Error fetching customer data");
        }
      } catch (error) {
        setMessage("Error fetching customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (index, field) => {
    const updatedCustomers = [...customers];
    updatedCustomers[index][field] = !updatedCustomers[index][field];
    setCustomers(updatedCustomers);
  };

  // Handle save
  const handleSave = async (phoneNumber, attended, orderConfirmed) => {
    try {
      const res = await fetch("/api/editcustomerstatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          attended,
          orderConfirmed,
        }),
      });

      if (res.ok) {
        setMessage("Customer updated successfully");
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("Error: Unable to update customer");
    }

    // Show notification and auto-hide after 3 seconds
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = customers;

      if (filters.name) {
        filtered = filtered.filter((customer) =>
          customer.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.phoneNumber) {
        filtered = filtered.filter((customer) =>
          customer.phoneNumber.includes(filters.phoneNumber)
        );
      }

      if (filters.attended) {
        filtered = filtered.filter((customer) => customer.attended);
      }

      if (filters.orderConfirmed) {
        filtered = filtered.filter((customer) => customer.orderConfirmed);
      }

      setFilteredCustomers(filtered);
    };

    applyFilters();
  }, [filters, customers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin w-10 h-10 border-4 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 shadow-lg rounded-xl w-full relative">
      {/* Sliding notification */}
      <div
        className={`fixed top-4 left-0 transform ${
          showNotification ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out p-4 rounded-md text-white ${
          message.includes("Error") ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {message}
      </div>

      {/* Filter section */}
      <div className="mb-6 space-y-4">
        <h2 className="text-xl font-bold">Filter Customers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={filters.name}
            onChange={(e) =>
              setFilters({ ...filters, name: e.target.value })
            }
            className="p-2 border rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={filters.phoneNumber}
            onChange={(e) =>
              setFilters({ ...filters, phoneNumber: e.target.value })
            }
            className="p-2 border rounded-md w-full"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.attended}
              onChange={() =>
                setFilters({ ...filters, attended: !filters.attended })
              }
            />
            <span>Attended</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.orderConfirmed}
              onChange={() =>
                setFilters({
                  ...filters,
                  orderConfirmed: !filters.orderConfirmed,
                })
              }
            />
            <span>Order Confirmed</span>
          </label>
        </div>
      </div>

      {/* Customer Cards (Mobile-friendly design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <div
            key={customer._id}
            className="border p-4 rounded-lg shadow-lg flex flex-col space-y-4"
          >
            <h3 className="font-bold text-lg">{customer.name}</h3>
            <p>Phone Number: {customer.phoneNumber}</p>
            <p>Instagram ID: {customer.instagramId || "N/A"}</p>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customer.attended}
                  onChange={() => handleCheckboxChange(index, "attended")}
                  disabled={
                    customer.attended && session?.user.role !== "admin"
                  }
                  className="w-5 h-5"
                />
                <span>Attended</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customer.orderConfirmed}
                  onChange={() =>
                    handleCheckboxChange(index, "orderConfirmed")
                  }
                  disabled={
                    customer.orderConfirmed && session?.user.role !== "admin"
                  }
                  className="w-5 h-5"
                />
                <span>Order Confirmed</span>
              </label>
            </div>

            <button
              onClick={() =>
                handleSave(
                  customer.phoneNumber,
                  customer.attended,
                  customer.orderConfirmed
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all"
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
