import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

//! If you want to protect the Route Handler, protect the frontend pages that send requests to the route handler
export async function GET(req: NextRequest) {

    //? work in client components on click event
    //? work in client components on initial renders
    //? works when I visit the url in the browser
    //! doesn't work with server components
    let session = await getServerSession(authOptions);
    console.log(session, " :session");

    // @ts-ignore
    return Response.json({ hello: "Good evening" })
}

