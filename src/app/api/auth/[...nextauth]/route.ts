import NextAuth from "next-auth/next";
import authOptions from "./options";

/*
! NextAuth session: Is a place for keeping data of current Authenticated User to verify if a user is authenticated or not
*/

let handler = NextAuth(authOptions)

export { handler as GET, handler as POST }