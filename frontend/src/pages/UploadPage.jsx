import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../firebase";
import axios from "axios";
import JobCard from "../components/JobCard";
import FilterPanel from "../components/FilterPanel";

const BACKEND_URL = "http://localhost:8000";
const MSG = { SYSTEM: "system", AI: "ai", JOBS: "jobs", ERROR: "error" };

export default function UploadPage({ user }) {
    const [messages, setMessages] = useState([
        { id: 1, type: MSG.SYSTEM, text: "👋 Hi! Upload your resume (PDF or DOCX) and I'll find the best jobs for your skills." },
    ]);
    const [uploading, setUploading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({ location: "", experience: "", remote: false });
    const [filteredJobs, setFilteredJobs] = useState([]);
    const chatEndRef = useRef(null);

    const push = (msg) => setMessages((p) => [...p, { id: Date.now() + Math.random(), ...msg }]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    // Real-time filter application
    useEffect(() => {
        let r = [...jobs];
        if (filters.location) r = r.filter((j) => j.location?.toLowerCase().includes(filters.location.toLowerCase()));
        if (filters.experience) r = r.filter((j) => j.experience?.toLowerCase().includes(filters.experience.toLowerCase()));
        if (filters.remote) r = r.filter((j) => j.remote === true);
        setFilteredJobs(r);
    }, [filters, jobs]);

    const processResume = async (file) => {
        setUploading(true);
        setSkills([]);
        setJobs([]);

        push({ type: MSG.SYSTEM, text: `📄 Reading "${file.name}"...` });
        push({ type: MSG.AI, text: "🧠 Extracting your skills with NLP..." });

        try {
            // ── Step 1: Send file directly to backend (fast, no Firebase round-trip) ──
            const formData = new FormData();
            formData.append("file", file);

            let parsedSkills = [];
            let jobList = [];

            try {
                const parseRes = await axios.post(`${BACKEND_URL}/parse-resume`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 30000,
                });
                parsedSkills = parseRes.data.skills || [];
                setSkills(parsedSkills);

                push({
                    type: MSG.AI,
                    text: `✅ Found **${parsedSkills.length} skills**: ${parsedSkills.slice(0, 6).join(", ")}${parsedSkills.length > 6 ? ` +${parsedSkills.length - 6} more` : ""}`,
                });

                push({ type: MSG.AI, text: "🔍 Searching job listings for your skills..." });

                const jobRes = await axios.get(`${BACKEND_URL}/jobs`, {
                    params: { skills: parsedSkills.join(","), ...filters },
                });
                jobList = jobRes.data.jobs || [];
                setJobs(jobList);
                setFilteredJobs(jobList);

                if (jobList.length > 0) {
                    push({ type: MSG.AI, text: `🎯 Found **${jobList.length} job matches**! Use the filters to refine.` });
                    push({ type: MSG.JOBS, jobs: jobList });
                } else {
                    push({ type: MSG.AI, text: "😕 No jobs found right now. Try again later." });
                }

            } catch (backendErr) {
                const msg = backendErr.response?.data?.detail || backendErr.message || "Unknown error";
                push({ type: MSG.ERROR, text: `❌ ${msg}` });
                push({ type: MSG.AI, text: "💡 Make sure the backend is running: `python -m uvicorn main:app --reload --port 8000`" });
            }

            // ── Step 2: Firebase Storage + Firestore save in background (non-blocking) ──
            try {
                const fileRef = ref(storage, `resumes/${user.uid}/${Date.now()}_${file.name}`);
                const task = uploadBytesResumable(fileRef, file);
                task.on("state_changed", null, null, async () => {
                    const url = await getDownloadURL(task.snapshot.ref);
                    await addDoc(collection(db, "users", user.uid, "uploads"), {
                        fileName: file.name,
                        fileURL: url,
                        uploadedAt: serverTimestamp(),
                    });
                });
            } catch (_) { /* non-critical — profile history will just not show this upload */ }

        } catch (err) {
            push({ type: MSG.ERROR, text: `❌ Error: ${err.message}` });
        } finally {
            setUploading(false);
        }
    };

    const onDrop = useCallback((accepted) => {
        if (!accepted.length) return;
        const file = accepted[0];
        if (!file.name.match(/\.(pdf|docx)$/i)) {
            push({ type: MSG.ERROR, text: "❌ Only PDF and DOCX files are supported." });
            return;
        }
        processResume(file);
    }, [filters]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        multiple: false,
        disabled: uploading,
    });

    return (
        <div className="page" style={{ display: "flex", gap: 0, minHeight: "calc(100vh - 64px)" }}>
            <div className="bg-orbs"><div className="orb orb-2" /></div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 1200, margin: "0 auto", width: "100%", padding: "24px", gap: 20, position: "relative", zIndex: 1 }}>

                <div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 28, marginBottom: 6 }}>🚀 Find Your Next Job</h1>
                    <p style={{ color: "#94a3b8", fontSize: 14 }}>Upload your resume and let AI match you with the best opportunities</p>
                </div>

                <div style={{ display: "flex", gap: 20, flex: 1 }}>
                    {/* Left Panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300, flexShrink: 0 }}>

                        {/* Upload Zone */}
                        <div
                            {...getRootProps()}
                            style={{
                                padding: 24, borderRadius: 16, textAlign: "center", cursor: uploading ? "not-allowed" : "pointer",
                                border: `2px dashed ${isDragActive ? "#6366f1" : "rgba(255,255,255,0.12)"}`,
                                background: isDragActive ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)",
                                transition: "all 0.2s", opacity: uploading ? 0.6 : 1,
                            }}
                        >
                            <input {...getInputProps()} />
                            <div style={{ fontSize: 40, marginBottom: 12 }}>
                                {uploading ? "⏳" : isDragActive ? "📂" : "📄"}
                            </div>
                            <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
                                {uploading ? "Analyzing..." : isDragActive ? "Drop it here!" : "Drop Resume Here"}
                            </p>
                            <p style={{ color: "#94a3b8", fontSize: 12 }}>
                                {uploading ? "Please wait..." : "PDF or DOCX · Click or drag"}
                            </p>
                            {uploading && (
                                <div style={{ marginTop: 12 }}>
                                    <div style={{ width: 24, height: 24, border: "2px solid rgba(255,255,255,0.1)", borderTop: "2px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                                </div>
                            )}
                        </div>

                        {/* Extracted Skills */}
                        <AnimatePresence>
                            {skills.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: 16 }}>
                                    <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: "#a5b4fc" }}>
                                        🧠 Detected Skills ({skills.length})
                                    </h3>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                        {skills.map((s) => <span key={s} className="tag" style={{ fontSize: 11, padding: "4px 10px" }}>{s}</span>)}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Filters */}
                        <AnimatePresence>
                            {jobs.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <FilterPanel filters={filters} setFilters={setFilters} totalJobs={jobs.length} filteredCount={filteredJobs.length} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Chat Panel */}
                    <div className="glass" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 500 }}>
                        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                            {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} filteredJobs={filteredJobs} />)}
                            <div ref={chatEndRef} />
                        </div>
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, color: "#475569", fontSize: 14 }}>
                            <span>💡</span>
                            <span>Upload a resume to start — your AI job assistant is ready!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChatMessage({ msg, filteredJobs }) {
    const isAI = msg.type === MSG.AI;
    const isError = msg.type === MSG.ERROR;
    const isJobs = msg.type === MSG.JOBS;

    if (isJobs) {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {filteredJobs.slice(0, 6).map((job, i) => <JobCard key={i} job={job} />)}
                    {filteredJobs.length > 6 && (
                        <div style={{ width: "100%", textAlign: "center", color: "#94a3b8", fontSize: 13, padding: "8px 0" }}>
                            +{filteredJobs.length - 6} more jobs match your profile
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    const bg = isError ? "rgba(239,68,68,0.1)" : isAI ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.05)";
    const border = isError ? "rgba(239,68,68,0.25)" : isAI ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.07)";
    const color = isError ? "#f87171" : "#e2e8f0";

    return (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: isError ? "rgba(239,68,68,0.2)" : isAI ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.08)" }}>
                {isError ? "⚠️" : isAI ? "🤖" : "💼"}
            </div>
            <div style={{ padding: "10px 16px", borderRadius: 12, background: bg, border: `1px solid ${border}`, color, fontSize: 14, lineHeight: 1.6, maxWidth: "85%" }}>
                {msg.text?.split("**").map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
            </div>
        </motion.div>
    );
}


