import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { verifyPassword, getRoom } from "../api/client.js";
import ChatBox from "../components/ChatBox.jsx";

export default function Room() {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [password, setPassword] = useState(""); // confirmed hobar pore ei password diye ws join korbe
  const [username, setUsername] = useState(""); // confirmed hobar pore ei name diye ws join korbe

  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getRoom(roomId).then((data) => {
      if (cancelled) return;
      if (!data) setNotFound(true);
      else setRoomName(data.name);
    });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  async function handleUnlock(e) {
    e.preventDefault();
    setError("");

    const trimmedName = inputName.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!inputPassword) {
      setError("Please enter the room password.");
      return;
    }

    setChecking(true);
    try {
      const { success } = await verifyPassword(roomId, inputPassword);
      if (success) {
        setPassword(inputPassword);
        setUsername(trimmedName);
        setUnlocked(true);
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setChecking(false);
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Room not found
          </h1>
          <p className="text-sm text-gray-500">
            This room may have expired or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Join{roomName ? ` "${roomName}"` : " this room"}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your name and the room password to continue.
          </p>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <input
              type="password"
              placeholder="Room password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={checking}
              className="w-full py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700  disabled:cursor-not-allowed transition-colors"
            >
              {checking ? "Checking..." : "Join Chat"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <ChatBox
      roomId={roomId}
      roomName={roomName}
      password={password}
      username={username}
    />
  );
}
