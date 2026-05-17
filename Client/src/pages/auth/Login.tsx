// import { Github } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroImage1Copy from "../../assets/HeroImage1Copy.png";
import { LabeledInput } from "../../components/ui/Input.js";
import { useAuth } from "../../context/Auth.js";
import type { LoginInputType } from "../../types/auth.type.js";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // const { login } = useAuth();
  const [postInputs, setPostInputs] = useState<LoginInputType>({
    email: "",
    password: "",
  });

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(postInputs);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const signupHandler = async () => {
    await navigate("/signup");
  };
  const forgotAccountHandler = async () => {
    await navigate("/forgot-password");
  };

  return (
    <>
      <div className="h-full w-full overflow-hidden bg-linear-to-br from-orange-50 via-white to-orange-100 flex flex-col">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mt-6 md:mt-8">
          Welcome to <span className="text-orange-600">Varta</span>
        </h2>

        {/* Main */}
        <div className="flex flex-1 items-center justify-center px-4 md:px-10">
          <div className="w-full max-w-6xl flex rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/70 backdrop-blur-xl">
            {/* LEFT SIDE (Image + vibe) */}
            <section className="hidden md:flex w-1/2 relative items-center justify-center bg-linear-to-br from-orange-100 to-orange-50">
              {/* Glow */}
              <div className="absolute w-72 h-72 bg-orange-400/20 blur-3xl rounded-full" />

              <img
                src={HeroImage1Copy}
                alt="Varta"
                className="relative max-h-[70%] object-contain drop-shadow-xl"
              />

              {/* Floating text */}
              <div className="absolute bottom-6 text-sm text-gray-500">
                संवाद का नया रूप ✨
              </div>
            </section>

            {/* RIGHT SIDE (Form) */}
            <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
              <form
                onSubmit={loginHandler}
                className="w-full max-w-md flex flex-col gap-5"
              >
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Inputs */}
                <div className="flex flex-col gap-4">
                  <LabeledInput
                    label="Email"
                    value={postInputs.email}
                    placeholder="Enter your email"
                    onchange={(e) =>
                      setPostInputs({ ...postInputs, email: e.target.value })
                    }
                  />

                  <LabeledInput
                    label="Password"
                    value={postInputs.password}
                    type="password"
                    placeholder="Enter your password"
                    onchange={(e) =>
                      setPostInputs({ ...postInputs, password: e.target.value })
                    }
                  />
                </div>

                {/* Login */}
                <button
                  type="submit"
                  className="h-12 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition shadow-md"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>

                {/* Actions */}
                <div className="flex flex-col gap-2 text-sm">
                  <button
                    onClick={forgotAccountHandler}
                    className="text-orange-600 hover:underline"
                  >
                    Forgotten account?
                  </button>

                  <button
                    onClick={signupHandler}
                    className="text-gray-600 hover:text-black"
                  >
                    Don't have an account?
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social Buttons */}
                <button
                  type="button"
                  className="h-12 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  Continue with GitHub
                </button>

                <button
                  type="button"
                  className="h-12 rounded-full bg-white border text-gray-700 font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  Continue with Google
                </button>

                {/* Branding */}
                <div className="text-center mt-3 text-xs text-gray-400">
                  © 2026 Varta — Fast. Private. Elegant.
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
