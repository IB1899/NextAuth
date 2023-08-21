import { Dispatch, SetStateAction, useState } from "react";
import { Connection } from "./chatApp";
import Peer from "peerjs";

type props = {
    connections: Record<string, Connection>,
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>
    peer: Peer
}
/*
! There is a problem. I don't know how to update the stream that I send to other peers.
! such as when I switch to screen sharing I don't know how to send the new stream.
*/
export default function Switch({ connections, setLocalStream, peer }: props) {

    //! To switch between camera sharing and screen sharing
    let [isScreenSharing, setIsScreenSharing] = useState(false);

    //! To turn the camera on & off
    let [isCameraOn, setIsCameraOn] = useState(true)

    let switchSharing = async () => {
        try {
            const newStream = isScreenSharing
                ? await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                : await navigator.mediaDevices.getDisplayMedia();

            setLocalStream(newStream);
            setIsScreenSharing(!isScreenSharing);

        } catch (error) {
            console.error('Error switching sharing:', error);
        }
    }

    //! Switch camera on & off
    let OnOff = async () => {
        let newStream: MediaStream | null;
        if (isCameraOn) {
            newStream = null
        }
        else {
            if (isScreenSharing) {
                newStream = await navigator.mediaDevices.getDisplayMedia();
            }
            else {
                newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            }
        }
        setIsCameraOn(!isCameraOn)
        setLocalStream(newStream)
    }

    return (
        <>
            <button className="Screen-Sharing-Toggle" onClick={switchSharing} > {!isScreenSharing ? "ScreenSharing" : "Camera Sharing"} </button>
            <button className="On-Off-Toggle" onClick={OnOff} > {!isCameraOn ? "On" : "Off"} </button>
        </>
    )
}
