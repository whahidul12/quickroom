import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ roomId, roomName, password, username }) {
  const { messages, status, sendMessage } = useWebSocket(
    roomId,
    password,
    username,
    true,
  );
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  }

  const statusColor =
    status === "open"
      ? "text-green-600"
      : status === "error"
        ? "text-red-600"
        : "text-gray-400";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[75vh]">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {roomName || "Chat room"}
            </h1>
            <p className="text-xs text-gray-500">
              You're chatting as{" "}
              <span className="font-medium text-gray-700">{username}</span>
            </p>
          </div>
          <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {messages.map((m, i) =>
            m.type === "system" ? (
              <div
                key={i}
                className="text-center text-xs text-gray-400 italic py-1"
              >
                {m.text}
              </div>
            ) : (
              <MessageBubble
                key={i}
                message={m}
                isOwn={m.username === username}
              />
            ),
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="p-4 border-t border-gray-200 flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
