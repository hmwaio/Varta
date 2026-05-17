import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  onSelect: (emoji: string) => void; // send emoji to input
};

export const EmojiButton = ({ onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".emoji-wrapper")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative emoji-wrapper">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer p-2 rounded-full hover:bg-white/10 transition"
      >
        <Smile className="text-gray-300" size={20} />
      </button>

      {/* Picker */}
      {open && (
        <div className="absolute bottom-12 left-0 z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onSelect(emojiData.emoji); // send emoji up
              setOpen(false);
            }}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
};
