import MongodbConnection from "../../../backend/database/mongodb"
import AuthModel from "../../../backend/database/model/Auth"
import * as jose from "jose"

MongodbConnection()

export async function POST(request: Request) {
    try {
        let { email, password, name }: SignInObject = await request.json()
        let user = await AuthModel.create({ email, password, name })

        //! This a library like jwt that works in the edge runtime, if you want to check the cookies in the middleware
        let token = await new jose.SignJWT({ userId: user._id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET))

        //@ts-ignore
        return Response.json({ email: user.email, id: user._id, success: "You have logged in successfully", token })
    }
    catch (err: any) {

        let Error = { error: "" }

        if (err.code === 11000) {
            Error.error = "The Email already exists"
        }
        else if (err.message.includes("auth validation failed")) {
            Object.values(err.errors).forEach((one: any) => {
                Error.error = one.properties.message
            })
        }
        else {
            Error.error = err.message
        }
        //@ts-ignore
        return Response.json(Error)
    }
}





