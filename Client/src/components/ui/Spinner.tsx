export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="relative w-16 h-16">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full blur-xl opacity-40 bg-linear-to-r from-blue-500 via-cyan-400 to-purple-500 animate-pulse" />

        {/* Spinner ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-400 border-b-purple-500 animate-spin" />

        {/* Inner soft dot */}
        <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-md" />
      </div>
    </div>
  );
}