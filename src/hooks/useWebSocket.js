import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../api/client.js";

export function useWebSocket(roomId, password, username, active) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("connecting"); // connecting | open | error | closed
  const wsRef = useRef(null);

  useEffect(() => {
    if (!active || !roomId || !password || !username) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", roomId, password, username }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "joined") {
        setStatus("open");
      } else if (data.type === "message" || data.type === "system") {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === "error") {
        setStatus("error");
      }
    };

    ws.onclose = () => setStatus("closed");
    ws.onerror = () => setStatus("error");

    return () => {
      ws.close();
    };
  }, [roomId, password, username, active]);

  function sendMessage(text) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", text }));
    }
  }

  return { messages, status, sendMessage };
}
