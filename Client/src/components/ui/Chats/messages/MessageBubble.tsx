import type { Message } from "../../../../types/message.type";

import { MessageStatus } from "../MessageStatus";
import { AudioMessage } from "./AudioMessage";
import { FileMessage } from "./FileMessage";
import { ImageMessage } from "./ImageMessage";
import { TextMessage } from "./TextMessage";
import { VideoMessage } from "./VideoMessage";

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export const MessageBubble = ({ message, isMe }: MessageBubbleProps) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case "IMAGE":
        return (
          <ImageMessage
            src={message.content}
            alt={message.file_name || "image"}
          />
        );

      case "VIDEO":
        return (
          <VideoMessage src={message.content} mimeType={message.mime_type} />
        );

      case "AUDIO":
        return (
          <AudioMessage src={message.content} mimeType={message.mime_type} />
        );

      case "FILE":
        return (
          <FileMessage
            url={message.content}
            fileName={message.file_name || "file"}
          />
        );

      default:
        return <TextMessage content={message.content} />;
    }
  };

  return (
    <div
      className={`flex w-full ${
        isMe ? "justify-end pl-12" : "justify-start pr-12"
      }`}
    >
      <div className="relative max-w-[82%] md:max-w-[64%] group">
        {/* Glow */}
        <div
          className={`
        absolute inset-0 rounded-[28px]
        blur-2xl opacity-40
        transition-all duration-500
        group-hover:opacity-60
        ${isMe ? "bg-emerald-500/30" : "bg-blue-500/20"}
      `}
        />

        {/* Bubble */}
        <div
          className={`
        relative overflow-hidden
        rounded-[28px]
        px-4 py-3
        border
        backdrop-blur-2xl
        shadow-2xl
        transition-all duration-300
        hover:scale-[1.01]
        ${
          isMe
            ? `
              bg-linear-to-br
              from-emerald-500/95
              via-green-500/90
              to-teal-600/95
              border-white/10
              text-white
              rounded-br-md
            `
            : `
              bg-white/[0.07]
              border-white/10
              text-white
              rounded-bl-md
            `
        }
      `}
        >
          {/* Glass Reflection */}
          <div
            className="
          absolute inset-0
          bg-linear-to-br
          from-white/10
          via-transparent
          to-transparent
          pointer-events-none
        "
          />

          {/* Animated top line */}
          <div
            className={`
          absolute top-0 left-0 right-0 h-px
          ${isMe ? "bg-white/30" : "bg-cyan-400/20"}
        `}
          />

          {/* Message Content */}
          <div className="relative z-10">{renderMessageContent()}</div>

          {/* Footer */}
          <div className="relative z-10 mt-2 flex items-center justify-end gap-2">
            {/* Time */}
            <span
              className={`
            text-[10px]
            tracking-wide
            ${isMe ? "text-white/75" : "text-white/45"}
          `}
            >
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {/* Status */}
            {isMe && (
              <div
                className="
              flex items-center justify-center
              min-w-4
            "
              >
                <MessageStatus status={message.status} />
              </div>
            )}
          </div>

          {/* Floating Orb */}
          <div
            className={`
          absolute -top-8 -right-8
          h-20 w-20
          rounded-full blur-3xl
          opacity-30
          pointer-events-none
          ${isMe ? "bg-emerald-300" : "bg-cyan-400"}
        `}
          />
        </div>
      </div>
    </div>
  );
};
