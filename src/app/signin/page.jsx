"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to handle error message
  const router = useRouter();
  const { data: session, status } = useSession();


  useEffect(() => {
    if (status === "loading") {
      return; // Wait until loading is finished
    }

    if (session) {
      // Redirect based on user role
      if (session.user.role === "admin") {
        router.push("/admin_dashboard");
      } else if (session.user.role === "user") {
        router.push("/user_dashboard");
      }
    }
  }, [status, session, router]);


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Reset error before attempting login

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      // Check if the sign-in was successful
      if (res.ok) {
        // Fetch session to check user role
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        console.log("Session data:", session); // Log the session data for debugging

        if (session.user.role === "admin") {
          router.push("/admin_dashboard");
        } else if (session.user.role === "user") {
          router.push("/user_dashboard");
        }
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-md shadow">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        {error && (
          <div className="p-2 text-red-500 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-gray-600">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-gray-600">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
