import { useNavigate } from "react-router-dom";
import { Feather, Sparkles } from "lucide-react";

function RootPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full overflow-hidden relative text-white flex flex-col font-[Inter]">

      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-[#070a14]" />

      {/* Gradient aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.18),transparent_40%)]" />

      {/* Floating blur orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-pink-500/20 blur-3xl rounded-full" />

      {/* 🕊️ subtle cultural icon */}
      <Feather className="absolute top-10 left-10 text-white/10 w-20 h-20 rotate-12" />
      <Sparkles className="absolute bottom-10 right-10 text-white/10 w-16 h-16" />

      {/* MAIN */}
      <div className="relative flex flex-col items-center justify-center flex-1 px-6 text-center">

        {/* LOGO */}
        <h1 className="text-5xl md:text-7xl font-[Playfair_Display] font-bold tracking-wide bg-linear-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
          Varta
        </h1>

        {/* TAGLINE */}
        <h2 className="mt-4 text-xl md:text-3xl font-medium max-w-xl leading-snug">
          संवाद का नया रूप  
          <br />
          <span className="text-indigo-400">
            Messaging that feels alive
          </span>
        </h2>

        <p className="mt-3 text-gray-400 max-w-md text-sm">
          From ancient messengers to instant chats —  
          experience communication reimagined.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => navigate("/signup")}
            className="px-7 py-2.5 rounded-full bg-white text-black font-semibold hover:scale-105 transition shadow-lg"
          >
            Start Your Varta
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-7 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Continue
          </button>
        </div>

        {/* HERO */}
        <div className="relative mt-8 flex justify-center items-center">

          {/* Glow */}
          <div className="absolute w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 blur-3xl rounded-full" />

          <img
            src="/Root.png"
            alt="Varta"
            className="rounded-2xl max-h-[52vh] object-contain drop-shadow-2xl transition duration-500 hover:scale-[1.03]"
          />

          {/* Floating UI chips */}
          <div className="absolute top-6 left-4 hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
            🕊️ Fast Delivery
          </div>

          <div className="absolute bottom-6 right-4 hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
            🔒 Private
          </div>

          <div className="absolute bottom-16 left-10 hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
            ⚡ Instant
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="h-10 flex items-center justify-center gap-6 text-xs text-gray-500">
        <span>About</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>© 2026 Varta</span>
      </footer>
    </div>
  );
}

export default RootPage;