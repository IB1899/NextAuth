import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { withAuth } from "next-auth/middleware";


//! This middleware is now only useable in the protected frontend routes after authenticated
export default withAuth(
    function middleware(req: NextRequest) {
        console.log("hi");

    },
    {

        //! If this function returns true we run the middleware if false we redirect them to the sign in
        callbacks: {
            authorized: ({ token }) => {
                return token ? true : false
            }
        }
    }
)


//! Protecting frontend routes inside the middleware
// export { default } from "next-auth/middleware"
export const config = { matcher: ["/welcome",] }