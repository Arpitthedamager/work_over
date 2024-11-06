"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    }
    fetchClients();
  }, []);

  const handleAttend = async (client) => {
    // Update client status logic
    client.attended = !client.attended;
    // Update in MongoDB (optional, add a PATCH API if needed)
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Client List</h1>
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
