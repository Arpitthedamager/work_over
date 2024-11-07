import Link from "next/link";
import { useState, useEffect } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false); // New state for controlling table visibility

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users); // Populate users
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Error fetching users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user function
  const handleDelete = async (userEmail) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`/api/users?email=${userEmail}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setUsers(users.filter((user) => user.email !== userEmail)); // Remove deleted user from the list
          alert("User deleted successfully");
        } else {
          const data = await res.json();
          alert(`Error: ${data.message}`);
        }
      } catch (err) {
        alert("An error occurred while deleting the user.");
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-dashboard">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => setShowTable(!showTable)} // Toggle table visibility on heading click
      >
        User Management ^
      </h1>
      {error && <p className="text-red-500">{error}</p>}

      {showTable && ( // Render table only if showTable is true
        <div className="user-list mt-4">
          <Link href="/register">
      <button
        className="px-4 py-2 m-3 bg-blue-500 text-white rounded-md mb-6"
        >
        Create New User
      </button>
        </Link>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center p-4 text-white shadow-md rounded-md"
                >
                  <div>
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-sm text-gray-500">Role: {user.role}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
