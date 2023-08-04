import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/options";

export default async function Home() {


    let session = await getServerSession(authOptions)

    let message: string | null = null;
    
    if (session?.user.email) {

        //! This doesn't send the cookies to the routeHandler or the middleware
        let res = await fetch("http://localhost:3000/api/hello", {
            cache: "no-store",
            headers: { "Authorization": "No" }
        });

        let data = await res.json()
        message = data.hello
    }

    return (
        <div className="Home">
            <h1> This is Home Page </h1>
            {message}
        </div>
    )
}
