
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboard from "./dashboard";

const API_URL = "http://localhost:8080/api/admin/login";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || `Login failed (${response.status})`
        );
      }

      console.log("Login successful:", data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-white font-sans text-gray-800 md:grid-cols-2">
    
      <section className="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
       
          <div className="mb-12 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-pink-400 to-pink-700 text-2xl font-bold text-white shadow-md">
              M
            </span>

            <span className="font-bold tracking-wider">
              MYNTRA <b className="text-pink-500">ADMIN</b>
            </span>
          </div>

         
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold tracking-widest text-pink-500">
              ADMINISTRATOR PORTAL
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Sign in to manage your fashion business.
            </p>
          </div>

         
          <form onSubmit={handleLogin}>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              Email address
            </label>

            <div className="mb-5 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 focus-within:border-pink-500 focus-within:bg-white">
              <span className="mr-3 text-gray-400" aria-hidden="true">
                📧
              </span>

              <input
                id="email"
                type="email"
                placeholder="admin@myntra.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>

            <div className="mb-5 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 focus-within:border-pink-500 focus-within:bg-white">
              <span className="mr-3 text-gray-400" aria-hidden="true">
                ♙
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="ml-2 text-xs font-semibold text-pink-500 hover:text-pink-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

           
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-gray-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="accent-pink-500"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="font-semibold text-pink-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-linear-to-r from-pink-500 to-pink-700 py-3 font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && " →"}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-gray-400">
            🔒 Secure access for authorized administrators
          </p>
        </div>

        <footer className="absolute bottom-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Myntra Admin Portal
        </footer>
      </section>

    
      <section className="relative hidden flex-col justify-center overflow-hidden bg-linear-to-br from-pink-100 via-pink-200 to-pink-300 px-10 py-16 md:flex lg:px-16">
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full border border-white/60" />
        <div className="absolute -bottom-24 -right-10 h-96 w-96 rounded-full border border-white/50" />

        <div className="relative z-10">
          <span className="inline-block rounded-full border border-white bg-white/40 px-4 py-2 text-xs font-bold tracking-widest text-pink-800">
            YOUR STORE. YOUR CONTROL.
          </span>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-pink-950 lg:text-5xl">
            Fashion meets
            <br />
            smart management.
          </h2>

          <p className="mt-5 max-w-sm text-sm leading-7 text-pink-900">
            Manage your store operations from one beautiful workspace.
          </p>

          <div className="mt-12 space-y-1 text-right text-3xl font-bold tracking-widest text-white/70 lg:text-4xl">
            <p>FASHION</p>
            <p className="text-pink-700/30">STYLE</p>
            <p>MANAGEMENT</p>
          </div>
        </div>

        <div className="absolute bottom-7 left-10 right-10 flex items-center justify-between border-t border-white/60 pt-4 text-xs font-semibold tracking-widest text-pink-900">
          <span>ADMIN WORKSPACE</span>
          <span>01 / 01</span>
        </div>
      </section>
    </main>
  );
}

