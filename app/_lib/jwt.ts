import { createRemoteJWKSet, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COGNITO_JWK_URL = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_RiIZ3JX0j/.well-known/jwks.json';

export async function verifyToken(token: string) {
        const res = await fetch(COGNITO_JWK_URL);
        const { keys } = await res.json();

        const keyStore = createRemoteJWKSet(new URL(COGNITO_JWK_URL));
        const { payload } = await jwtVerify(token, keyStore, {
                issuer: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_RiIZ3JX0j`,
                audience: '17kff8jq3ram910s6smirl5dn3',
        });

        return payload; // contains sub, email, etc.
}


export async function getAuthContext() {
        const token = (await cookies()).get('idToken');
        if (!token) {
                throw new Error("User tokenid not found.");
        }
        const res = await fetch(COGNITO_JWK_URL);
        const { keys } = await res.json();

        const keyStore = createRemoteJWKSet(new URL(COGNITO_JWK_URL));
        const { payload } = await jwtVerify(token.value, keyStore, {
                issuer: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_RiIZ3JX0j`,
                audience: '17kff8jq3ram910s6smirl5dn3',
        });

        return payload; // contains sub, email, etc.
}

async function refreshTokens(refreshToken: string) {
        const body = new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: process.env.COGNITO_CLIENT_ID!,
                refresh_token: refreshToken,
        });

        const res = await fetch(COGNITO_JWK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
        });
        if (!res.ok) throw new Error('Refresh failed');
        return res.json();            // { id_token, access_token, expires_in, ... }
}
