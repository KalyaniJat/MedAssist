// src/components/Signup.tsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const onSignup = async () => {
    setErr(null);
    if (pw !== confirmPw) {
      setErr("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pw);
      nav("/"); // after signup, go home
    } catch (e: any) {
      setErr(e?.message ?? "Unable to create account");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2faf4] p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 text-center bg-gradient-to-r from-[#2f9bf0] to-[#5fccb3]">
          <img src="/medassist-logo.jpg" alt="MedAssist" className="mx-auto w-24 h-24 object-contain rounded-full border-2 border-white/30" />
          <h1 className="mt-3 text-2xl font-semibold text-white">Create your MedAssist account</h1>
        </div>

        <div className="p-6 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-gray-200 rounded-lg px-4 py-2" />
          <input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2" />
          <input value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirm password" type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2" />

          {err && <div className="text-red-600 text-sm">{err}</div>}

          <button onClick={onSignup} disabled={busy || !email || !pw || !confirmPw} className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] shadow">
            {busy ? "Creating…" : "Create account"}
          </button>

          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0ea5a4] font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
