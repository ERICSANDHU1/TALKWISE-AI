"use client";

import React, { createContext, useContext, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = useMutation(api.users.createUser);
  const getUserData = useQuery(api.users.getUser, 
    user?.email ? { email: user.email } : "skip"
  );

  const login = async (email, name) => {
    console.log("🔑 Login function called with:", { email, name });
    setIsLoading(true);
    setError(null);
    
    if (!email || !name) {
      console.error("❌ Missing required fields:", { email, name });
      setError("Email and name are required");
      setIsLoading(false);
      return;
    }
    
    console.log("🔑 Attempting to create/login user:", { name, email });
    
    const userId = await createUser({ name, email });
    console.log("✅ createUser returned ID:", userId);

    const newUser = {
      id: userId,
      name,
      email
    };

    setUser(newUser);
    console.log("✅ User state updated:", newUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md max-w-md mx-auto my-4">
        <h3 className="font-bold">Error connecting to Convex</h3>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-xs mt-2">
          Tip: Make sure you've run <code className="bg-red-100 px-1 rounded">npx convex dev</code> in your terminal
        </p>
        {children}
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, userData: getUserData }}>
      {children}
    </AuthContext.Provider>
  );
}


