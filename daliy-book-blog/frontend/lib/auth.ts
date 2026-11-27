
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
            .replace(/^https?:\/\//, ""),
          scopes: ["openid", "email"],
          redirectSignIn: ["https://daily-book.com/auth/callback/"],
          redirectSignOut: ["https://daily-book.com/"],
          responseType: "code",
        },
      },
    },
  },
});
