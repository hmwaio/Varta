// type WebRTCConnectionType = {
//   signalingSend: (data: any) => void;
//   onMessage?: (message: string) => void;
//   onOpen?: () => void;
//   onClose?: () => void;
// };

// export const webRTCConnection = async (config: WebRTCConnectionType) => {
//   const { signalingSend, onMessage, onOpen, onClose } = config;

//   const pc = new RTCPeerConnection({
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
//   });

//   let channel: RTCDataChannel | null = null;

//   // ICE candidates
//   pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
//     if (event.candidate) {
//       signalingSend({ candidate: event.candidate });
//     }
//   };

//   // Receive data channel
//   pc.ondatachannel = (event: RTCDataChannelEvent) => {
//     setupChannel(event.channel);
//   };

//   const setupChannel = (ch: RTCDataChannel) => {
//     channel = ch;

//     channel.onopen = () => onOpen?.();
//     channel.onmessage = (e: MessageEvent) => onMessage?.(e.data);
//     channel.onclose = () => onClose?.();
//   };

//   // Create channel (caller)
//   const createChannel = (label: string = "chat") => {
//     const ch = pc.createDataChannel(label);
//     setupChannel(ch);
//   };

//   // Offer
//   const createOffer = async () => {
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     signalingSend({ offer });
//   };

//   // Handle offer
//   const handleOffer = async (offer: RTCSessionDescriptionInit) => {
//     await pc.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     signalingSend({ answer });
//   };

//   // Handle answer
//   const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
//     await pc.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   // Handle ICE
//   const handleCandidate = async (candidate: RTCIceCandidateInit) => {
//     try {
//       await pc.addIceCandidate(new RTCIceCandidate(candidate));
//     } catch (e) {
//       console.error("ICE error:", e);
//     }
//   };

//   // Send message
//   const send = (data: string) => {
//     if (channel && channel.readyState === "open") {
//       channel.send(data);
//     }
//   };

//   // Close
//   const close = () => {
//     channel?.close();
//     pc.close();
//   };

//   return {
//     createChannel,
//     createOffer,
//     handleOffer,
//     handleAnswer,
//     handleCandidate,
//     send,
//     close
//   };
// };