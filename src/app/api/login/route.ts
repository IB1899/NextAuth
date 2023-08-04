import MongodbConnection from "@/backend/database/mongodb"
import AuthModel from "@/backend/database/model/Auth"
import * as jose from "jose"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

MongodbConnection()


export async function POST(request: Request) {
    try {

        let { email, password }: SignInObject = await request.json()

        let user: User | null = await AuthModel.findOne({ email });

        if (!user) throw Error("There is no such a user")

        let auth = await bcrypt.compare(password, user.password);

        if (!auth) throw Error("The password is incorrect")

        /*
        ! In NextAuth we don't send cookies to the browser with the token because NextAuth will send
        ! their own cookies. Auth.js by default uses JSON Web Tokens for saving the user's session.
        */

        let token = await new jose.SignJWT({ userId: user._id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET));


        return NextResponse.json({ email: user.email, id: user._id, success: "You have logged in successfully", token })
    }
    catch (err: any) {

        let Error = { error: "" }

        Error.error = err.message
        //@ts-ignore
        return Response.json(Error)
    }
}