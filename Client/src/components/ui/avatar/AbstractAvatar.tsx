export const AbstractAvatar = () => {
  return (
    <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden shadow-xl">
      
      {/* blob shapes */}
      <div className="absolute w-20 h-20 bg-white/20 rounded-full blur-2xl top-2 left-2"></div>
      <div className="absolute w-16 h-16 bg-black/20 rounded-full blur-xl bottom-2 right-2"></div>

      {/* glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
    </div>
  );
};