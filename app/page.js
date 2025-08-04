"use client";

import { useEffect, useState } from "react";
import { UserButton, useUser } from "@stackframe/stack";
import { useAuth } from "./AuthProvider";
import { Button } from "../components/ui/button";

export default function Home() {
  const user = useUser(); // From Stack
  const { login } = useAuth(); // Our Convex login helper
  const [synced, setSynced] = useState(false);
  

  useEffect(() => {
    console.log("📄 Home page mounted");
    console.log("👤 Current user state:", user);

    if (user && user.primaryEmail && !synced) {
      console.log("🚀 Starting user sync process...");
      
      // Get the name from displayName or fallback to email username
      const userName = user.displayName || user.primaryEmail.split('@')[0] || 'User';
      console.log("👤 Using name:", userName);
      
      setSynced(true); // Set synced immediately to prevent multiple calls
      
      console.log("🚀 Starting user sync process...");
      
      
      // Trigger Convex user creation/login
      login(user.primaryEmail, userName)
        .then(() => {
          console.log("✅ Convex user sync successful");
        })
        .catch((err) => {
          console.error("❌ Convex user sync failed:", err);
          setSynced(false); // Reset on error so it can retry
          setSynced(false); // Reset on error so it can retry
        });
    } else if (user && user.primaryEmail && synced) {
      console.log("✅ User already synced, skipping...");
    } else if (!user) {
      console.log("⏳ No user yet, waiting for authentication...");
    } else if (!user.primaryEmail) {
      console.log("❌ User exists but no primary email found");
    } else if (user && user.primaryEmail && synced) {
      console.log("✅ User already synced, skipping...");
    } else if (!user) {
      console.log("⏳ No user yet, waiting for authentication...");
    } else if (!user.primaryEmail) {
      console.log("❌ User exists but no primary email found");
    }
  }, [user, login, synced]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-2xl font-bold">Welcome to Talkwise</h2>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={() => console.log("Button clicked, current user:", user)}>
          Subscribe us
        </Button>
        <div className="relative">
          <UserButton />
          <div className="mt-2 text-sm text-gray-500">
            {user ? `Logged in as: ${user.primaryEmail}` : "Not logged in"}
          </div>
        </div>
      </div>
    </div>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import { UserButton, useUser } from "@stackframe/stack";
// import { useAuth } from "./AuthProvider";
// import { Button } from "../components/ui/button";

// export default function Home() {
//   const user = useUser(); // From Stack
//   const { login } = useAuth(); // Our Convex login helper
//   const [synced, setSynced] = useState(false);

//   useEffect(() => {
//     console.log("📄 Home page mounted");
//     console.log("👤 Current user state:", user);

//     if (user && user.primaryEmail && user.name && !synced) {
//       console.log("🔄 Syncing user with Convex...");
//       login(user.primaryEmail, user.name);
//       setSynced(true);
//     }
//   }, [user, login, synced]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
//       <h2 className="text-2xl font-bold">Welcome to MOCKLY</h2>
//       <div className="flex flex-col sm:flex-row gap-4 items-center">
//         <Button onClick={() => console.log("Button clicked, current user:", user)}>
//           Subscribe us
//         </Button>
//         <div className="relative">
//           <UserButton />
//           <div className="mt-2 text-sm text-gray-500">
//             {user ? `Logged in as: ${user.primaryEmail}` : "Not logged in"}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }