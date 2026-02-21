import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (mode === "register") {
                const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
                await updateProfile(cred.user, { displayName: form.name });
            } else {
                await signInWithEmailAndPassword(auth, form.email, form.password);
            }
            navigate("/upload");
        } catch (err) {
            setError(friendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const friendlyError = (code) => {
        const msgs = {
            "auth/email-already-in-use": "Email already registered. Try logging in.",
            "auth/invalid-credential": "Invalid email or password.",
            "auth/user-not-found": "No account found. Please register.",
            "auth/wrong-password": "Incorrect password.",
            "auth/weak-password": "Password must be at least 6 characters.",
            "auth/invalid-email": "Please enter a valid email address.",
        };
        return msgs[code] || "Something went wrong. Please try again.";
    };

    return (
        <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
            <div className="bg-orbs"><div className="orb orb-1" /><div className="orb orb-2" /></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: "100%", maxWidth: 420, padding: "0 24px", position: "relative", zIndex: 1 }}
            >
                <div className="glass" style={{ padding: 36 }}>
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>💼</div>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 26, marginBottom: 6 }}>
                            {mode === "login" ? "Welcome back" : "Create account"}
                        </h1>
                        <p style={{ color: "#94a3b8", fontSize: 14 }}>
                            {mode === "login" ? "Sign in to find your next job" : "Start your AI-powered job search"}
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div style={{
                        display: "flex",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 10,
                        padding: 4,
                        marginBottom: 24,
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                        {["login", "register"].map(m => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(""); }}
                                style={{
                                    flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
                                    fontSize: 14, fontWeight: 500,
                                    background: mode === m ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                                    color: mode === m ? "#fff" : "#94a3b8",
                                    cursor: "pointer", transition: "all 0.2s",
                                }}
                            >
                                {m === "login" ? "Sign In" : "Register"}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <AnimatePresence>
                            {mode === "register" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="form-group"
                                >
                                    <label className="form-label">Full Name</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                type="password"
                                name="password"
                                placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"}
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.3)",
                                    color: "#f87171",
                                    fontSize: 13,
                                }}
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ padding: "13px", fontSize: 15, justifyContent: "center", marginTop: 4 }}
                        >
                            {loading ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Processing...</> : (mode === "login" ? "Sign In" : "Create Account")}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
