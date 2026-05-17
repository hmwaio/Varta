// import { Facebook, Github } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth.api";
import { LabeledInput } from "../../components/ui/Input";
import { useAuth } from "../../context/Auth.js";

type Step = "email" | "otp" | "registration";

function Register() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup, setUser } = useAuth();
  const navigate = useNavigate();

  /* Send OTP */
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.sendOtp({ email });
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send otp");
    } finally {
      setLoading(false);
    }
  };

  /* Verify OTP */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.verifyOtp({ email, otp });
      setTempToken(response.data.data.tempToken);
      setStep("registration");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* Complete Registration */
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({ name, password }, tempToken);
      // setUser(response.data.user);
      const me = await authAPI.getMe();
      setUser(me.data);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const signinHandler = async () => {
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#020617] px-4">
        {/* Glow background */}
        <div className="absolute w-[400px] h-80 bg-orange-500/20 blur-3xl rounded-full top-10 left-10" />
        <div className="absolute w-[400px] h-80 bg-purple-500/20 blur-3xl rounded-full bottom-10 right-10" />

        <div className="relative w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-gray-400 text-lg">
              Join <span className="text-orange-400 font-semibold">Varta</span>{" "}
              and start your journey
            </p>
          </div>

          {/* Glass Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            {error && (
              <div className="mb-4 bg-red-500/10 text-red-400 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Step 1: Email */}
            {step === "email" && (
              <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
                <LabeledInput
                  type="email"
                  value={email}
                  label="Email"
                  placeholder="Enter your email"
                  onchange={(e) => setEmail(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-full bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold hover:scale-[1.02] transition"
                >
                  {loading ? "Sending..." : "Continue with Email"}
                </button>

                <button
                  onClick={signinHandler}
                  className="h-11 rounded-full border border-white/20 text-gray-300 hover:bg-white/10 transition"
                >
                  Already have an account
                </button>

                {/* Social */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    className="h-11 rounded-full bg-black text-white font-semibold hover:bg-orange-500 transition"
                  >
                    Continue with Github
                  </button>

                  <button
                    type="button"
                    className="h-11 rounded-full bg-white text-black font-semibold hover:opacity-90 transition"
                  >
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    className="h-11 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                  >
                    Continue with Facebook
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
                <LabeledInput
                  label={`OTP sent to ${email}`}
                  value={otp}
                  placeholder="Enter 6-digit OTP"
                  onchange={(e) => setOtp(e.target.value)}
                  maxlength={6}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Change email
                </button>
              </form>
            )}

            {/* Step 3: Registration */}
            {step === "registration" && (
              <form
                onSubmit={handleCompleteSignup}
                className="flex flex-col gap-5"
              >
                <LabeledInput
                  label="Name"
                  value={name}
                  placeholder="Enter your name"
                  onchange={(e) => setName(e.target.value)}
                />

                <LabeledInput
                  type="password"
                  label="Password"
                  value={password}
                  placeholder="Create a password"
                  onchange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-full bg-linear-to-r from-emerald-500 to-green-600 text-white font-semibold hover:scale-[1.02] transition"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>

                <button
                  onClick={signinHandler}
                  className="h-11 rounded-full border border-white/20 text-gray-300 hover:bg-white/10 transition"
                >
                  I already have an account
                </button>
              </form>
            )}
          </div>

          {/* Footer branding */}
          <div className="text-center mt-6 text-sm text-gray-500">
            Built with ❤️ for conversations •{" "}
            <span className="text-orange-400">Varta</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
