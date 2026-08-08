import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { username } from "better-auth/plugins";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const appUrl =
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: appUrl,
    trustedOrigins: [appUrl],

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
    },

    plugins: [
        username({
            minUsernameLength: 3,
            maxUsernameLength: 24,
            usernameValidator: (value) =>
                /^[a-zA-Z0-9_.]+$/.test(value),
            displayUsernameValidator: (value) =>
                value.trim().length >= 2 &&
                value.trim().length <= 30,
        }),
    ],
});

export type Session = typeof auth.$Infer.Session;
