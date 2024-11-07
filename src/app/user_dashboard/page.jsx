"use client";
import { signOut, useSession} from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // This works only in the 'app' directory

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter(); // Using 'useRouter' from 'next/navigation'

  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    }
    fetchClients();
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Client List</h1>
      <button onClick={signOut}>sign out</button>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Instagram</th>
            <th className="border p-2">Attend</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index}>
              <td className="border p-2">{client.name}</td>
              <td className="border p-2">
                {client.number}
                <button
                  className="ml-2 text-blue-500"
                  onClick={() => navigator.clipboard.writeText(client.number)}
                >
                  Copy
                </button>
              </td>
              <td className="border p-2">
                <a
                  href={`https://instagram.com/${client.instagram}`}
                  target="_blank"
                  className="text-blue-500"
                >
                  Instagram
                </a>
              </td>
              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={client.attended || false}
                  onChange={() => handleAttend(client)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
