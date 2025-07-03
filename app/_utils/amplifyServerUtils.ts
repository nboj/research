import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import outputs from '@/amplify_outputs.json';

export const {
        runWithAmplifyServerContext,
        createAuthRouteHandlers,
} = createServerRunner({
        config: outputs,
        runtimeOptions: {
                cookies: {
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 24 * 7 // 7 days
                }
        }
});
