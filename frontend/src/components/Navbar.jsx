import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    const navLinks = [
        ...(user ? [
            { path: "/upload", label: "Find Jobs" },
            { path: "/profile", label: "Profile" },
        ] : []),
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(10,10,15,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
        }}>
            <div className="container" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 64,
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{
                        width: 36, height: 36,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18,
                    }}>💼</div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#f1f5f9" }}>
                        Job<span style={{ color: "#6366f1" }}>Portal</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path} style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            color: isActive(link.path) ? "#6366f1" : "#94a3b8",
                            background: isActive(link.path) ? "rgba(99,102,241,0.1)" : "transparent",
                            transition: "all 0.2s",
                            textDecoration: "none",
                        }}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {user ? (
                        <>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 12px",
                                borderRadius: 8,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}>
                                <div style={{
                                    width: 28, height: 28,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, fontWeight: 700, color: "#fff",
                                }}>
                                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                                </div>
                                <span style={{ fontSize: 13, color: "#94a3b8", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {user.displayName || user.email?.split("@")[0]}
                                </span>
                            </div>
                            <button className="btn btn-ghost" onClick={handleLogout} style={{ padding: "8px 16px", fontSize: 13 }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/auth" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
