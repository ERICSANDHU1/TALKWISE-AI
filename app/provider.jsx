"use client";

import React, { Suspense, useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "./AuthProvider";

function Provider({ children }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Initialize Convex client inside useEffect to avoid hydration issues
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    console.log("🔌 Initializing Convex with URL:", convexUrl);
    
    if (!convexUrl) {
      console.error("❌ NEXT_PUBLIC_CONVEX_URL is not defined");
      return;
    }
    
    const newClient = new ConvexReactClient(convexUrl);
    setClient(newClient);
  }, []);

  if (!client) {
    return <div>Loading Mockly</div>;
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ConvexProvider client={client}>
        <AuthProvider>{children}</AuthProvider>
      </ConvexProvider>
    </Suspense>
  );
}

export default Provider;