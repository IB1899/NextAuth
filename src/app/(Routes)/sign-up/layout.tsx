import type { Metadata } from 'next'
import Link from "next/link"
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import authOptions from '../../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'


export const metadata: Metadata = {
    title: 'Sign ip',
    description: 'The sign up page',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    let session = await getServerSession(authOptions)

    return (
        <>
            {
                session?.user.email ?
                    redirect("/")
                    :
                    children
            }

        </>
    )
}


