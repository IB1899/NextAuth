import Peer from "peerjs";
import { MutableRefObject, useEffect, useReducer, useRef, useState } from "react";
import { Socket } from "socket.io-client";

export default function ChatApp({ socket, room, peer }: { socket: Socket, room: string, peer: Peer }) {

    //! To get the camera access from the user -LOCAL VIDEO-
    const [Stream, setStream] = useState<MediaStream>();

    const [start, setStart] = useState(false);

    useEffect(() => {
        //! This must be running in the initial render, so that it can listen for calls from the local user
        peer.on("call", (call) => {
            //* 2- The remote user answered the local's user call
            call.answer(Stream) //* send the stream of the remote user to the local user

            console.log("runs");

            //* 4- The remote user is receiving the local's user stream
            call.on("stream", (localUserStream) => {
                console.log(`remoteUserStream:`, localUserStream)
                if (Stream) videoRef2.current.srcObject = Stream
            })
        })
    },[Stream])

    useEffect(() => {

        
        //! This ensures that we are listening for calls before making any calls 
        
        let ShowAndShare = async () => {
            
                    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setStream(stream)
            
            if (!start) return
            //* Getting the local stream

            socket.on("user-disconnected", ({ peerId, users }: { peerId: string, users: string[] }) => {
                console.log(peerId, `has left the room. this is a new list of the room members:`, users);
            })

            socket.on("user-joined-the-room", ({ room, users, peerId }: { room: string, users: string[], peerId: string }) => {
                console.log(peerId, ` has joined the room.  this is a new list of the room members:`, users);

                //* peerId is the id of the user who joined and stream is the stream of the local user.
                //* 1- The local user is calling the remote user(who just joined)
                let call = peer.call(peerId, stream)

                console.log("runs for the local user", peerId, stream);


                //* 3- The local user is receiving the remote user stream
                call.on("stream", (remoteUserStream) => {
                    videoRef2.current.srcObject = remoteUserStream
                    console.log("works?");

                })

                //! When a user leave the video call
                call.on("close", () => { })

            })
        }
        ShowAndShare()
    }, [socket, start])

    let videoRef1 = useRef() as MutableRefObject<HTMLVideoElement>
    let videoRef2 = useRef() as MutableRefObject<HTMLVideoElement>

    //* Displaying the local user camera stream to the page 
    if (Stream) videoRef1.current.srcObject = Stream;

    return (
        <div className="ChatApp">

            <video ref={videoRef2} autoPlay className="remote" ></video>
            <video ref={videoRef1} autoPlay muted className="local" ></video>


            <button onClick={() => { setStart(true); socket.emit("join-room", { room, peerId: peer.id }); }} >start calling</button>

        </div>
    )
}
