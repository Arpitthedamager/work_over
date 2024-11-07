"use client";
import { signOut, useSession} from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // This works only in the 'app' directory

export default function user_dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Using 'useRouter' from 'next/navigation'

  const [customers, setCustomers] = useState([]);
  
  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error(err));
  }, []);
  // Redirect if not admin (useEffect to handle side effects)
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

  const handleAttend = async (client) => {
    // Update client status logic
    client.attended = !client.attended;
    // Update in MongoDB (optional, add a PATCH API if needed)
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customers List</h1><button onClick={signOut}>sign Out</button>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 py-2">Name</th>
            <th className="w-1/4 py-2">Phone Number</th>
            <th className="w-1/4 py-2">Instagram ID</th>
            <th className="w-1/4 py-2">Attended</th>
            <th className="w-1/4 py-2">Order Confirmed</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td className="border px-4 py-2">{customer.name}</td>
              <td className="border px-4 py-2">{customer.phoneNumber}</td>
              <td className="border px-4 py-2">{customer.instagramId}</td>
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  checked={customer.attended}
                  readOnly
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  checked={customer.orderConfirmed}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
