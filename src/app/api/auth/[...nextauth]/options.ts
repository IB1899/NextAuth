import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"
import { NextAuthOptions, Session } from "next-auth";
import clientPromise from "@/backend/config/MongoDBAdaptor";
import { MongoDBAdapter, MongoDBAdapterOptions } from "@next-auth/mongodb-adapter";
import { cookies } from "next/headers";

let authOptions: NextAuthOptions = {

    //! To save the users who authenticates through Google or GitHub in the database.
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: "Authentication",
        collections: {
            Accounts: "accounts",
            Users: "auths",
        }
    } as MongoDBAdapterOptions),

    //! Provider: is a specific way of authenticating wither using credentials, google, github, etc to authenticate.
    providers: [

        //! Authenticate users through their email & password
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                name: { required: true, type: "text", },
                email: { required: true, type: "text", },
                password: { required: true, type: "password" },
                OperationType: { required: true, type: "text" }
            },

            //! What we return from this function will be in the NextAuth Session.
            async authorize(credentials, request) {

                //! Authenticate the user after either logging in or signing up
                if (credentials?.OperationType === "LOGIN") {

                    let response = await fetch("http://localhost:3000/api/login", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials!.email, password: credentials!.password
                        })
                    })
                    let user = await response.json() as session | any;

                    console.log(user);

                    //! We must set any cookies here for SignUp & and LogIn
                    if (user.token) {
                        cookies().set("jwt", user.token)
                    }
                    return user?.success ? user : null
                }
                else {
                    let response = await fetch("http://localhost:3000/api/signup", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials!.email, password: credentials!.password, name: credentials?.name
                        })
                    })
                    let user = await response.json() as session | any;

                    console.log(user);
                    
                    //! We must set any cookies here for SignUp & and LogIn
                    if (user.token) {
                        cookies().set("jwt", user.token)
                    }
                    return user?.success ? user : null
                }
            }
        }),

        //! Authenticate users through their Google accounts
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),

        DiscordProvider({
            clientId: process.env.DISCORD_ID as string,
            clientSecret: process.env.DISCORD_SECRET as string
        })
    ],

    pages: {
        signIn: "/log-in",
        newUser: "/sign-up",
        error: "/log-in"
    },

    jwt: {
        //* The maximum age of the NextAuth.js issued JWT
        maxAge: 60 * 60 * 24,
    },
    session: {
        //* How long until an idle session expires and is no longer valid.
        maxAge: 60 * 60 * 24,

        //* The Auth strategy
        strategy: "jwt"
    },

    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },

        //! what the session data will be
        async session({ session, token }) {
            // console.log("The backend response", token)
            session.user = token as any;
            return session
        },

        //! This will run after a successful sign in
        async signIn({ user, account, credentials }) {
            // console.log("The credentials that the user entered", credentials)
            // console.log("account:", account)
            // console.log("The backend response", user);

            return true
        }
    }
}
export default authOptions