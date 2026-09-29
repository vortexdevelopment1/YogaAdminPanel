// Client component handling the admin login demonstration, theme toggling, and redirection to dashboard

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter email and password");
      return;
    }

    setErrorMessage("");
    // Demo login: allow any non-empty credentials and route to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative">
      {/* Theme Toggle Top Right */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-xl border border-sand bg-white text-charcoal shadow-xs hover:bg-sand/30 transition cursor-pointer"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-[#E0B45A]" />
        ) : (
          <Moon className="w-5 h-5 text-charcoal" />
        )}
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-sand p-8 md:p-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-sage text-white rounded-full flex items-center justify-center mb-3 shadow-sm">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-forest mb-1 font-serif">
            Escape in Yoga
          </h1>
          <p className="text-sm text-warmgray font-medium tracking-wide">
            Admin Panel
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-[#F8E1DE] text-[#A3382B] text-sm text-center font-medium border border-[#F8E1DE]">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-charcoal mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@escapeinyoga.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-sand bg-white text-charcoal placeholder:text-warmgray/60 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-charcoal mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-sand bg-white text-charcoal placeholder:text-warmgray/60 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-sage hover:bg-forest text-white font-medium rounded-lg shadow-sm transition-colors duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-warmgray">
          Demo login: Enter any email and password to enter
        </p>
      </div>
    </div>
  );
}
