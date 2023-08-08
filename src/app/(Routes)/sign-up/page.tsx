"use client"
import { FormEvent, MutableRefObject, useRef, useState } from "react"
import { signIn, useSession } from "next-auth/react";
import validator from "validator";
import { redirect, useRouter } from "next/navigation";

export default function SignUp() {

    let router = useRouter()

    let nameRef = useRef() as MutableRefObject<HTMLInputElement>
    let emailRef = useRef() as MutableRefObject<HTMLInputElement>
    let passwordRef = useRef() as MutableRefObject<HTMLInputElement>

    let [error, setError] = useState<null | string>(null)
    let [loading, setLoading] = useState<boolean>(false)

    let HandleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let name = nameRef.current.value
        let email = emailRef.current.value
        let password = passwordRef.current.value
        let OperationType = "SIGNUP";

        //! Handling specific errors checking on the frontend 
        if (!validator.isEmail(email)) {
            return setError("Please enter a valid email")
        }
        else if (password.length <= 9) {
            return setError("The Password must be than 9 characters")
        }
        setLoading(true)

        let message: {
            error: string | undefined // Error code based on the type of error
            status: number // HTTP status code
            ok: boolean // `true` if the signin was successful
            url: string | null // `null` if there was an error, otherwise URL to redirected to
        } | undefined = await signIn("credentials", {
            email, password, name, OperationType,
            redirect: false,
            callbackUrl: "/"
        })

        emailRef.current.value = ""; email = ""
        passwordRef.current.value = ""; password = ""
        nameRef.current.value = ""; name = ""
        setLoading(false)

        if (message?.error === "CredentialsSignin") {
            setError("Your information isn't valid")
        }
        else if (message?.error === "AccessDenied") {
            setError("You can't sign in for some reason")
        }
        else if (message?.error) {
            setError("something went wrong")
        }
        else {
            // redirect("/about")
            router.refresh()
        }
    }

    return (
        <div className="SignUp" >
            <form onSubmit={HandleSignUp}>
                <h1> Sign up page </h1>

                <label htmlFor="name">Your name</label>
                <input type="text" name="name" required ref={nameRef} />

                <label htmlFor="email">Your Email</label>
                <input type="email" name="email" required ref={emailRef} />

                <label htmlFor="password">Your Password</label>
                <input type="password" name="password" required ref={passwordRef} />

                <button disabled={loading}>Sign ip</button>
                <h3> {error && error} </h3>
            </form>

            <button onClick={() => signIn("google")}>Or sign in with your Google account</button>
            <button onClick={() => signIn("facebook")}>Or Log in with your Facebook account</button>
            <button onClick={() => signIn("github")}>Or sign in with your GitHub account</button>
        </div>
    )
}
