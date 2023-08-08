import "@/style/style.css"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextAuthProvider from "./providers/NextAuth"
import RootNavBar from "@/components/RootNavBar"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = { title: 'Next Auth', description: 'This is next Auth app' }

export default async function RootLayout({ children, }: { children: React.ReactNode }) {

    //? Auth.js by default uses JSON Web Tokens for saving the user's session.

    //! PROBLEM: fetch requests in server components won't send cookies to the backend.

    /*              //? FRONTEND ROUTS PROTECTION
    ! NextAuth session: Is a place for keeping data of current Authenticated
    ! user to verify if a user is authenticated or not. and it's available in:
    ! 1- Server components(will turn the page to SSR) -> getServerSession(authOptions).  
    ! 2- Client components(will not turn the page to SSR)-> useSession().
    ! 3- Protect frontend Routes inside the middleware(will not turn the page to SSR)
    */

    /*              //? API ENDPOINTS PROTECTION
    ! 1- inside the route handler itself using the getServerSession().
    ! 2- inside the middleware using the jose token and cookie.
    ! 3- Setting JWT Authorization Headers in the request to the token value, and
    ! verify the token on the backend(accessing the token will cause the page to be dynamic).
    */

    return (
        <html lang="en">
            <body className={inter.className}>
                <NextAuthProvider>
                    <RootNavBar />
                    {children}
                </NextAuthProvider>
            </body>
        </html>
    )
}

