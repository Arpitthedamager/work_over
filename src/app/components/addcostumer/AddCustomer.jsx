"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AddCustomer() {
  const { data: session } = useSession(); // Retrieve session data
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    instagramId: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To capture error messages

  // Validate form data before submission
  const validateForm = () => {
    const { name, phoneNumber, instagramId } = formData;
    if (!name || !phoneNumber || !instagramId) {
      return "All fields are required!";
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!session || !session.user || !session.user.name) {
      setErrorMessage("Error: Unable to retrieve admin email from session.");
      return;
    }

    try {
      const res = await fetch("/api/addcustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email: session.user.name, // Get the email from the session directly
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage("Customer added successfully!");
        setFormData({ name: "", phoneNumber: "", instagramId: "" }); // Reset form fields
        setErrorMessage(""); // Clear any previous errors
      } else {
        const errorData = await res.json();
        setErrorMessage(`Error: ${errorData.error || "Failed to add customer"}`);
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.message || "Something went wrong"}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add New Customer</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Instagram ID"
          value={formData.instagramId}
          onChange={(e) =>
            setFormData({ ...formData, instagramId: e.target.value })
          }
          className="border p-2 mb-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Add Customer
        </button>
      </form>

      {successMessage && (
        <p className="text-green-500">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
