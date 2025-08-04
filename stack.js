// import "server-only";

// import { StackServerApp } from "@stackframe/stack";

// export const stackServerApp = new StackServerApp({
//   tokenStore: "nextjs-cookie",
// });
// stack.js
// import { createStackApp } from "@stackframe/stack/server";

// export const stackServerApp = createStackApp({
//   publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
// });
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  secretKey: process.env.STACK_SECRET_SERVER_KEY,
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  redirectURL: process.env.NEXT_PUBLIC_REDIRECT_URL || "http://localhost:3000",
  trustedDomains: ["http://localhost:3000"],
  handlerPath: "/handler" // Explicitly set the handler path
});