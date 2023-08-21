
import { useEffect, useRef, memo } from "react";

export let VideoShow = memo( function VideoShow ({ stream }: { stream: MediaStream | null }) {

    let videoRef = useRef<HTMLVideoElement>(null)

    //! To ensure that we create the video jsx before accessing the ref properties 
    //! Runs after the initial render (after creating the videoRef and assigning it to the video )
    useEffect(() => {

        if (videoRef.current) videoRef.current.srcObject = stream
    }, [stream])

    return (
        <video className="remote" ref={videoRef} autoPlay muted></video>
    )
})

