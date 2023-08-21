import { MutableRefObject, useEffect, useReducer, useRef, useState } from "react";
import { Socket } from "socket.io-client"; import Peer, { DataConnection } from "peerjs";
import { VideoShow } from "./video"; import Switch from "./switch";

export interface Connection { peerConnection: RTCPeerConnection }
type props = { socket: Socket, peer: Peer, room: string, }

export default function ChatApp({ socket, peer, room }: props) {

    //* For users who are in the room keeping track of their streaming
    let [users, setUsers] = useState<{ [peerId: string]: MediaStream }>({})

    //* To get the camera & audio access from the user -LOCAL VIDEO-
    let [localStream, setLocalStream] = useState<MediaStream | null>(null)

    //* Keep track of peers connections
    const [connections, setConnections] = useState<Record<string, Connection>>({});

    useEffect(() => {

        ( async () => { //* This is a self calling function
            try {
                //* To get the camera access from the user -LOCAL VIDEO-
                let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                //! This must be running in the initial render, so that it can listen for calls from the local user
                peer.on("call", (call) => {
                    //* 2- The remote user answered the local's user call
                    call.answer(stream) //* send the stream of the remote user to the local user

                    // peer.on("connection", (connection) => {
                    //     console.log("Connection event fired for peer:", connection.peer);
                    //     setConnections((prevConnections) => ({
                    //         ...prevConnections,
                    //         [connection.peer]: connection,
                    //     }));
                    // });

                    //* 2- The remote user is receiving the local's user stream
                    call.on("stream", (localUserStream) => {
                        let id = call.peer //* the Id of the local user
                        setUsers((prev) => { return { ...prev, [id]: localUserStream } })
                    })
                })

                setLocalStream(stream)

                //! Remove the user of the list of users in the room when they disconnect (frontend)
                socket.on("user-disconnected", ({ peerId }: { peerId: string }) => {

                    //* Delete a key-value pair from an object through destructuring(separate)
                    let { [peerId]: deleted, ...rest } = users

                    // delete  users[peerId]
                    setUsers(rest)
                })

                //! When a new user joins the room this will run for every user already in the room4  
                socket.on("user-joined-the-room", ({ room, users, peerId }: { room: string, users: string[], peerId: string }) => {

                    //* peerId is the id of the user who joined and stream is the stream of the local user.
                    //* 1- The local user is calling the remote user(who just joined)
                    let call = peer.call(peerId, stream)

                    // const dataConnection = peer.connect(peerId);
                    // console.log("Connection event fired for peer:", dataConnection.peer);
                    // setConnections((prevConnections) => ({
                    //     ...prevConnections,
                    //     [dataConnection.peer]: dataConnection,
                    // }))

                    //* 3- The local user is receiving the remote user stream
                    call.on("stream", (remoteUserStream) => {
                        setUsers((prev) => { return { ...prev, [peerId]: remoteUserStream } })
                    })

                    //! When a user leave the video call
                    call.on("close", () => { })
                })
            }
            catch (err: any) { console.log(err.message) }
        })()
        
    }, [socket, users])

    return (
        <div className="ChatApp">

            {/* The local's user video */}
            <VideoShow stream={localStream} />

            {/* Switching the video between 1)camera-front & camera-back 2) screen-sharing & camera-sharing 3)on & off */}
            <Switch connections={connections} setLocalStream={setLocalStream} peer={peer} />

            {users && Object.values(users).map(user => (
                <div key={Math.random() * 10}>
                    <VideoShow stream={user} />
                </div>
            ))}
        </div>
    )
}
