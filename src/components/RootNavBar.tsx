"use client"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootNavBar() {
    //! Accessing the session in client components
    let { data: session } = useSession()
    let pathName = usePathname()

    return (
        <header>
            <h2> Next Auth </h2>
            <nav>
                {session?.user.email ?
                    <>
                        {pathName === "/webRTC" ? <span> If you navigate the call will be closed  </span> : null}
                        {pathName === "/webRTC" ?
                            <>
                                <a href={"http://localhost:3000/"}  >Home</a>
                                <a href={"http://localhost:3000/about"} >About</a>
                                <a href={"http://localhost:3000/socket-io"} >Socket</a>
                            </>
                            :
                            <>
                                <Link href={"/"}  >Home</Link>
                                <Link href={"/about"} >About</Link>
                                <Link href={"/socket-io"} >Socket</Link>
                            </>
                        }
                        <Link href={"/webRTC"} >webRTC</Link>
                        <button onClick={() => signOut()} > SIGN OUT </button>
                    </> :
                    <>
                        <Link href={"/"}  >Home</Link>
                        <Link href={"/log-in"} >Log in</Link>
                        <Link href={"/sign-up"} >Sign up</Link>
                    </>
                }
            </nav>
        </header>
    );
}

