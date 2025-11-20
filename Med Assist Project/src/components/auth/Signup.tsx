import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const { signUp, signInGoogle } = useAuth();
  const [name,setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSignup = async () => {
    setErr(null); setBusy(true);
    try { await signUp(email, pw, name); }
    catch (e: any) { setErr(e.message ?? "Sign up failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white rounded-2xl shadow p-6 space-y-3">
      <h2 className="text-xl font-semibold">Create account</h2>
      <input className="w-full border rounded p-2" placeholder="Full name"
             value={name} onChange={e=>setName(e.target.value)} />
      <input className="w-full border rounded p-2" placeholder="Email"
             value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border rounded p-2" type="password" placeholder="Password"
             value={pw} onChange={e=>setPw(e.target.value)} />
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button className="w-full rounded bg-black text-white p-2 disabled:opacity-60"
              disabled={busy} onClick={onSignup}>Create account</button>
      <div className="text-center text-sm text-gray-500">or</div>
      <button className="w-full rounded border p-2" onClick={signInGoogle}>
        Continue with Google
      </button>
    </div>
  );
}
