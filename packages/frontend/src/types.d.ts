export interface ChatMessage {
  color?: string; // Color of the chat message
  sender: string; // Name of player who sent it
  message: string; // Message contents
  system: boolean; // Whether the message came from system
}

export interface PlayerInfo {
  id: string; // uuid of player
  name: string; // Player-inputted name
  score: number; // Current player score
}

export interface AppProps {
  chats: ChatMessage[];
  playerInfos: PlayerInfo[];
  onStartupPromptClose?: (arg0: string) => void;
  onChatSend?: (arg0: string) => void;
}
