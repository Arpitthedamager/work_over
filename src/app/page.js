import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
     
      <Link href="/signin" className="bg-blue-500 text-white py-3 px-6 rounded-lg text-xl hover:bg-blue-600 transition duration-200">
          Go to Login
      </Link>
    </div>
  );
}
