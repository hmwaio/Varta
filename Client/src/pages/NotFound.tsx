import { Link } from "react-router-dom";
import { MessageCircleX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">

        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <MessageCircleX className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Varta
          </h1>
        </div>

        {/* 404 */}
        <h2 className="text-8xl font-bold text-gray-900 tracking-tight">
          404
        </h2>

        {/* Message */}
        <p className="mt-4 text-lg font-medium text-gray-800">
          Conversation not found
        </p>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          This chat may have been deleted or the link is no longer valid.
        </p>

        {/* Chat-style visual */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
          <div className="flex flex-col gap-2 text-sm">

            <div className="self-start bg-white px-3 py-2 rounded-xl text-gray-600 shadow-sm max-w-[80%]">
              Hey, are you there?
            </div>

            <div className="self-end bg-blue-500 text-white px-3 py-2 rounded-xl shadow-sm max-w-[80%] flex items-center gap-2">
              <span>...</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce delay-200" />
              </div>
            </div>

            <div className="self-start bg-white px-3 py-2 rounded-xl text-gray-400 shadow-sm max-w-[80%]">
              Message failed to load
            </div>

          </div>
        </div>

        {/* Action */}
        <Link
          to="/chats"
          className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 
          rounded-xl bg-gray-900 text-white text-sm font-medium 
          hover:bg-black transition-all duration-200 shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to chats
        </Link>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-400">
          Varta Web • Secure messaging
        </p>
      </div>
    </div>
  );
}