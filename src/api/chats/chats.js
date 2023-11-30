import { 
    URL_API,
    GET_CHATS,
    SEND_CHAT,
    GET_ACTIVE_CHATS,
 } from "../../utils/api_constants";

const getChats = async (sender_id, receiver_id) => {
    const response = await fetch(URL_API + GET_CHATS, {
        method: "POST", 
        body: JSON.stringify({
            sender_id: sender_id,
            receiver_id: receiver_id
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const resp = await response.json();
    if (response.ok){
        return resp;
    }
}

const sendChat = async (
    sender_id,
    receiver_id,
    text
) => {
    const response = await fetch(URL_API + SEND_CHAT, {
        method: "POST", 
        body: JSON.stringify({
            sender_id: sender_id,
            receiver_id: receiver_id,
            text: text
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const resp = await response.json();
    if (response.ok){
        return resp;
    }
}

const getActiveChats = async (
    sender_id
) => {
    const response = await fetch(URL_API + GET_ACTIVE_CHATS, {
        method: "POST", 
        body: JSON.stringify({
            sender_id: sender_id
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const resp = await response.json();
    if (response.ok){
        return resp;
    }
}

export {
    getChats,
    sendChat,
    getActiveChats,
};