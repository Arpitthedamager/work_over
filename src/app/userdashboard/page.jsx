"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // This works only in the 'app' directory
import EditCustomers from "../components/editcustomer/EditCustomer";
import New from "../components/new/New";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Using 'useRouter' from 'next/navigation'

  useEffect(() => {
    if (status === "loading") {
      return; // Wait until loading is finished
    }

    if (!session || session.user.role !== "user") {
      router.push("/"); // Navigate to home if the user is not an admin
    }
  }, [status, session, router]); // Dependency array to track changes

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <div className="justify-between flex">
        <h1 className="text-2xl font-bold mb-4">Welcome to your dashboard,</h1>
        <button onClick={signOut} className="p-2 bg-red-600 rounded-lg">Sign Out</button>
      </div>

      {/* Conditionally check for session before rendering user name */}
      {session && session.user && (
        <h1 className="text-2xl">Customers List: {session.user.name}</h1>
      )}

      <EditCustomers />
      {/* <New/> */}
    </div>
  );
}
