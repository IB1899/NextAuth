"use client"

import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/options";



// select the word then ctrl + shift + l
export default function Home() {


    //! hold ctrl and hover over the class to see its properties
    return (
        <div className="Home">
            <h1> This is Home Page </h1>

        </div>
    )
}
