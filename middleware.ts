import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/app/_utils/amplifyServerUtils';

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    const authenticated: boolean | NextResponse = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                return (
                    session.tokens?.accessToken !== undefined &&
                    session.tokens?.idToken !== undefined
                );
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    });

    const authorized: boolean | NextResponse = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                console.log(session.tokens?.idToken?.payload['cognito:groups'] as string[] | undefined);
                if ((session.tokens?.idToken?.payload['cognito:groups'] as string[] | undefined)?.find(v => v == "admin")) {
                    return (
                        session.tokens?.accessToken !== undefined &&
                        session.tokens?.idToken !== undefined
                    );
                } else {
                    return false
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    });

    console.log(authenticated, authorized);
    console.log(request.nextUrl.pathname);


    if (authenticated && !authorized && request.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (authenticated) {
        return response
    }

    return NextResponse.redirect(new URL('/sign-in', request.url));
}

export const config = {
    matcher: [
        /*
                 * Match all request paths except for the ones starting with:
                 * - api (API routes)
                 * - _next/static (static files)
                 * - _next/image (image optimization files)
                 * - favicon.ico (favicon file)
                 */
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in).*)'
    ]
};
