"use client";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 max-w-sm w-full bg-white shadow-md">
        <form method="post" action="/api/auth/callback/credentials">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="mb-4">
            <label>Email</label>
            <input name="email" type="email" className="mt-1 block w-full" />
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="mt-1 block w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
