"use client";

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../../app/AuthProvider';

export default function ConvexDebugger() {
  const { user } = useAuth();
  const [lastError, setLastError] = useState(null);
  
  const userData = user?.email 
    ? useQuery(api.users.getUser, { email: user.email })
    : null;

  return (
    <div className="fixed bottom-0 right-0 bg-white dark:bg-gray-900 border p-4 m-4 rounded shadow-lg max-w-md z-50 text-sm">
      <h3 className="font-bold mb-2">Convex Debug Panel</h3>
      
      <div className="mb-2">
        <div className="font-semibold">Auth State:</div>
        <div className="whitespace-pre-wrap overflow-auto max-h-20">
          {user ? `✅ Logged in: ${user.email}` : '❌ Not logged in'}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="font-semibold">Convex User Data:</div>
        <div className="whitespace-pre-wrap overflow-auto max-h-40 bg-gray-100 dark:bg-gray-800 p-2 rounded">
          {userData ? JSON.stringify(userData, null, 2) : 'No data found'}
        </div>
      </div>
      
      {lastError && (
        <div className="mb-2">
          <div className="font-semibold text-red-500">Last Error:</div>
          <div className="whitespace-pre-wrap overflow-auto max-h-20 bg-red-50 dark:bg-red-900 p-2 rounded text-red-700 dark:text-red-200">
            {lastError}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => document.body.removeChild(document.getElementById('convex-debugger'))}
        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Close
      </button>
    </div>
  );
}