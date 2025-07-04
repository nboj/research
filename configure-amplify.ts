import { Amplify } from "aws-amplify";

export default function configureAmplify() {
    Amplify.configure({
        Auth: {
            Cognito: {
                userPoolClientId: "17kff8jq3ram910s6smirl5dn3",
                userPoolId: "1lomp925t1iho19t0ov1l2l9ej"
            },
        },
    }, { ssr: true });
}
