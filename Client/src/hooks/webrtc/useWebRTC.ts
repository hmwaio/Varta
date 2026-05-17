import { useCallback, useRef, useState } from "react";
import { getSocket } from "../../lib/socket.js";
import type { CallState, CallType } from "../../types/calls.type.js";
import { useCallSound } from "../calls/useCallSound.js";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: import.meta.env.VITE_TURN_URL || "turn:openrelay.metered.ca:80",
      username: import.meta.env.VITE_TURN_USERNAME || "openrelayproject",
      credential: import.meta.env.VITE_TURN_CREDENTIAL || "openrelayproject",
    },
  ],
};

export const useWebRTC = () => {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  const [callState, setCallState] = useState<CallState>("idle");
  const [callType, setCallType] = useState<CallType>("audio");
  useCallSound(callState);
  const [remoteUser, setRemoteUser] = useState<{
    username: string;
    name: string;
  } | null>(null);

  // ─── End Call ─────────────────────────────────────────────────
  const endCall = useCallback(() => {
    const socket = getSocket();
    if (remoteUser) {
      socket?.emit("call:end", { targetId: remoteUser.username });
    }
    localStreamRef.current?.getTracks().forEach((t) => {
      t.stop(); // ← releases camera/mic
    });
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current = null;
    remoteStreamRef.current = null;

    setCallState("idle");
    setRemoteUser(null);
  }, [remoteUser]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    const socket = getSocket();

    pc.onicecandidate = (e) => {
      console.log("ICE candidate:", e.candidate);
      if (e.candidate && remoteUser) {
        socket?.emit("call:candidate", {
          targetId: remoteUser.username,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      console.log("✅ ontrack fired:", e.streams);
      const stream = e.streams[0];
      remoteStreamRef.current = stream;

      // Try to attach immediately if audio element exists
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch(console.error);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        endCall();
      }
    };
    pc.onsignalingstatechange = () => {
      console.log("Signaling state:", pc.signalingState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        endCall();
      }
    };

    pcRef.current = pc;
    return pc;
  }, [remoteUser, endCall]);

  const getMedia = async (type: CallType) => {
    // const devices = await navigator.mediaDevices.enumerateDevices();
    // const obs = devices.find((d) => d.label.includes("OBS"));

    // return navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: obs ? { deviceId: obs.deviceId } : true,
    // });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video",
    });
    localStreamRef.current = stream;
    return stream;
  };

  // ─── Initiate Call ────────────────────────────────────────────
  const initiateCall = async (
    targetUsername: string,
    targetName: string,
    type: CallType,
  ) => {
    const socket = getSocket();
    setCallType(type);
    setRemoteUser({ username: targetUsername, name: targetName });
    setCallState("calling");

    const stream = await getMedia(type);
    const pc = createPeerConnection();

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: type === "video",
    });
    await pc.setLocalDescription(offer);

    socket?.emit("call:initiate", { targetId: targetUsername, type });
    socket?.emit("call:offer", { targetId: targetUsername, offer, type });
  };

  // ─── Handle Incoming Call ─────────────────────────────────────
  const handleIncomingCall = (
    callerId: string,
    callerName: string,
    type: CallType,
  ) => {
    setRemoteUser({ username: callerId, name: callerName });
    setCallType(type);
    setCallState("incoming");
  };

  // ─── Accept Call ──────────────────────────────────────────────
  const acceptCall = async (
    offer: RTCSessionDescriptionInit,
  ): Promise<void> => {
    console.log("acceptCall called with offer:", offer);
    const socket = getSocket();
    const stream = await getMedia(callType);
    console.log("local stream tracks:", stream.getTracks());
    const pc = createPeerConnection();

    stream.getTracks().forEach((track) => {
      console.log("adding track:", track.kind);
      pc.addTrack(track, stream);
    });
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    // Flush buffered ICE candidates
    for (const candidate of pendingCandidates.current) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
    pendingCandidates.current = [];

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket?.emit("call:answer", {
      targetId: remoteUser?.username,
      answer,
    });

    setCallState("active");
  };

  // ─── Handle Answer ────────────────────────────────────────────
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (pcRef.current?.signalingState !== "have-local-offer") {
      console.warn(
        "Ignoring answer — wrong signaling state:",
        pcRef.current?.signalingState,
      );
      return;
    }
    await pcRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer),
    );

    // Flush buffered candidates
    for (const candidate of pendingCandidates.current) {
      await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    }
    pendingCandidates.current = [];

    setCallState("active");
  };

  // ─── Handle ICE ───────────────────────────────────────────────
  const handleCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (pcRef.current?.remoteDescription) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        // Buffer until remote description is set
        pendingCandidates.current.push(candidate);
      }
    } catch (err) {
      console.error("ICE error:", err);
    }
  };

  // ─── Reject Call ──────────────────────────────────────────────
  const rejectCall = () => {
    const socket = getSocket();
    socket?.emit("call:reject", { targetId: remoteUser?.username });
    setCallState("idle");
    setRemoteUser(null);
  };

  return {
    callState,
    callType,
    remoteUser,
    localStreamRef,
    remoteStreamRef,
    remoteAudioRef,
    initiateCall,
    handleIncomingCall,
    acceptCall,
    handleAnswer,
    handleCandidate,
    endCall,
    rejectCall,
  };
};
