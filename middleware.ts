// middleware.js (or .ts)
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // ✅ Apply Clerk to all routes except static assets and Next.js internals
    '/((?!_next|.*\\..*|favicon.ico).*)',
    // ✅ Explicitly include API routes
    '/(api|trpc)(.*)',
  ],
};
