import React from "react";

type AvatarProps = {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
};

const sizeClasses = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-base",
  lg: "w-20 h-20 text-xl",
  xl: "w-28 h-28 text-2xl",
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
};

function getInitials(name?: string) {
  if (!name) return "🙂";
  const parts = name.split(" ");
  return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
}

export const Avatar: React.FC<AvatarProps> = ({
  name = "User",
  src,
  size = "md",
  status,
}) => {
  const initials = getInitials(name);

  return (
    <div className={`relative inline-block ${sizeClasses[size]}`}>
      {/* Glow Ring */}
      <div className="absolute inset-0 rounded-full bg-linear-to-tr from-purple-500 via-pink-500 to-indigo-500 blur-md opacity-40 scale-110"></div>

      {/* Avatar */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg">
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${statusColors[status]}`}
        />
      )}
    </div>
  );
};
