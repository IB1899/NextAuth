import Peer from 'peerjs';
import React, { FormEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';

export default function MessagesApp({ socket, room, peer }: { socket: Socket, room: string, peer: Peer }) {

    //! the messages
    let [messages, setMessages] = useState<{ id: number, who: "fromMe" | "toMe", message: string }[]>([])

    let messageRef = useRef() as MutableRefObject<HTMLInputElement>

    //! Send the message to anyone in the room
    let SendMessages = () => {

        let message = messageRef.current.value

        if (message) {
            socket.emit("Messages-FrontEndSends-BackendReceives", { message, room })
            setMessages((prev) => [...prev, { id: Math.random() * 10, who: "fromMe", message }])
        }

        messageRef.current.value = ""
    }

    //! Runs every time we receive a message
    useEffect(() => {

        socket.on("Messages-FrontEndReceives-BackendRends", ({ message }: { message: string }) => {
            setMessages((prev) => [...prev, { id: Math.random() * 10, who: "toMe", message }])
        })
    }, [socket])


    return (
        <div className="MessagesApp">

            <h1> Messages app </h1>

            <div className="room">
                <div className="messages">

                    { //! Display the messages
                        messages.map((message) => (
                            message.who === "fromMe" ?

                                <p className="fromMe" key={message.id}> {message.message} </p>
                                :
                                <p className="toMe" key={message.id}> {message.message} </p>
                        ))
                    }
                </div>
                <div className="buttons">
                    <input type="text" ref={messageRef} placeholder="your message..." />
                    <button type="submit" onClick={SendMessages}> send </button>
                </div>

            </div>


        </div>
    )
}
