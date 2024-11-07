// /components/AuthProvider.js
"use client";

import { SessionProvider } from "next-auth/react";

// This component wraps its children with the SessionProvider
export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
