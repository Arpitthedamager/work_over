"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function EditCustomers() {
  const { data: session } = useSession(); // Get session
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState({}); // Track expanded state for each customer
  const [filters, setFilters] = useState({
    name: "",
    phoneNumber: "",
    attended: false,
    orderConfirmed: false,
    declined: false, // Added declined filter
  });

  const currentUser = session?.user?.name || "Unknown User"; // Use email instead of name for matching
  const isAdmin = session?.user?.role === "admin"; // Check if the user is an admin

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

    // If both 'attended', 'orderConfirmed', and 'declined' are unchecked, anyone can modify
    if (
      !updatedCustomers[index].attended &&
      !updatedCustomers[index].orderConfirmed &&
      !updatedCustomers[index].declined
    ) {
      updatedCustomers[index][field] = !updatedCustomers[index][field];
      setCustomers(updatedCustomers);
      return;
    }

    // If user is admin, they can bypass the restrictions and modify any data
    if (isAdmin) {
      updatedCustomers[index][field] = !updatedCustomers[index][field];

      // Disable "Order Confirmed" and "Declined" if "Attended" is unchecked
      if (field === "attended" && !updatedCustomers[index][field]) {
        updatedCustomers[index].orderConfirmed = false;
        updatedCustomers[index].declined = false;
      }

      // If "Order Confirmed" is checked, uncheck "Declined" and vice versa
      if (field === "orderConfirmed" && updatedCustomers[index][field]) {
        updatedCustomers[index].declined = false;
      } else if (field === "declined" && updatedCustomers[index][field]) {
        updatedCustomers[index].orderConfirmed = false;
      }

      setCustomers(updatedCustomers);
      return;
    }

    // Prevent modification if not the last updater
    if (
      (field === "attended" &&
        updatedCustomers[index].attendedUpdatedBy !== currentUser) ||
      (field === "orderConfirmed" &&
        updatedCustomers[index].orderConfirmedUpdatedBy !== currentUser) ||
      (field === "declined" &&
        updatedCustomers[index].declinedUpdatedBy !== currentUser)
    ) {
      setMessage(
        `You can only modify the ${field} field if you were the last one to update it.`
      );
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    // Proceed with toggling the checkbox if the user is allowed to modify
    updatedCustomers[index][field] = !updatedCustomers[index][field];

    // Disable "Order Confirmed" and "Declined" if "Attended" is unchecked
    if (field === "attended" && !updatedCustomers[index][field]) {
      updatedCustomers[index].orderConfirmed = false;
      updatedCustomers[index].declined = false;
    }

    // If "Order Confirmed" is checked, uncheck "Declined" and vice versa
    if (field === "orderConfirmed" && updatedCustomers[index][field]) {
      updatedCustomers[index].declined = false;
    } else if (field === "declined" && updatedCustomers[index][field]) {
      updatedCustomers[index].orderConfirmed = false;
    }

    setCustomers(updatedCustomers);
  };

  // Handle save
  const handleSave = async (
    phoneNumber,
    attended,
    orderConfirmed,
    declined
  ) => {
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
          declined,
          updatedBy: currentUser, // Use the session's email as the updatedBy value
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

  // Toggle expanded details for a specific customer
  const toggleDetails = (index) => {
    setExpandedDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the specific customer details
    }));
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

      if (filters.declined) {
        filtered = filtered.filter((customer) => customer.declined);
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
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Filter Customers</h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="p-2 border rounded-md w-full sm:w-auto flex-1"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={filters.phoneNumber}
            onChange={(e) =>
              setFilters({ ...filters, phoneNumber: e.target.value })
            }
            className="p-2 border rounded-md w-full sm:w-auto flex-1"
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
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.declined}
              onChange={() =>
                setFilters({ ...filters, declined: !filters.declined })
              }
            />
            <span>Declined</span>
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

            <div className="flex space-x-2">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={customer.attended}
                    onChange={() => handleCheckboxChange(index, "attended")}
                    className="w-4 h-4"
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
                    disabled={!customer.attended} // Disable if "Attended" is unchecked
                    className="w-4 h-4"
                  />
                  <span>Order Confirmed</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={customer.declined}
                    onChange={() => handleCheckboxChange(index, "declined")}
                    disabled={!customer.attended} // Disable if "Attended" is unchecked
                    className="w-4 h-4"
                  />
                  <span>Declined</span>
                </label>
              </div>
            </div>
            {/* Show Details button - visible only if currentUser is the one who updated */}
            {(currentUser === customer.attendedUpdatedBy ||
              currentUser === customer.orderConfirmedUpdatedBy ||
              currentUser === customer.declinedUpdatedBy ||
              isAdmin) && (
              <button
                onClick={() => toggleDetails(index)}
                className="text-blue-500 flex items-center space-x-2"
              >
                <span>
                  {expandedDetails[index] ? "Hide Details" : "Show Details"}
                </span>
                <span>{expandedDetails[index] ? "▲" : "▼"}</span>
              </button>
            )}

            {/* Conditional rendering for update detail */}
            {expandedDetails[index] && (
              <>
                {customer.attendedUpdatedBy && (
                  <p>
                    <strong>Attended Updated By:</strong>{" "}
                    {customer.attendedUpdatedBy}
                  </p>
                )}
                {customer.attendedUpdatedAt && (
                  <p>
                    <strong>Attended Updated At:</strong>{" "}
                    {new Date(customer.attendedUpdatedAt).toLocaleString()}
                  </p>
                )}

                {customer.orderConfirmedUpdatedBy && (
                  <p>
                    <strong>Order Confirmed Updated By:</strong>{" "}
                    {customer.orderConfirmedUpdatedBy}
                  </p>
                )}
                {customer.orderConfirmedUpdatedUpdatedAt && (
                  <p>
                    <strong>Order Confirmed Updated At:</strong>{" "}
                    {new Date(
                      customer.orderConfirmedUpdatedAt
                    ).toLocaleString()}
                  </p>
                )}

                {customer.declinedUpdatedBy && (
                  <p>
                    <strong>Declined By:</strong> {customer.declinedUpdatedBy}
                  </p>
                )}
                {customer.declinedUpdatedAt && (
                  <p>
                    <strong>Declined At:</strong>{" "}
                    {new Date(customer.declinedUpdatedAt).toLocaleString()}
                  </p>
                )}
              </>
            )}

            {/* Save Button */}
            <button
              onClick={() =>
                handleSave(
                  customer.phoneNumber,
                  customer.attended,
                  customer.orderConfirmed,
                  customer.declined
                )
              }
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
