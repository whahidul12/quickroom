export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
export const WS_URL = API_URL.replace(/^http/, "ws");

export async function createRoom(roomName, password) {
  const res = await fetch(`${API_URL}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomName, password }),
  });
  if (!res.ok) throw new Error("Failed to create room");
  return res.json(); // this will give me a "roomId"
}

export async function getRoom(roomId) {
  const res = await fetch(`${API_URL}/api/rooms/${roomId}`);
  if (!res.ok) return null;
  return res.json(); // this will give me a "name"
}

export async function verifyPassword(roomId, password) {
  const res = await fetch(`${API_URL}/api/rooms/${roomId}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json(); // this will give me a status ["success" <<<True or False>>>]
}
