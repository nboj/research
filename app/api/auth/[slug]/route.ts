import { createAuthRouteHandlers } from "@/app/_utils/amplifyServerUtils";

export const GET = createAuthRouteHandlers({
        redirectOnSignInComplete: "/",
        redirectOnSignOutComplete: "/sign-in",
});
