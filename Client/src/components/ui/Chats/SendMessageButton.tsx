type Props = {
  content: string;
};

export const SendMessageButton = ({ content }: Props) => {
  return (
    <button
      type="submit"
      disabled={!content.trim()}
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
      ${
        content.trim()
          ? "bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-md hover:scale-105"
          : "bg-white/10 text-gray-500 cursor-not-allowed"
      }`}
    >
      ➤
    </button>
  );
};