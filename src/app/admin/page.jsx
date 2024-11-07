import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not admin
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session || session.user.role !== 'admin') {
    router.push('/'); // Redirect to home if the user is not an admin
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800">Admin Dashboard</h2>
        <p>Welcome, Admin! You can now manage your clients.</p>
        {/* Admin content goes here */}
      </div>
    </div>
  );
}
