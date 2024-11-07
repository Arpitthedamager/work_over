// DeleteUserButton.jsx
import { useState } from "react";

export default function Delete_User_Button({ userId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccess(true);
        alert("User deleted successfully");
        // Optionally, you can update the UI or refresh the list of users.
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
      >
        {loading ? "Deleting..." : "Delete User"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">User deleted successfully!</p>}
    </div>
  );
}
