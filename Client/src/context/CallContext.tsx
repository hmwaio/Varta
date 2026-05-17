import { createContext } from "react";
import { useWebRTC } from "../hooks/webrtc/useWebRTC.js";

type CallContextType = Omit<ReturnType<typeof useWebRTC>, "acceptCall"> & {
  acceptCall: () => Promise<void>;
};

export const CallContext = createContext<CallContextType | null>(null);
