import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function ProfilePage({ user }) {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const q = query(
                    collection(db, "users", user.uid, "uploads"),
                    orderBy("uploadedAt", "desc")
                );
                const snap = await getDocs(q);
                setUploads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchUploads();
    }, [user.uid]);

    const formatDate = (ts) => {
        if (!ts) return "Just now";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="page" style={{ minHeight: "calc(100vh - 64px)" }}>
            <div className="bg-orbs"><div className="orb orb-2" /></div>

            <div className="container" style={{ padding: "40px 24px", position: "relative", zIndex: 1 }}>
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{ padding: 32, marginBottom: 28, display: "flex", alignItems: "center", gap: 24 }}
                >
                    <div style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 30, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                        {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
                            {user.displayName || "User"}
                        </h1>
                        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 12 }}>{user.email}</p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <span className="badge badge-success">✅ Active</span>
                        </div>
                    </div>
                </motion.div>

                {/* Upload History */}
                <div>
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>
                        📁 Upload History
                    </h2>

                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                            <div className="spinner" style={{ width: 36, height: 36 }} />
                        </div>
                    ) : uploads.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass"
                            style={{ padding: 48, textAlign: "center" }}
                        >
                            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No resumes uploaded yet</h3>
                            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>Upload your first resume to start finding job matches</p>
                            <a href="/upload" className="btn btn-primary" style={{ padding: "10px 24px" }}>
                                Upload Resume
                            </a>
                        </motion.div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {uploads.map((upload, i) => (
                                <motion.div
                                    key={upload.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass"
                                    style={{
                                        padding: "16px 20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 16,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 10,
                                            background: "rgba(99,102,241,0.15)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 22, flexShrink: 0,
                                        }}>
                                            📄
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>
                                                {upload.fileName || "Resume"}
                                            </p>
                                            <p style={{ color: "#94a3b8", fontSize: 12 }}>
                                                {formatDate(upload.uploadedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {upload.fileURL && (
                                            <a
                                                href={upload.fileURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-secondary"
                                                style={{ padding: "7px 14px", fontSize: 13, textDecoration: "none" }}
                                            >
                                                View
                                            </a>
                                        )}
                                        <a
                                            href="/upload"
                                            className="btn btn-primary"
                                            style={{ padding: "7px 14px", fontSize: 13, textDecoration: "none" }}
                                        >
                                            Re-Match
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
