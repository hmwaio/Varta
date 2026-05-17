import { Call, VideoCall } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import GetUserStatus from "../../components/Reusable/GetUserStatus.js";
import { Button } from "../../components/ui/Button.js";
import { ChatInputBox } from "../../components/ui/Chats/ChatInputBox.js";
import { MessageBubble } from "../../components/ui/Chats/messages/MessageBubble.js";
import Spinner from "../../components/ui/Spinner.js";
import { useAuth } from "../../context/Auth.js";
import { useMessageStatus } from "../../hooks/socket/useMessageStatus.js";
import { useIncomingMessages } from "../../hooks/socket/useIncomingMessage.js";
import { useFetchMessages } from "../../hooks/messages/useFetchMessages.js";
import { useReadMessages } from "../../hooks/messages/useReadMessage.js";
import { useSendFileMessage } from "../../hooks/messages/useSendFileMessage.js";
import { useSendMessage } from "../../hooks/messages/useSendMessage.js";
import { useConversationRoom } from "../../hooks/socket/useConversationRoom.js";
import { useSocket } from "../../hooks/socket/useSocket.js";
import { useTypingListener } from "../../hooks/socket/useTypingListener.js";
import { useCall } from "../../hooks/useCall.js";
import { useConversationId } from "../../hooks/useConversationId.js";
import { useFetchUser } from "../../hooks/users/useFetchUser.js";
import { useResolveUserId } from "../../hooks/users/useResolvedUserId.js";

export default function ChatPage() {
  const { user } = useAuth();
  const socket = useSocket();
  const { targetId } = useParams<{
    targetId: string;
  }>();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");

  /* ───────────────── USER ───────────────── */
  const {
    loading: fetchUserLoading,
    refetch: fetchUser,
    otherUser,
  } = useFetchUser(targetId);

  /* ─────────────── MESSAGES ─────────────── */
  const {
    loading: fetchMessagesLoading,
    refetch: fetchMessages,
    messages,
    setMessages,
  } = useFetchMessages(targetId);

  /* ───────────── SEND TEXT ───────────── */
  const sendMessage = useSendMessage(content, setContent, setMessages);

  /* ───────────── SEND FILE ───────────── */
  const { sendFileMessage } = useSendFileMessage({
    targetId,
    setMessages,
  });

  /* ───────────── FETCH CHAT ───────────── */
  useEffect(() => {
    if (!targetId) return;

    fetchUser();
    fetchMessages();
  }, [targetId]);

  /* ───────────── CALLS ───────────── */
  const { initiateCall } = useCall();

  /* ───────────── AUTO SCROLL ───────────── */
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ───────── SOCKET EVENTS ───────── */
  const roomId = useConversationId(targetId);
  const { typingUsers } = useTypingListener(roomId ?? undefined);
  const resolvedTargetId = useResolveUserId(targetId); // resolve username → UUID
  const isOtherUserTyping =
    !!resolvedTargetId && typingUsers.includes(resolvedTargetId);
  useConversationRoom(roomId ?? undefined);

  useReadMessages({
    messages,
    socket,
    user,
    targetUserId: resolvedTargetId ?? undefined,
  });
  useIncomingMessages(setMessages, scrollToBottom, roomId ?? undefined);
  useMessageStatus(setMessages);

  /* ───────────── EMPTY STATE ───────────── */
  if (!targetId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  /* ───────────── LOADING ───────────── */
  const loading = fetchUserLoading || fetchMessagesLoading;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="relative flex flex-col h-full w-full rounded-2xl overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#020617]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_40%)]" />

      {/* Wrapper */}
      <div className="relative flex flex-col h-full">
        {/* ───────────── HEADER ───────────── */}
        <div className="flex justify-between items-center px-4 py-3 backdrop-blur-md bg-white/5 border-b border-white/10">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10">
              {otherUser?.profile?.profile_picture ? (
                <img
                  src={otherUser.profile.profile_picture}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold">
                  {otherUser?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div>
              <p className="font-semibold text-white text-sm">
                {otherUser?.is_deleted ? "Deleted Account" : otherUser?.name}
              </p>

              <div className="text-xs">
                {isOtherUserTyping ? (
                  <span className="text-green-400">
                    typing<span className="animate-pulse">...</span>
                  </span>
                ) : (
                  targetId && <GetUserStatus targetUserId={targetId} />
                )}
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button targetId={targetId} />

            {/* Audio Call */}
            <button
              onClick={() =>
                initiateCall(targetId, otherUser?.name ?? "", "audio")
              }
              className="cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <Call fontSize="medium" />
            </button>

            {/* Video Call */}
            <button
              onClick={() =>
                initiateCall(targetId, otherUser?.name ?? "", "video")
              }
              className="cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <VideoCall fontSize="medium" />
            </button>
          </div>
        </div>

        {/* ───────────── MESSAGES ───────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              No messages yet. Say hi! 👋
            </p>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.message_id}
              message={message}
              isMe={message.sender_id === user?.user_id}
            />
          ))}

          <div ref={bottomRef} />
        </div>

        {/* ───────────── INPUT ───────────── */}
        <div className="p-3 border-t border-white/10 bg-white/5 backdrop-blur-md">
          <ChatInputBox
            roomId={roomId ?? undefined}
            content={content}
            setContent={setContent}
            onSend={sendMessage}
            onFileSend={sendFileMessage}
          />
        </div>
      </div>
    </div>
  );
}
