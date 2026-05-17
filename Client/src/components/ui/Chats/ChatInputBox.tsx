import { EditDocument, Image, Mic, VideoFile } from "@mui/icons-material";
import { Paperclip } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSendFileTo } from "../../../hooks/messages/useSendFileTo";
import type { SendFileType } from "../../../types/message.type";
import { EmojiButton } from "../Buttons/EmojiButton";
import { ChatInput } from "./ChatInput";
import { SendMessageButton } from "./SendMessageButton";

interface Props {
  onSend: (e: React.FormEvent) => void;
  content: string;
  onFileSend: (
    fileUrl: string,
    fileType: SendFileType,
    fileName: string,
    mimeType: string,
    fileSize: number,
  ) => void;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  roomId?: string;
}

export const ChatInputBox = ({
  onSend,
  content,
  setContent,
  onFileSend,
  roomId
}: Props) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  const { uploading, progress, sendFileUpload } = useSendFileTo(
    setOpen,
    onFileSend,
  );

  // ✅ Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ Enter send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) onSend(e as any);
    }
  };

  // ✅ Handle file + reset input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: SendFileType,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sendFileUpload(file, type);
    setOpen(false);

    // reset input so same file can be selected again
    e.target.value = "";
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Hidden inputs */}
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleChange(e, "IMAGE")}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => handleChange(e, "VIDEO")}
      />
      <input
        ref={audioRef}
        type="file"
        accept="audio/*"
        hidden
        onChange={(e) => handleChange(e, "AUDIO")}
      />
      <input
        ref={docRef}
        type="file"
        accept=".pdf,.doc,.docx"
        hidden
        onChange={(e) => handleChange(e, "FILE")}
      />

      {/* Menu */}
      {open && (
        <div className="absolute bottom-14 left-2 bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-2 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-200">
          <MenuItem
            icon={<Image />}
            label="Photo"
            onClick={() => imageRef.current?.click()}
          />
          <MenuItem
            icon={<VideoFile />}
            label="Video"
            onClick={() => videoRef.current?.click()}
          />
          <MenuItem
            icon={<Mic />}
            label="Audio"
            onClick={() => audioRef.current?.click()}
          />
          <MenuItem
            icon={<EditDocument />}
            label="Document"
            onClick={() => docRef.current?.click()}
          />
        </div>
      )}

      {/* Upload indicator (better UX) */}
      {uploading && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/90 text-white text-xs px-4 py-2 rounded-full backdrop-blur-md shadow-md">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Uploading file {progress}%
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={onSend}
        className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-md"
      >
        <EmojiButton onSelect={(emoji) => setContent((p) => p + emoji)} />

        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <Paperclip className="text-gray-300" size={20} />
        </button>

        <ChatInput
          roomId={roomId}
          content={content}
          setContent={setContent}
          handleKeyDown={handleKeyDown}
        />

        <SendMessageButton content={content} />
      </form>
    </div>
  );
};

/* Reusable menu item */
const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-white transition"
  >
    <span className="opacity-80">{icon}</span>
    {label}
  </button>
);
