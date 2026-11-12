

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:8080/api/admin";
const RESEND_WAIT_SECONDS = 30;

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);

 
  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = setTimeout(() => {
      setResendSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendSeconds]);

  // it will use for  API request
  async function apiRequest(endpoint, body) {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed (${response.status}).`
        );
      }

      return data;
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // it will used to Generate OTP
  async function sendOtp(event) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    const data = await apiRequest("forgot-password", {
      email: normalizedEmail,
    });

    if (!data) return;

    const generatedOtp = data.demoOtp ?? data.otp;

    setEmail(normalizedEmail);
    setOtp("");
    setDemoOtp(String(generatedOtp ?? ""));
    setStep(2);
    setResendSeconds(RESEND_WAIT_SECONDS);

    setMessage("OTP generated for your registered admin account.");

    if (generatedOtp !== undefined && generatedOtp !== null) {
      window.alert(`Your OTP is: ${generatedOtp}`);
    }
  }

  
  async function resendOtp() {
    if (resendSeconds > 0 || loading) return;  //it will resend otp

    const data = await apiRequest("forgot-password", {
      email: email.trim().toLowerCase(),
    });

    if (!data) return;

    const generatedOtp = data.demoOtp ?? data.otp;

    setOtp("");
    setDemoOtp(String(generatedOtp ?? ""));
    setResendSeconds(RESEND_WAIT_SECONDS);

    setMessage("A new demo OTP has been generated.");

    if (generatedOtp !== undefined && generatedOtp !== null) {
      window.alert(`Your new OTP is: ${generatedOtp}`);
    } else {
      window.alert(
        "The request succeeded, but the backend did not return the OTP. Please check the backend response."
      );
    }
  }

  
  async function verifyOtp(event) {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete 6-digit OTP.");
      return;
    }

    const data = await apiRequest("verify-otp", {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
    });

    if (!data) return;

    setDemoOtp("");
    setMessage("");
    setStep(3);
  }

 
  async function resetPassword(event) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

    if (!passwordPattern.test(newPassword)) {
      setError(
        "Use at least 6 characters with uppercase, lowercase, a number and a special symbol."
      );
      return;
    }

    const data = await apiRequest("reset-password", {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      newPassword,
    });

    if (!data) return;

    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
    setDemoOtp("");
    setStep(4);
    setMessage("Your password has been updated successfully.");
  }

 
  const inputClass =
    "mb-5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-500 focus:bg-white";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  const buttonClass =
    "w-full rounded-lg bg-gradient-to-r from-pink-500 to-pink-700 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60";

  const linkClass =
    "mx-auto mt-5 block cursor-pointer px-2 py-2 text-sm font-semibold text-pink-600 hover:text-pink-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-pink-50 via-pink-50 to-purple-50 px-4 py-6">
      <section className="w-full max-w-md rounded-2xl border border-pink-100 bg-white p-6 shadow-xl sm:p-10">
      
        <div className="mb-8 flex items-center gap-3 sm:mb-9">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-pink-400 to-pink-700 text-2xl font-bold text-white shadow-md">
            M
          </span>

          <span className="text-sm font-extrabold tracking-wider text-gray-800">
            MYNTRA <b className="text-pink-500">ADMIN</b>
          </span>
        </div>

       
        {step < 4 && (
          <div className="mb-8 flex gap-2">
            {[1, 2, 3].map((number) => (
              <span
                key={number}
                className={`h-1 flex-1 rounded-full ${
                  number <= step ? "bg-pink-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

       {/* this is used for need to send mail */}
        {step === 1 && (
          <>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-pink-50 text-2xl text-pink-600">
              ✉
            </div>

            <h1 className="mb-3 text-2xl font-bold text-gray-800 sm:text-3xl">
              Forgot password?
            </h1>

            <p className="mb-7 text-sm leading-7 text-gray-500">
              Enter your registered admin email address to generate a
               OTP.
            </p>

            <form onSubmit={sendOtp}>
              <label htmlFor="reset-email" className={labelClass}>
                Admin email address
              </label>

              <input
                id="reset-email"
                type="email"
                autoComplete="username"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className={inputClass}
              />

              <button
                type="submit"
                className={buttonClass}
                disabled={loading}
              >
                {loading ? "Generating OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

       
        {step === 2 && (
          <>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-pink-50 text-2xl text-pink-600">
              ✳
            </div>

            <h1 className="mb-3 text-2xl font-bold text-gray-800 sm:text-3xl">
              Verify OTP
            </h1>

            <p className="mb-7 wrap-break-word text-sm leading-7 text-gray-500">
              Enter the 6-digit code for <b>{email}</b>.
            </p>

            {demoOtp && (
              <div
                className="mb-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-pink-400 bg-pink-50 p-4 text-center"
                role="status"
              >
                <strong className="text-xs font-bold text-pink-800">
                  Get An OTP
                </strong>

                <span className="break-all text-2xl font-bold tracking-widest text-pink-600">
                  {demoOtp}
                </span>

                <small className="text-xs leading-5 text-gray-500">
                  For local testing only. Never expose OTPs in production.
                </small>
              </div>
            )}

            <form onSubmit={verifyOtp}>
              <label htmlFor="reset-otp" className={labelClass}>
                6-digit OTP
              </label>

              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, ""))
                }
                required
                className={inputClass}
              />

              <button
                type="submit"
                className={buttonClass}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <button
              type="button"
              className={linkClass}
              disabled={loading || resendSeconds > 0}
              onClick={resendOtp}
            >
              {resendSeconds > 0
                ? `Resend OTP in ${resendSeconds}s`
                : "Resend OTP"}
            </button>
          </>
        )}

       
        {step === 3 && (
          <>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-pink-50 text-2xl text-pink-600">
              🔒
            </div>

            <h1 className="mb-3 text-2xl font-bold text-gray-800 sm:text-3xl">
              Reset Password
            </h1>

            <p className="mb-7 text-sm leading-7 text-gray-500">
              Create a new password for your admin account.
            </p>

            <form onSubmit={resetPassword}>
              <label htmlFor="new-password" className={labelClass}>
                New Password
              </label>

              <div className="mb-5 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 focus-within:border-pink-500">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  className="ml-2 text-xs font-bold text-pink-600 hover:text-pink-800"
                  onClick={() =>
                    setShowNewPassword((visible) => !visible)
                  }
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label htmlFor="confirm-password" className={labelClass}>
                Confirm Password
              </label>

              <div className="mb-5 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 focus-within:border-pink-500">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  className="ml-2 text-xs font-bold text-pink-600 hover:text-pink-800"
                  onClick={() =>
                    setShowConfirmPassword((visible) => !visible)
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mb-6 text-center text-xs leading-6 text-gray-500">
                Use at least 6 characters with uppercase, lowercase, a
                number and a special symbol.
              </p>

              <button
                type="submit"
                className={buttonClass}
                disabled={loading}
              >
                {loading ? "Updating password..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

       
        {step === 4 && (
          <>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-3xl text-green-600">
              ✓
            </div>

            <h1 className="mb-3 text-2xl font-bold text-gray-800 sm:text-3xl">
              Password reset successful!
            </h1>

            <p className="mb-7 text-sm leading-7 text-gray-500">
              Your password has been updated. Sign in with your
              registered email and new password.
            </p>

            <button
              type="button"
              className={buttonClass}
              onClick={() => navigate("/login", { replace: true })}
            >
              Go to Login
            </button>
          </>
        )}

       
        {message && step < 4 && (
          <p
            className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-700"
            role="status"
          >
            {message}
          </p>
        )}

        
        {error && (
          <p
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

       
        {step < 4 && (
          <button
            type="button"
            className={linkClass}
            onClick={() => navigate("/login")}
          >
            ← Back to Sign In
          </button>
        )}
      </section>
    </main>
  );
}

