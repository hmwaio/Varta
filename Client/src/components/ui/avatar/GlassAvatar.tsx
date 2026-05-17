import React from "react";

type AvatarProps = {
  size?: number;
};

export const GlassAvatar: React.FC<AvatarProps> = ({ size = 10 }) => {
  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400"></div>

      {/* Glass layer */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/10 border border-white/20"></div>

      {/* Abstract “faceless human” shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* head */}
          <div className="w-10 h-10 rounded-full bg-white/40 blur-[1px] mx-auto"></div>

          {/* body */}
          <div className="w-16 h-10 rounded-full bg-white/30 blur-[1px] mt-2"></div>
        </div>
      </div>

      {/* light reflection */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-white/40 via-transparent to-transparent opacity-40"></div>

      {/* glow ring */}
      <div className="absolute inset-0 rounded-full ring-1 ring-white/30"></div>
    </div>
  );
};
