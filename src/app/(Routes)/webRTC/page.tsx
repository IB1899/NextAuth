"use client"

import { FormEvent, MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client"
import MessagesApp from "./messagesApp";
import ChatApp from "./chatApp";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

export default function WebRTC() {

    let socket = useMemo(() => io("http://localhost:3005"), [])

    //! UI conditional rendering for the room
    const [IsJoined, setIsJoined] = useState(false);

    //! The room
    let [room, setRoom] = useState("")
    let roomRef = useRef() as MutableRefObject<HTMLInputElement>

    //! Install peer js globally and run it as a server or in the backend
    //! Keep track of users. each user will have a peer Id to use webRTC
    let [peer] = useState<Peer>(new Peer(uuidv4(), {
        host: "localhost",
        port: 3001,
        path: "myPeer"
    }))

    let JoinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        socket.emit("join-room", { room: roomRef.current.value, peerId: peer.id });

        //TODO show the user that they have joined the room

        setRoom(roomRef.current.value)
        setIsJoined(true)
    }

    //! We are already inside the room
    let ExitRoom = () => {

        //* The user leaves the room but still has their peerId
        socket.emit("leave", { room, peerId: peer.id })
        setIsJoined(false)
    }

    // ! To get the camera access from the user -LOCAL VIDEO-
    let videoRef1 = useRef() as MutableRefObject<HTMLVideoElement>
    let videoRef2 = useRef() as MutableRefObject<HTMLVideoElement>

    useEffect(() => {

        let ShowAndShare = async () => {

            let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            //! This must be running in the initial render, so that it can listen for calls from the local user
            peer.on("call", (call) => {
                //* 2- The remote user answered the local's user call
                call.answer(stream) //* send the stream of the remote user to the local user

                console.log("runs");

                //* 2- The remote user is receiving the local's user stream
                call.on("stream", (localUserStream) => {
                    console.log(`remoteUserStream:`, localUserStream)
                    videoRef2.current.srcObject = localUserStream
                })
            })
            
            try {
                if (!IsJoined) return

                videoRef1.current.srcObject = stream

                socket.on("user-joined-the-room", ({ room, users, peerId }: { room: string, users: string[], peerId: string }) => {
                    console.log(peerId, ` has joined the room.  this is a new list of the room members:`, users);

                    //* peerId is the id of the user who joined and stream is the stream of the local user.
                    //* 1- The local user is calling the remote user(who just joined)
                    let call = peer.call(peerId, stream)

                    //* 3- The local user is receiving the remote user stream
                    call.on("stream", (remoteUserStream) => {
                        videoRef2.current.srcObject = remoteUserStream
                        console.log("works?");
                    })

                    //! When a user leave the video call
                    call.on("close", () => {})
                })
            }
            catch (err: any) {
                console.log(err.message);
            }
        }
        ShowAndShare()
    }, [socket, IsJoined])



    return (
        <div className="WebRTC">

            {
                IsJoined ?
                    <>
                        <button className="exit" onClick={ExitRoom}> exit room </button>
                        <MessagesApp socket={socket} room={room} peer={peer} />

                        {/* <ChatApp socket={socket} room={room} peer={peer} /> */}
                        <div className="ChatApp">
                            <video ref={videoRef2} autoPlay className="remote" ></video>
                            <video ref={videoRef1} autoPlay muted className="local" ></video>
                        </div>
                    </>
                    :
                    <form className="join" onSubmit={(e) => JoinRoom(e)}>
                        <label htmlFor="room">Enter the room code -to create or to join- </label>
                        <input type="text" placeholder="room code..." name="room" ref={roomRef} required />
                        <button>Join!</button>
                    </form>
            }
        </div>
    );
}

