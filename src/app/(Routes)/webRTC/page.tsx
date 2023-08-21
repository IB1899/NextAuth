
import dynamic from "next/dynamic";

/*
! This is because Next.js code is first evaluated in server side. 
! this is probably because peer js is performing some side effect during import
*/

//? This is how to make a component load on the client CSR
let WebRTC = dynamic(() => import("./main"), { ssr: false, loading: () => <h2>loading..</h2> })

export default function Page() {

    return  <WebRTC />
    

}
