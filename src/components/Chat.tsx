import React, {useState, useEffect} from "react";
import {db, auth} from "../firebase.ts";
import {
    collection,
    addDoc,
    where,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
} from "firebase/firestore";

import {IChat, IMessage} from "../types";

import styles from "./component.module.scss"

const Chat: React.FC<IChat> = ({room}) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            where("room", "==", room),
            orderBy("createdAt")
        );
        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            const messages: IMessage[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const message: IMessage = {
                    id: doc.id,
                    text: data.text,
                    createdAt: data.createdAt,
                    user: data.user
                };
                messages.push(message);
            });
            console.log(messages);
            setMessages(messages);
        });

        return () => unsuscribe();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (newMessage === "") return;
        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room,
        });

        setNewMessage("");
    };

    return (
        <div className={styles.chat_app}>
            <div className={styles.header}>
                <h1>room:
                    <span> {room}</span>
                </h1>
            </div>
            <div className={styles.messages}>
                {messages.map((message) => (
                    <div key={message.id} className={styles.message}>

                        <div className={styles.header_message}>
                            <span className={styles.user}>{message.user}</span>
                            {message.createdAt && <span
                                className={styles.time}>{new Date(message.createdAt.toDate()).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric'
                            })}</span>}
                        </div>
                        <p className={styles.text_message}>
                            {message.text}
                        </p>

                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className={styles.new_message_form}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    className={styles.new_message_input}
                    placeholder="Type your message here..."
                />
                <button type="submit" className={styles.send_button}>
                    Send
                </button>
            </form>
        </div>
    );
};


export default Chat;

