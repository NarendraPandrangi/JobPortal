export default function FilterPanel({ filters, setFilters, totalJobs, filteredCount }) {
    const update = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

    return (
        <div className="glass" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontWeight: 600, fontSize: 14, color: "#a5b4fc" }}>🎛️ Filters</h3>
                <span style={{ fontSize: 12, color: "#64748b" }}>{filteredCount}/{totalJobs} jobs</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="form-group">
                    <label className="form-label">📍 Location</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="e.g. Bangalore"
                        value={filters.location}
                        onChange={(e) => update("location", e.target.value)}
                        style={{ fontSize: 13, padding: "8px 12px" }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">⏱️ Experience</label>
                    <select
                        className="form-input"
                        value={filters.experience}
                        onChange={(e) => update("experience", e.target.value)}
                        style={{
                            fontSize: 13,
                            padding: "8px 12px",
                            cursor: "pointer",
                            backgroundColor: "#1a1a28",
                            color: "#f1f5f9",
                            appearance: "none",
                            WebkitAppearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                            paddingRight: 32,
                        }}
                    >
                        <option value="" style={{ background: "#1a1a28", color: "#f1f5f9" }}>Any experience</option>
                        <option value="0-1" style={{ background: "#1a1a28", color: "#f1f5f9" }}>Fresher (0–1 yr)</option>
                        <option value="1-3" style={{ background: "#1a1a28", color: "#f1f5f9" }}>Junior (1–3 yrs)</option>
                        <option value="3-5" style={{ background: "#1a1a28", color: "#f1f5f9" }}>Mid-level (3–5 yrs)</option>
                        <option value="5" style={{ background: "#1a1a28", color: "#f1f5f9" }}>Senior (5+ yrs)</option>
                    </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 0" }}>
                    <div
                        onClick={() => update("remote", !filters.remote)}
                        style={{
                            width: 40, height: 22, borderRadius: 11,
                            background: filters.remote ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.1)",
                            position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
                        }}
                    >
                        <div style={{
                            position: "absolute", top: 3, left: filters.remote ? 20 : 3,
                            width: 16, height: 16, borderRadius: "50%", background: "#fff",
                            transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        }} />
                    </div>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>🌐 Remote only</span>
                </label>

                {(filters.location || filters.experience || filters.remote) && (
                    <button
                        className="btn btn-ghost"
                        onClick={() => setFilters({ location: "", experience: "", remote: false })}
                        style={{ fontSize: 12, padding: "6px 12px", justifyContent: "center" }}
                    >
                        ✕ Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
