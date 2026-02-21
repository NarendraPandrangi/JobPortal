import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FEATURES = [
    { icon: "📄", title: "Upload Your Resume", desc: "Drag & drop PDF or DOCX. We extract your skills instantly." },
    { icon: "🧠", title: "AI-Powered Parsing", desc: "NLP engine identifies your technologies, frameworks, and expertise level." },
    { icon: "🔍", title: "Smart Job Matching", desc: "We search thousands of live jobs and rank them by skill relevance." },
    { icon: "💬", title: "Chat Interface", desc: "Browse results in a conversational UI. Filter by location, experience, and remote." },
];

const STATS = [
    { value: "10K+", label: "Jobs Matched Daily" },
    { value: "50+", label: "Skills Detected" },
    { value: "95%", label: "Match Accuracy" },
    { value: "3 sec", label: "Parse Time" },
];

export default function HomePage({ user }) {
    return (
        <div className="page">
            <div className="bg-orbs">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            {/* Hero Section */}
            <section style={{ padding: "100px 0 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 16px",
                            borderRadius: 999,
                            background: "rgba(99,102,241,0.1)",
                            border: "1px solid rgba(99,102,241,0.3)",
                            marginBottom: 24,
                            fontSize: 13,
                            color: "#a5b4fc",
                        }}>
                            ✨ AI-Powered Resume Matching
                        </div>

                        <h1 style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: 20,
                        }}>
                            Upload Resume,<br />
                            <span className="gradient-text">Find Your Dream Job</span>
                        </h1>

                        <p style={{
                            fontSize: "clamp(1rem, 2vw, 1.2rem)",
                            color: "#94a3b8",
                            maxWidth: 560,
                            margin: "0 auto 40px",
                            lineHeight: 1.7,
                        }}>
                            Our AI extracts your skills from your resume and instantly finds the most relevant job opportunities from thousands of listings.
                        </p>

                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            {user ? (
                                <Link to="/upload" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
                                    🚀 Upload My Resume
                                </Link>
                            ) : (
                                <>
                                    <Link to="/auth" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
                                        🚀 Get Started Free
                                    </Link>
                                    <Link to="/auth" className="btn btn-secondary" style={{ padding: "14px 32px", fontSize: 16 }}>
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Hero Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        style={{ marginTop: 60, maxWidth: 700, margin: "60px auto 0" }}
                    >
                        <div className="glass" style={{ padding: 24, textAlign: "left" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
                                <span style={{ marginLeft: 8, fontSize: 13, color: "#475569" }}>job-portal.ai</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <ChatPreviewMsg from="system" text="📄 Resume uploaded! Extracting your skills..." />
                                <ChatPreviewMsg from="ai" text="✅ Found 8 skills: React, Python, Node.js, SQL, Machine Learning, Docker, TypeScript, REST APIs" />
                                <ChatPreviewMsg from="system" text="🔍 Searching 10,000+ job listings..." />
                                <JobPreviewCard title="Senior React Developer" company="TechCorp" loc="Bangalore • Remote" />
                                <JobPreviewCard title="Python ML Engineer" company="AI Startup" loc="Hyderabad • Hybrid" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: "60px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
                        {STATS.map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{ textAlign: "center" }}
                            >
                                <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: "#6366f1" }}>{s.value}</div>
                                <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: "80px 0", position: "relative", zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: 12 }}>
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p style={{ color: "#94a3b8", fontSize: 16 }}>Four simple steps to land your next job</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                className="glass"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.4)" }}
                                style={{ padding: 28, cursor: "default" }}
                            >
                                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                                <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: 17 }}>{f.title}</h3>
                                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "80px 0", textAlign: "center", position: "relative", zIndex: 1 }}>
                <div className="container">
                    <div className="glass" style={{
                        padding: "60px 40px",
                        background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
                        border: "1px solid rgba(99,102,241,0.25)",
                    }}>
                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: 16 }}>
                            Ready to Find Your <span className="gradient-text">Perfect Job?</span>
                        </h2>
                        <p style={{ color: "#94a3b8", marginBottom: 32, fontSize: 16, maxWidth: 400, margin: "0 auto 32px" }}>
                            Upload your resume and get matched with the best opportunities in seconds.
                        </p>
                        <Link to={user ? "/upload" : "/auth"} className="btn btn-primary" style={{ padding: "14px 36px", fontSize: 16 }}>
                            {user ? "🚀 Upload Resume" : "🚀 Start for Free"}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 0", textAlign: "center", position: "relative", zIndex: 1 }}>
                <p style={{ color: "#475569", fontSize: 13 }}>© 2026 JobPortal · AI-Powered Career Matching</p>
            </footer>
        </div>
    );
}

function ChatPreviewMsg({ from, text }) {
    const isAI = from === "ai";
    return (
        <div style={{ display: "flex", justifyContent: isAI ? "flex-start" : "flex-start", gap: 10 }}>
            <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: isAI ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>
                {isAI ? "🤖" : "💼"}
            </div>
            <div style={{
                padding: "8px 14px",
                borderRadius: 10,
                background: isAI ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${isAI ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.08)"}`,
                fontSize: 13,
                color: "#e2e8f0",
                maxWidth: "80%",
            }}>
                {text}
            </div>
        </div>
    );
}

function JobPreviewCard({ title, company, loc }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
        }}>
            <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{company} · {loc}</div>
            </div>
            <button className="btn btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>Apply</button>
        </div>
    );
}
