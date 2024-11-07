// pages/admin_dashboard.js
"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserList from "../components/userlist/UserList";


export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session || session.user.role !== "admin") {
      router.push("/"); // Redirect to home if not an admin
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <button
        onClick={() => router.push("/register")}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-6"
      > 
        Create New User
      </button>
      <button
        onClick={signOut}
        className="px-4 py-2 ml-4 bg-red-500 text-white rounded-md mb-6"
      >
        sign out
      </button>
      <UserList/>
    </div>
  );
}
