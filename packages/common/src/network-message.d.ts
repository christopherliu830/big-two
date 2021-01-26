import { MessageBase } from './message';
export declare namespace Message {
    enum Type {
        Connect = "connect",
        Disconnect = "disconnect",
        ConnectError = "connect_error",
        ServerChat = "CHAT",
        ClientChat = "CLIENT_CHAT",
        SessionsData = "SESSIONS_DATA",
        Join = "JOIN",
        JoinAck = "JOIN_ACK",
        PlayCards = "PLAY_CARD"
    }
    interface MessagePayload {
    }
    class Join extends MessageBase {
        header: Type;
        payload: Join.Payload;
        constructor(payload: {
            id: string;
            name: string;
            color: string;
        });
    }
    namespace Join {
        interface Payload {
            id: string;
            name: string;
            color: string;
        }
    }
    class Chat extends MessageBase {
        header: Type;
        payload: Chat.Payload;
        constructor(payload: {
            key: string;
            message: string;
            color: string;
            sender: string;
        });
    }
    namespace Chat {
        interface Payload {
            key: string;
            message: string;
            color: string;
            sender: string;
        }
    }
    class FromClientChat extends MessageBase {
        header: Type;
        payload: FromClientChat.Payload;
        constructor(payload: {
            message: string;
        });
    }
    namespace FromClientChat {
        interface Payload {
            message: string;
        }
    }
    class SessionsData extends MessageBase {
        header: Type;
        payload: SessionsData.Payload;
        constructor(payload: SessionsData.Payload);
    }
    namespace SessionsData {
        interface Payload {
            sessions: {
                name: string;
                color?: string;
                score?: number;
                me: boolean;
            }[];
        }
    }
}
