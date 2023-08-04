

"use client"

import { useEffect } from "react";

export default function Welcome() {

    useEffect(() => {
        let Fetch_Data = async () => {

            let response = await fetch("http://localhost:3000/api/hello");
            let data = await response.json();
        }
        Fetch_Data()
    }, [])

    let Fetch = async () => {

        let response = await fetch("http://localhost:3000/api/hello");
        let data = await response.json();
    }

    return (
        <div>Welcome


            <button onClick={Fetch}>fetch</button>
        </div>
    )
}
