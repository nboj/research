import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
    loginWith: {
        email: true,
        externalProviders: {
            callbackUrls: [
                'http://localhost:3000/api/auth/sign-in-callback',
                'https://main.d1mrgpre7451wb.amplifyapp.com/api/auth/sign-in-callback',
                "https://development.d1mrgpre7451wb.amplifyapp.com/api/auth/sign-in-callback"
            ],
            logoutUrls: [
                'http://localhost:3000/api/auth/sign-out-callback',
                'https://main.d1mrgpre7451wb.amplifyapp.com/api/auth/sign-out-callback',
                "https://development.d1mrgpre7451wb.amplifyapp.com/auth/sign-out-callback"
            ],
        },
    },

});
