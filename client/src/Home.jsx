import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const Home = () => {
    const socket = useMemo(() => io("http://localhost:3000"), []);

    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [roomName, setRoomName] = useState("");
    const [file, setFile] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Message Send: ", message);
        const chatData = { user: "sender", body: message, file:file };
        setChat((prevChat) => [...prevChat, chatData]);
        socket.emit("message", { message, room, file });
    };

    const handleRoomName = (e) => {
        e.preventDefault();
        socket.emit("joinRoom", roomName);
        setRoomName("");
    }

    const handleFile = async (e) => {
        e.preventDefault();
        const img = {
            body: e.target.files[0],
            type: e.target.files[0].type
        }
        setFile(e.target.files[0])
    }

    useEffect(() => {
        const handleConnect = () => {
            console.log("Server Connected Successfully!");
            console.log("ID: ", socket.id);
        };

        const handleMessage = (message) => {
            console.log("received: ",message)
            const chatData = { user: "receiver", body: message };
            setChat((prevChat) => [...prevChat, chatData]);
            console.log("Message Received: ", message);
        };

        socket.on("connect", handleConnect);
        socket.on("sendMessage", handleMessage);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("sendMessage", handleMessage);
        };
    }, [socket]);

    return (
        <div className='p-4 text-white w-full h-screen bg-slate-950'>
            <header className="w-full h-1/6 flex justify-center items-center">
                <div className="p-2 flex justify-center items-center w-2/12 rounded-full text-4xl text-cyan-300 bg-slate-800 shadow-lg ">
                    Socket.IO
                </div>
            </header>
            <section className="py-4 h-5/6 flex justify-center items-center">
                <form onSubmit={handleSubmit} className="pt-10 w-5/12 rounded-lg bg-cyan-300 opacity-90 flex flex-col gap-4 p-6 shadow-lg ">
                    <input 
                        type="text" 
                        onChange={(e) => setRoom(e.target.value)} 
                        className="p-3 w-full h-16 rounded-lg bg-cyan-800 border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                        placeholder="Room ID"
                    />
                    <div className="flex w-full gap-4">
                        <input 
                            type="text" 
                            onChange={(e) => setRoomName(e.target.value)} 
                            className="p-3 flex-1 h-16 rounded-lg bg-cyan-800 border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                            placeholder="Room Name"
                        />
                        <input onChange={handleFile}
                            type="file" 
                            className="p-3 flex-1 w-1/12 h-16 rounded-lg bg-cyan-800 border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                        />
                        <button 
                            onClick={handleRoomName}
                            className="h-16 w-1/6 text-2xl bg-blue-600 rounded-lg p-2 text-white font-semibold shadow-md transition-colors duration-300 hover:bg-blue-700"
                        >
                            Join
                        </button>
                    </div>
                    <div className="flex w-full gap-4">
                        <textarea 
                            type="text" 
                            onChange={(e) => setMessage(e.target.value)} 
                            className="p-3 flex-1 h-20 rounded-lg bg-cyan-800 border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                            placeholder="Message"
                        />
                        <button 
                            type="submit" 
                            className="h-20 w-1/6 text-2xl bg-blue-600 rounded-lg p-2 text-white font-semibold shadow-md transition-colors duration-300 hover:bg-blue-700"
                        >
                            Send
                        </button>
                    </div>
                    <div className="border-2 border-cyan-500 rounded-lg h-72 overflow-y-auto bg-cyan-900 p-4">
                        {chat.map((item, index) => (<div key={index} className={`p-2 mb-2 rounded-lg text-white shadow-md ${item.user === 'sender' ? 'bg-cyan-600 text-right self-end' : 'bg-cyan-800 text-left self-start'}`} style={{ alignSelf: item.user === 'sender' ? 'flex-end' : 'flex-start' }}>
                        <div className="flex items-center">
                            <span className={`bg-cyan-400 text-white rounded-full px-3 py-1 mr-2 ${item.user === 'sender' ? 'bg-cyan-500' : 'bg-cyan-400'}  `}>
                                {item.user === 'sender' ? 'R' : 'S'}
                            </span>
                            <span>{console.log("send", item) && item.body}</span>
                        </div>
                        </div>))}
                    </div>
                </form>
            </section>
        </div>
    );
};

export default Home;
