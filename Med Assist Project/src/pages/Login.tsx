// src/components/Login.tsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const onLogin = async () => {
    setErr(null);
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
      nav("/"); // go to home after login
    } catch (e: any) {
      // friendly messages
      const msg =
        e?.code === "auth/user-not-found"
          ? "No user found with that email."
          : e?.code === "auth/wrong-password"
          ? "Incorrect password."
          : e?.message || "Login failed.";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2faf4] p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 text-center bg-gradient-to-r from-[#2f9bf0] to-[#5fccb3]">
          <img src="/medassist-logo.jpg" alt="MedAssist" className="mx-auto w-28 h-28 object-contain rounded-full border-2 border-white/30" />
          <h1 className="mt-4 text-2xl font-semibold text-white">Welcome to MedAssist</h1>
          <p className="mt-1 text-white/90">Sign in to continue to your health assistant</p>
        </div>

        <div className="p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5fccb3]"
            type="email"
          />

          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5fccb3]"
            type="password"
          />

          {err && <div className="text-sm text-red-600">{err}</div>}

          <button
            onClick={onLogin}
            disabled={busy || !email || !pw}
            className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] shadow hover:brightness-105 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#0ea5a4] font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
