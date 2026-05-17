// import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useCall } from "../../../hooks/useCall.js";

// export default function ActiveCall() {
//   const {
//     callState,
//     remoteUser,
//     callType,
//     remoteAudioRef,
//     remoteStreamRef,
//     localStreamRef,
//     endCall,
//   } = useCall();

//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const [muted, setMuted] = useState(false);
//   const [videoOff, setVideoOff] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);

//   // Callback ref — attaches stream when audio element mounts
//   const audioCallbackRef = useCallback(
//     (node: HTMLAudioElement | null) => {
//       remoteAudioRef.current = node;
//       if (node && remoteStreamRef.current) {
//         node.srcObject = remoteStreamRef.current;
//         node.play().catch(console.error);
//       }
//     },
//     [remoteAudioRef, remoteStreamRef],
//   );

//   const remoteVideoCallbackRef = useCallback(
//     (node: HTMLVideoElement | null) => {
//       remoteVideoRef.current = node;
//       if (node && remoteStreamRef.current) {
//         node.srcObject = remoteStreamRef.current;
//         node.play().catch(console.error);
//       }
//     },
//     [remoteVideoRef, remoteStreamRef],
//   );

//   // Video streams
//   useEffect(() => {
//     if (callType !== "video") return;
//     if (localStreamRef.current && localVideoRef.current) {
//       localVideoRef.current.srcObject = localStreamRef.current;
//     }
//     if (remoteStreamRef.current && remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = remoteStreamRef.current;
//     }
//   }, [callType, callState, localStreamRef, remoteStreamRef]);

//   const toggleMute = () => {
//     localStreamRef.current
//       ?.getAudioTracks()
//       .forEach((t) => (t.enabled = !t.enabled));
//     setMuted((prev) => !prev);
//   };

//   const toggleVideo = () => {
//     localStreamRef.current
//       ?.getVideoTracks()
//       .forEach((t) => (t.enabled = !t.enabled));
//     setVideoOff((prev) => !prev);
//   };

//   if (callState !== "active" && callState !== "calling") return null;

//   return (
//     <>
//       {/* 🔳 FULLSCREEN MODE */}
//       {!isMinimized && (
//         <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/80 backdrop-blur-xl">
//           {/* Hidden audio */}
//           <audio ref={audioCallbackRef} autoPlay />

//           {/* 🎥 VIDEO AREA */}
//           {callType === "video" && (
//             <div className="relative flex-1">
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 className="w-full h-full object-cover"
//               />

//               {/* Local preview */}
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 muted
//                 className="absolute bottom-6 right-6 w-28 h-36 rounded-xl object-cover border-2 border-white shadow-lg"
//               />

//               {/* Minimize button */}
//               <button
//                 onClick={() => setIsMinimized(true)}
//                 className="absolute top-6 right-6 bg-black/50 p-2 rounded-full hover:bg-black/70"
//               >
//                 ⤵
//               </button>
//             </div>
//           )}

//           {/* 🎧 AUDIO MODE (no video) */}
//           {callType !== "video" && (
//             <div className="flex flex-col items-center justify-center flex-1 text-white">
//               <div className="w-28 h-28 rounded-full bg-purple-500 flex items-center justify-center text-4xl font-bold mb-6 shadow-lg">
//                 {remoteUser?.name?.charAt(0).toUpperCase()}
//               </div>

//               <h2 className="text-2xl font-semibold">{remoteUser?.name}</h2>
//               <p className="text-gray-400 mt-2">
//                 {callState === "calling" ? "Calling..." : "Connected"}
//               </p>

//               {/* Minimize */}
//               <button
//                 onClick={() => setIsMinimized(true)}
//                 className="absolute top-6 right-6 bg-black/50 px-3 py-1 rounded-full"
//               >
//                 Minimize
//               </button>
//             </div>
//           )}

//           {/* 🎛 CONTROLS */}
//           <div className="flex justify-center items-center gap-6 py-6">
//             {/* Mute */}
//             <button
//               onClick={toggleMute}
//               className={`p-4 rounded-full ${
//                 muted ? "bg-red-500" : "bg-white/20"
//               }`}
//             >
//               {muted ? (
//                 <MicOff className="text-white" />
//               ) : (
//                 <Mic className="text-white" />
//               )}
//             </button>

//             {/* Video toggle */}
//             {callType === "video" && (
//               <button
//                 onClick={toggleVideo}
//                 className={`p-4 rounded-full ${
//                   videoOff ? "bg-red-500" : "bg-white/20"
//                 }`}
//               >
//                 {videoOff ? (
//                   <VideoOff className="text-white" />
//                 ) : (
//                   <Video className="text-white" />
//                 )}
//               </button>
//             )}

