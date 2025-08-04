import { NextResponse } from "next/server";
import { stackServerApp } from "./stack";

export async function middleware(request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/handler/sign-in', request.url));
  }
  return NextResponse.next();
}

export const config = {
  // You can add your own route protection logic here
  // Make sure not to protect the root URL, as it would prevent users from accessing static Next.js files or Stack's /handler path
  matcher: '/dashboard/:path*',
};
// import { NextResponse } from 'next/server';

// // This middleware intercepts requests and adds debugging capabilities
// export function middleware(request) {
//   const response = NextResponse.next();
  
//   // Add debug header to track requests in development
//   if (process.env.NODE_ENV === 'development') {
//     response.headers.set('X-Debug-Convex', 'enabled');
//   }

//   return response;
// }

// // Add matching config
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      */
//     '/((?!_next/static|_next/image|favicon.ico|public).*)',
//     '/dashboard/:path*'
//   ],
// };