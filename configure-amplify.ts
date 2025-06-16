import { Amplify } from "aws-amplify";

export default function configureAmplify() {
        Amplify.configure({
                Auth: {
                        Cognito: {
                                userPoolClientId: "17kff8jq3ram910s6smirl5dn3",
                                userPoolId: "us-east-1_RiIZ3JX0j"
                        },
                },
        }, { ssr: true });
}
