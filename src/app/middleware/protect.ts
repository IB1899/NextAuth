import authOptions from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

//! You can protect API routes using the getServerSession() method.
export async function ProtectUsingSession() {

    let session = await getServerSession(authOptions);
    console.log(session);
    
    if (session?.user.success) {
        return true
    }
    return false
}


//! Protecting API routes using the jwt that we send to the frontend after logging in
//! in the frontend fetch api header we must send the token as header Authorization
export async function ProtectUsingToken(request: NextRequest) {

    let isAuthenticated = false
    let token = request.headers.get("Authorization")

    jwt.verify(token!, process.env.JWT_SECRET!, (err) => {
        if (!err) {
            isAuthenticated = true
        }
    })
    return isAuthenticated
}


