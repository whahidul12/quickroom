export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
      {!isOwn && (
        <span className="text-xs text-gray-500 mb-0.5 ml-1">
          {message.username}
        </span>
      )}
      <div
        className={`max-w-[75%] px-3 py-2 rounded-lg text-sm wrap-break-word ${
          isOwn
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