//             {/* End Call */}
//             <button
//               onClick={endCall}
//               className="p-5 rounded-full bg-red-600 hover:bg-red-700"
//             >
//               <Phone className="text-white rotate-135" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 📦 MINIMIZED MODE */}
//       {isMinimized && (
//         <div
//           onClick={() => setIsMinimized(false)}
//           className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 w-64 cursor-pointer hover:scale-105 transition"
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
//               {remoteUser?.name?.charAt(0).toUpperCase()}
//             </div>

//             <div>
//               <p className="text-white text-sm font-semibold">
//                 {remoteUser?.name}
//               </p>
//               <p className="text-green-400 text-xs">
//                 {callState === "calling" ? "Calling..." : "Tap to return"}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }






import {
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
  Minimize2,
  Signal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCall } from "../../../hooks/useCall.js";

export default function ActiveCall() {
  const {
    callState,
    remoteUser,
    callType,
    remoteAudioRef,
    remoteStreamRef,
    localStreamRef,
    endCall,
  } = useCall();

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // 🎯 Call Timer
  const [seconds, setSeconds] = useState(0);

  // 📶 Fake Network Strength (replace with real later)
  const [network, setNetwork] = useState(4); // 1–4 bars

  // 🎤 Speaking animation
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 🖱 Dragging
  const dragRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragging = useRef(false);

  // ⏱ Timer logic
  useEffect(() => {
    if (callState !== "active") return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 🎤 Detect speaking (basic)
  useEffect(() => {
    const interval = setInterval(() => {
      const speaking = Math.random() > 0.6; // simulate
      setIsSpeaking(speaking);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 🖱 Drag logic
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPosition({
        x: e.clientX - 100,
        y: e.clientY - 40,
      });
    };

    const stopDrag = () => (dragging.current = false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  const startDrag = () => {
    dragging.current = true;
  };

  // 🎧 Audio attach
  const audioCallbackRef = useCallback(
    (node: HTMLAudioElement | null) => {
      remoteAudioRef.current = node;
      if (node && remoteStreamRef.current) {
        node.srcObject = remoteStreamRef.current;
        node.play().catch(console.error);
      }
    },
    [remoteAudioRef, remoteStreamRef]
  );

  // 🎥 Attach video
  useEffect(() => {
    if (callType !== "video") return;

    if (localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    if (remoteStreamRef.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [callType, callState]);

  const toggleMute = () => {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setMuted((p) => !p);
  };

  const toggleVideo = () => {
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setVideoOff((p) => !p);
  };

  if (callState !== "active" && callState !== "calling") return null;

  return (
    <>
      {/* 🔳 FULLSCREEN */}
      {!isMinimized && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between">

          <audio ref={audioCallbackRef} autoPlay />

          {/* 🎥 VIDEO */}
          {callType === "video" && (
            <div className="relative flex-1">
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-full object-cover"
              />

              {/* Local preview */}
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="absolute bottom-6 right-6 w-32 h-40 rounded-xl border border-white"
              />

              {/* Top bar */}
              <div className="absolute top-4 left-4 flex items-center gap-3 text-white">
                <Signal className="w-5 h-5" />
                <span>{formatTime()}</span>
              </div>

              <button
                onClick={() => setIsMinimized(true)}
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
              >
                <Minimize2 />
              </button>
            </div>
          )}

          {/* 🎧 AUDIO */}
          {callType !== "video" && (
            <div className="flex flex-col items-center justify-center flex-1 text-white">
              <div
                className={`w-32 h-32 rounded-full bg-purple-500 flex items-center justify-center text-5xl font-bold mb-6 ${
                  isSpeaking ? "animate-pulse" : ""
                }`}
              >
                {remoteUser?.name?.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-2xl font-semibold">{remoteUser?.name}</h2>
              <p className="text-gray-400 mt-2">{formatTime()}</p>

              <button
                onClick={() => setIsMinimized(true)}
                className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full"
              >
                Minimize
              </button>
            </div>
          )}

          {/* 🎛 CONTROLS */}
          <div className="flex justify-center gap-6 py-6">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full ${
                muted ? "bg-red-500" : "bg-white/20"
              }`}
            >
              {muted ? <MicOff /> : <Mic />}
            </button>

            {callType === "video" && (
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full ${
                  videoOff ? "bg-red-500" : "bg-white/20"
                }`}
              >
                {videoOff ? <VideoOff /> : <Video />}
              </button>
            )}

            <button
              onClick={endCall}
              className="p-5 rounded-full bg-red-600"
            >
              <Phone className="rotate-135" />
            </button>
          </div>
        </div>
      )}

      {/* 📦 MINIMIZED (DRAGGABLE) */}
      {isMinimized && (
        <div
          ref={dragRef}
          onMouseDown={startDrag}
          style={{ top: position.y, left: position.x }}
          className="fixed z-50 w-64 cursor-move bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-3"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              {remoteUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">
                {remoteUser?.name}
              </p>
              <p className="text-green-400 text-xs">
                {formatTime()} • Tap to return
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}