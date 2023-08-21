"use client"
import { FormEvent, useLayoutEffect, useMemo, useState } from "react";
import io from "socket.io-client"; import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid"; import Peer from "peerjs";

//! They will be lazy laded. only when they are needed (when the isJoined state change)
let MessagesApp = dynamic(() => import("./messagesApp"));
let ChatApp = dynamic(() => import("./chatApp"));

export default function WebRTC() {

    let socket = useMemo(() => io("http://localhost:3005"), [])

    //! UI conditional rendering for the room
    const [IsJoined, setIsJoined] = useState(false);

    //! The room
    let [room, setRoom] = useState("")

    //! Install peer js globally and run it as a server or in the backend
    //! Keep track of users. each user will have a peer Id to use webRTC
    let [peer, setPeer] = useState<Peer>(new Peer(uuidv4(), { host: "localhost", port: 3001, path: "myPeer" }))

    let JoinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // socket.emit("join-room", { room: room, peerId: peer.id });

        //TODO show the user that they have joined the room
        setIsJoined(true)
    }

    //! We are already inside the room
    let ExitRoom = () => {

        socket.emit("leave", { peerId: peer.id, room })

        //* Destroys the Peer: closes all active connections as well as the connection to the server.
        //* Warning: The peer can no longer create or accept connections after being destroyed.
        peer.destroy()

        setPeer(new Peer(uuidv4(), { host: "localhost", port: 3001, path: "myPeer" }))
        setIsJoined(false)
        setCallStarted(false)
        setRoom("")
    }

    let [callStarted, setCallStarted] = useState(false)
    let startCall = () => {
        socket.emit("join-room", { room: room, peerId: peer.id });
        setCallStarted(true)
    }

    return (
        <div className="WebRTC">
            {IsJoined ?
                <>
                    {callStarted ?
                        <button className="do" onClick={ExitRoom}> exit room </button>
                        :
                        <button className="do" onClick={startCall}> Start call </button>
                    }
                    <MessagesApp socket={socket} room={room} />

                    <ChatApp socket={socket} peer={peer} room={room} />
                </>
                :
                <form className="join" onSubmit={(e) => JoinRoom(e)}>
                    <label htmlFor="room">Enter the room code -to create or to join- </label>

                    <input type="text" placeholder="room code..." name="room" value={room}
                        onChange={(e) => setRoom(e.target.value)} required
                    />
                    <button>Join!</button>
                </form>
            }
        </div>
    );
}