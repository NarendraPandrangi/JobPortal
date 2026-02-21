import { motion } from "framer-motion";

export default function JobCard({ job }) {
    const isRemote = job.remote === true || job.location?.toLowerCase().includes("remote");

    return (
        <motion.div
            whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(99,102,241,0.2)" }}
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 18,
                width: "calc(50% - 6px)",
                minWidth: 220,
                cursor: "default",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
        >
            {/* Top Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>
                    💼
                </div>
                {isRemote && (
                    <span className="badge badge-success" style={{ fontSize: 11 }}>🌐 Remote</span>
                )}
            </div>

            {/* Title */}
            <div>
                <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 3, lineHeight: 1.3 }}>{job.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>{job.company}</p>
            </div>

            {/* Meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {job.location && (
                    <span style={{ color: "#64748b", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                        📍 {job.location}
                    </span>
                )}
                {job.experience && (
                    <span style={{ color: "#64748b", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                        ⏱️ {job.experience}
                    </span>
                )}
                {job.salary && (
                    <span style={{ color: "#10b981", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                        💰 {job.salary}
                    </span>
                )}
            </div>

            {/* Skills Tags */}
            {job.skills?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {job.skills.slice(0, 3).map((s) => (
                        <span key={s} className="tag" style={{ fontSize: 10, padding: "3px 8px" }}>{s}</span>
                    ))}
                </div>
            )}

            {/* Apply Button */}
            <a
                href={job.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ marginTop: 4, padding: "8px 14px", fontSize: 13, justifyContent: "center", textDecoration: "none" }}
                onClick={(e) => { if (!job.url || job.url === "#") e.preventDefault(); }}
            >
                Apply Now →
            </a>
        </motion.div>
    );
}
