"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserList from "../components/userlist/UserList";
import AddCustomer from "../components/addcostumer/AddCustomer";
import AddBulkCustomers from "../components/addbulkcostumer/AddBulkcustomer";
import CustomerTable from "../components/customertable/CustomerTable";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // States to toggle visibility of AddCustomer, AddBulkCustomers, and CustomerTable
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddBulkCustomers, setShowAddBulkCustomers] = useState(false);
  const [showCustomerTable, setShowCustomerTable] = useState(false); // Add state for CustomerTable visibility

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session || session.user.role !== "admin") {
      router.push("/"); // Redirect to home if not an admin
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <button
          onClick={signOut}
          className="px-4 py-2 ml-4 bg-red-500 text-white rounded-md mb-6"
        >
          Sign out
        </button>
      </div>

      {/* User List */}
      <UserList />

      {/* Toggle Button and Form for AddCustomer */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddCustomer(!showAddCustomer)} // Toggle visibility
          className="px-4 py-2 mt-4 text-white rounded-md"
        >
          {showAddCustomer ? "Hide Add Customer Form ^" : "Show Add Customer Form ^"}
        </button>
        {showAddCustomer && <AddCustomer />} {/* Only show the form when toggled */}
      </div>

      {/* Toggle Button and Form for AddBulkCustomers */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddBulkCustomers(!showAddBulkCustomers)} // Toggle visibility
          className="px-4 py-2 text-white rounded-md"
        >
          {showAddBulkCustomers ? "Hide Add Bulk Customers Form ^" : "Show Add Bulk Customers Form ^"}
        </button>
        {showAddBulkCustomers && <AddBulkCustomers />} {/* Only show the form when toggled */}
      </div>

      {/* Toggle Button for CustomerTable */}
      <div className="mb-6">
        <button
          onClick={() => setShowCustomerTable(!showCustomerTable)} // Toggle visibility of CustomerTable
          className="px-4 py-2 text-white rounded-md"
        >
          {showCustomerTable ? "Hide all Customer Table ^" : "Show all Customer Table ^"}
        </button>
        {showCustomerTable && <CustomerTable />} {/* Only show the table when toggled */}
      </div>
    </div>
  );
}
