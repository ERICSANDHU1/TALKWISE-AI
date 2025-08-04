export const addDebugger = () => {
  if (typeof window !== 'undefined') {
    // Check if debugger already exists
    if (!document.getElementById('convex-debugger-script')) {
      const script = document.createElement('script');
      script.id = 'convex-debugger-script';
      script.innerHTML = `
        (function() {
          if (!document.getElementById('convex-debugger')) {
            const div = document.createElement('div');
            div.id = 'convex-debugger';
            document.body.appendChild(div);
            
            const initDebugger = async () => {
              const { default: ConvexDebugger } = await import('/components/debug/ConvexDebugger.jsx');
              const { createRoot } = await import('react-dom/client');
              const root = createRoot(div);
              root.render(React.createElement(ConvexDebugger));
            };
            
            initDebugger().catch(console.error);
          }
        })();
      `;
      document.head.appendChild(script);
    }
  }
};

// Helper to force re-run a Convex mutation for testing
export const testConvexMutation = async (client, mutation, args) => {
  try {
    console.log(`🧪 Testing mutation: ${mutation}`, args);
    const result = await client.mutation(mutation, args);
    console.log(`✅ Mutation successful:`, result);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Mutation failed:`, error);
    return { success: false, error };
  }
};