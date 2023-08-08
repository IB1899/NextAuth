"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const RootNavBar = () => {

    //! Accessing the session in client components
    let { data: session } = useSession()

    return (
        <header>
            <h2> Next Auth </h2>
            <nav>

                {session?.user.email ?
                    <>
                        <Link href={"/"}  >Home</Link>
                        <Link href={"/about"} >About</Link>
                        <Link href={"/welcome"} >Welcome</Link>

                        <h3> welcome {session.user.email} </h3>
                        <button onClick={() => signOut()} > SIGN OUT </button>
                    </> :
                    <>
                        <Link href={"/"}  >Home</Link>
                        <Link href={"/log-in"} >Log in</Link>
                        <Link href={"/sign-up"} >Sign up</Link>

                        {/* <button onClick={() => signIn()} > LOG IN </button> //! to use the default page */}
                    </>
                }
            </nav>

        </header>
    );
}

export default RootNavBar;

