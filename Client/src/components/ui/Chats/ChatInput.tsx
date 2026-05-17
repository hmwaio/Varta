import { useTyping } from "../../../hooks/socket/useTyping";

type ChatInputType = {
  roomId?: string;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const ChatInput = ({
  roomId,
  content,
  setContent,
  handleKeyDown,
}: ChatInputType) => {
  const { startTyping, stopTyping } = useTyping(roomId);
  return (
    <div>
      <input
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          startTyping();
        }}
        onKeyDown={handleKeyDown}
        onBlur={stopTyping}
        placeholder="Type a message..."
        className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 px-2 py-2 focus:outline-none"
      />
    </div>
  );
};
