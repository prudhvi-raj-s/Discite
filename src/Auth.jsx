import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Logo } from "./ui";

export function Auth({ T, B }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, color: T.tx, fontFamily: "'Roboto',sans-serif" }}>
      <div style={{ background: T.sf, padding: 40, borderRadius: 16, border: `1px solid ${T.bd}`, width: "100%", maxWidth: 400, boxShadow: T.sh }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><Logo size={48} /></div>
        <h2 style={{ textAlign: "center", marginBottom: 24, fontFamily: "'Marvel',sans-serif", fontSize: 28, color: T.tx }}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        
        {error && <div style={{ background: `${B.rasp}20`, color: B.rasp, padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13, border: `1px solid ${B.rasp}50` }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: "12px 16px", borderRadius: 8, border: `1px solid ${T.bd}`, background: T.inp, color: T.tx, outline: "none", fontSize: 14 }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: "12px 16px", borderRadius: 8, border: `1px solid ${T.bd}`, background: T.inp, color: T.tx, outline: "none", fontSize: 14 }} />
          <button type="submit" disabled={loading} style={{ background: B.green, color: "#fff", padding: "14px", borderRadius: 8, border: "none", fontWeight: "bold", fontSize: 15, cursor: "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s" }}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        
        <div style={{ textAlign: "center", margin: "20px 0", color: T.txM, fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: T.bd }}></div>OR<div style={{ flex: 1, height: 1, background: T.bd }}></div>
        </div>
        <button type="button" onClick={handleGoogleSignIn} disabled={loading} style={{ background: "transparent", color: T.tx, padding: "12px", borderRadius: 8, border: `1px solid ${T.bd}`, fontWeight: "bold", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s", width: "100%", opacity: loading ? 0.7 : 1 }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" style={{ width: 18, height: 18 }} />
          Continue with Google
        </button>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: T.txM }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: B.green, cursor: "pointer", fontWeight: "bold" }}>{isLogin ? "Sign Up" : "Log In"}</span>
        </div>
      </div>
    </div>
  );
}