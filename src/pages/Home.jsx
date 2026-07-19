import { useState } from "react";
import { createRoom } from "../api/client.js";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setUrl("");

    if (!roomName.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const { roomId } = await createRoom(roomName.trim(), password);
      const link = `${window.location.origin}/room/${roomId}`;
      setUrl(link);
    } catch {
      setError("Something went wrong creating the room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Create a private chat room
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Set a name and password, then share the generated link.
        </p>

        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Room password"
            autocomplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700  disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Generate Room URL"}
          </button>
        </form>

        {url && (
          <div className="mt-4 p-3 flex justify-between bg-green-50 border border-green-200 rounded-md text-sm text-gray-700 break-all">
            <div>
              Share this link with your friends:
              <br />
              <a href={url} className="text-blue-600 underline break-all">
                {url}
              </a>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(url)}
              className="p-2 min-w-14 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700  disabled:cursor-not-allowed transition-colors"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
