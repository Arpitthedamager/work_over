import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <div>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome to Our Website</h1>
      <div className="mt-4">
        
          <a className="bg-blue-500 text-white p-2 mr-4">Login</a>
        
          <a className="bg-green-500 text-white p-2">Client Area</a>
      </div>
    </div>
    </div>
    </>
  );
}
