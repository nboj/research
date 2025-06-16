import { AuthError, getCurrentUser } from 'aws-amplify/auth';
import { NextResponse, NextRequest } from 'next/server';
import { getAuthContext } from './app/_lib/jwt';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
        const { pathname } = request.nextUrl;

        // Skip check for static files or API routes
        if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static')) {
                return NextResponse.next();
        }

        try {
                const user = await getAuthContext()
                console.log(user);
                // User is authenticated
                return NextResponse.next();
        } catch (e) {
                // Only redirect if not already in auth flow
                const inAuthRoute = pathname.startsWith('/auth');

                // Optional: log only unexpected errors
                if (!(e instanceof AuthError)) {
                        console.error('Unexpected auth error:', e);
                }

                return inAuthRoute
                        ? NextResponse.next()
                        : NextResponse.redirect(new URL('/auth/login', request.url));
        }
}

// Optional: restrict to certain paths
export const config = {
        matcher: ['/((?!api|_next|static).*)'],
};
