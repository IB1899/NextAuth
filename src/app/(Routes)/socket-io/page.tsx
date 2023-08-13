// "use client"
// import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react"
// import io from "socket.io-client"

export default function SocketIO() {

//     // ! 1- Frontend connection
//     let socket = useMemo(() => io("http://localhost:3005"), [])

//     let [messages, setMessages] = useState<{ id: number, message: string, who: "FromMe" | "ToMe" }[]>([])

//     let TheMessageToSend = useRef() as MutableRefObject<HTMLInputElement>
//     let TheRoomCode = useRef() as MutableRefObject<HTMLInputElement>

//     let joinRoom = () => {
//         if (TheRoomCode.current.value !== "") socket.emit("join_room", { room: TheRoomCode.current.value })
//     }

//     let sendMessage = () => {
//         let message = TheMessageToSend.current.value
//         let room = TheRoomCode.current.value;

//         if (message !== "" && room !== "") {
//             //! 2- Frontend sends
//             socket.emit("key1", { message, room })

//             //! This runs asynchronously & we can't await it 
//             setMessages((prev) => [...prev, { id: Date.now(), who: "FromMe", message }])
//             TheMessageToSend.current.value = "";
//         }
//     }

//     useEffect(() => {
//         //! 3- Frontend receives
//         socket.on('key2', ({ message }) => {

//             setMessages((prev) => [...prev, { id: Date.now(), who: "ToMe", message }])
//         })
//     }, [socket])

//     return (
//         <div className='SocketIo' >
//             <input type="text" placeholder="Room code" ref={TheRoomCode} />
//             <button onClick={joinRoom} >Join Room</button>

//             <input type="text" placeholder="message" ref={TheMessageToSend} />
//             <button onClick={sendMessage}>Send Message</button>

//             <div className="messages">
//                 {messages && messages.map((one) => (

//                     one.who === "FromMe" ?
//                         <p className="fromMe" key={one.id}> {one.message} </p>
//                         :
//                         <p className="toMe" key={one.id}> {one.message} </p>
//                 ))}
//             </div>
//         </div>
//     )
}
