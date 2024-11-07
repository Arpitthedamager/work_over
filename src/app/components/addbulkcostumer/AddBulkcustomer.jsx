"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AddBulkCustomers() {
  const { data: session } = useSession(); // Get session data for admin email
  const [formData, setFormData] = useState(''); // This will store the bulk customer data as a string
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse the bulk input into an array of customer objects
    let customers = [];
    try {
      customers = JSON.parse(formData); // Ensure it's in the right format
    } catch (error) {
      setErrorMessage('Invalid JSON format. Please check the input.');
      return;
    }

    // Ensure that session and email exist
    if (!session || !session.user || !session.user.name) {
      setErrorMessage('Error: Unable to retrieve admin email from session.');
      return;
    }

    try {
      const res = await fetch('/api/addcustomersbulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.name, // Admin email
          customers, // Array of customer data
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage('Bulk customers added successfully!');
        setFormData(''); // Reset the form
        setErrorMessage('');
      } else {
        const errorData = await res.json();
        setErrorMessage(`Error: ${errorData.error || 'Failed to add customers'}`);
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.message || 'Something went wrong'}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Bulk Customers</h1>
      <p className="mb-2">Enter an array of customer data in JSON format:</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          placeholder={`[{"name": "Customer 1", "phoneNumber": "1234567890", "instagramId": "insta1"}, {"name": "Customer 2", "phoneNumber": "0987654321", "instagramId": "insta2"}]`}
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          className="border p-2 mb-2 w-full h-40 text-gray-600"
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Customers</button>
      </form>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
