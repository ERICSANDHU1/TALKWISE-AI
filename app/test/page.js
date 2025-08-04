"use client";

import { useState } from 'react';
import { useMutation, useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../../components/ui/button';

export default function TestPage() {
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const createUser = useMutation(api.users.createUser);
  const convex = useConvex();
  
  const handleTestCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Testing user creation with:', { name, email });
      const userId = await createUser({ name, email });
      console.log('✅ User created with ID:', userId);
      setResult({ userId, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error('❌ Error creating user:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Convex Integration Test</h1>
      
      <form onSubmit={handleTestCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Test Create User'}
        </Button>
      </form>
      
      {result && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded">
          <h3 className="font-medium text-green-800 dark:text-green-200">Success!</h3>
          <pre className="mt-2 text-sm overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900 rounded">
          <h3 className="font-medium text-red-800 dark:text-red-200">Error</h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Check the console for detailed logs.</p>
        <p className="mt-2">
          <a 
            href="https://dashboard.convex.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Open Convex Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}