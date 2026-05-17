import { useEffect, useRef, type ReactNode } from "react";
import { useWebRTC } from "../hooks/webrtc/useWebRTC.js";
import { getSocket, onSocketReady } from "../lib/socket.js";
import { CallContext } from "./CallContext.js";
import type { CallType } from "../types/calls.type.js";

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const webrtc = useWebRTC();
  const offerRef = useRef<RTCSessionDescriptionInit | null>(null);
  const webrtcRef = useRef(webrtc);

  // Keep ref current without triggering re-registration
  useEffect(() => {
    webrtcRef.current = webrtc;
  });

  useEffect(() => {
    onSocketReady(() => {
      const socket = getSocket();
      if (!socket) return;

      socket.on("call:incoming", ({ callerId, type }: { callerId: string; type: CallType }) => {
        webrtcRef.current.handleIncomingCall(callerId, callerId, type);
      });

      socket.on("call:offer", ({ offer }: { offer: RTCSessionDescriptionInit }) => {
        offerRef.current = offer;
      });

      socket.on("call:answer", ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        webrtcRef.current.handleAnswer(answer);
      });

      socket.on("call:candidate", ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        webrtcRef.current.handleCandidate(candidate);
      });

      socket.on("call:ended", () => webrtcRef.current.endCall());
      socket.on("call:rejected", () => webrtcRef.current.endCall());
    });

    return () => {
      const socket = getSocket();
      if (!socket) return;
      socket.off("call:incoming");
      socket.off("call:offer");
      socket.off("call:answer");
      socket.off("call:candidate");
      socket.off("call:ended");
      socket.off("call:rejected");
    };
  }, []); // ← empty: register once only

  const acceptCallWithOffer = async (): Promise<void> => {
    if (offerRef.current) {
      await webrtcRef.current.acceptCall(offerRef.current);
    }
  };

  return (
    <CallContext.Provider value={{ ...webrtc, acceptCall: acceptCallWithOffer }}>
      {children}
    </CallContext.Provider>
  );
};