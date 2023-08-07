"use client"

import { getSession, signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { FormEvent, MutableRefObject, useRef, useState } from "react"

export default function LogIn() {

    let { data } = useSession();
    if (data?.user.email) redirect("/");

    let router = useRouter()

    let emailRef = useRef() as MutableRefObject<HTMLInputElement>
    let passwordRef = useRef() as MutableRefObject<HTMLInputElement>

    let [error, setError] = useState<null | string>(null)
    let [loading, setLoading] = useState<boolean>(false)

    let HandelLogIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        //! Handle specific errors checking on the frontend 
        let email = emailRef.current.value
        let password = passwordRef.current.value
        let OperationType = "LOGIN"

        let message: {
            error: string | undefined // Error code based on the type of error
            status: number // HTTP status code
            ok: boolean // `true` if the signin was successful
            url: string | null // `null` if there was an error, otherwise URL to redirected to
        } | undefined = await signIn("credentials", {
            email, password, OperationType,
            redirect: false,
            callbackUrl: "/"
        })

        emailRef.current.value = ""; email = ""
        passwordRef.current.value = ""; password = ""
        setLoading(false)
        if (message?.error === "CredentialsSignin") {
            setError("You email or password is incorrect")
        }
        else if (message?.error === "AccessDenied") {
            setError("You can't sign in for some reason")
        }
        else if (message?.error) {
            setError("something went wrong")
        }
        else {
            // router.refresh()
            // window.location.assign("/")
            redirect("/")
        }
    }

    return (
        <div className="LogIn">

            <form onSubmit={(HandelLogIn)}>
                <h1> Log In page </h1>

                <label htmlFor="email">Your Email</label>
                <input type="email" name="email" required ref={emailRef} />

                <label htmlFor="password">Your Password</label>
                <input type="password" name="password" required ref={passwordRef} />

                <button disabled={loading}>Log in</button>
                <h3> {error && error} </h3>
            </form>


            <button onClick={() => signIn("google")}>Or Log in with your Google account</button>
            <button onClick={() => signIn("github")}>Or Log in with your GitHub account</button>
            <button onClick={() => signIn("facebook")}>Or Log in with your Facebook account</button>
            <button onClick={() => signIn("discord")}>Or Log in with your  Discord account</button>
        </div>
    )
}
