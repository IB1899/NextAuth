import authOptions from "../../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function About() {

    //! Accessing the session in server components
    let session = await getServerSession(authOptions)

    //! If user isn't authenticated redirect them
    if (!session?.user.email) {
        redirect("/log-in")
    }


    return (
        <div className="About">
            <h1> Welcome to the ABOUT page </h1>
        </div>
    )
}











