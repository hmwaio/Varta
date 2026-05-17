import { Phone, PhoneOff } from "lucide-react";
import { useCall } from "../../../hooks/useCall";

export default function IncomingCall() {
  const { callState, remoteUser, callType, acceptCall, rejectCall } = useCall();

  if (callState !== "incoming") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 🌫️ Blurred Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* 🌌 Soft glow */}
      <div className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full" />

      {/* 📞 Call Card */}
      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in">
        {/* Avatar */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl animate-pulse" />
          <div className="w-28 h-28 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white/10 shadow-xl">
            {remoteUser?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Name */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          {remoteUser?.name}
        </h2>

        {/* Call type */}
        <p className="text-gray-300 mt-2 text-sm">
          Incoming {callType === "video" ? "Video Call" : "Audio Call"}
        </p>

        {/* Ring animation dots */}
        <div className="flex gap-1 mt-4">
          <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100" />
          <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200" />
        </div>

        {/* Buttons */}
        <div className="flex gap-6 mt-10">
          {/* Decline */}
          <button
            onClick={rejectCall}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 shadow-lg hover:scale-110 transition"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>

          {/* Accept */}
          <button
            onClick={() => acceptCall()}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 shadow-xl hover:scale-110 transition"
          >
            <Phone className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
