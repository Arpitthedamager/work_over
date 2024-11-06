"use client";
import { useState } from "react";

export default function Admin() {
  const [clientData, setClientData] = useState({
    name: "",
    number: "",
    area: "",
    category: "",
    instagram: "",
  });

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });
    if (res.ok) {
      alert("Client data uploaded!");
      setClientData({ name: "", number: "", area: "", category: "", instagram: "" });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={clientData.name}
          onChange={handleChange}
          placeholder="Client Name"
          className="w-full border p-2 mb-4"
        />
        <input
          name="number"
          value={clientData.number}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-2 mb-4"
        />
        <input
          name="area"
          value={clientData.area}
          onChange={handleChange}
          placeholder="Area"
          className="w-full border p-2 mb-4"
        />
        <input
          name="category"
          value={clientData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-2 mb-4"
        />
        <input
          name="instagram"
          value={clientData.instagram}
          onChange={handleChange}
          placeholder="Instagram ID"
          className="w-full border p-2 mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}
