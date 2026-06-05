/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const ADMIN_SECRET = "CAPACITI2025";
const SUPERADMIN_SECRET = "SUPER2025";
const DEPARTMENTS = ["IT", "HR", "Finance", "Operations"];

const INITIAL_ADMINS = [
  { id: "a1", name: "IT Admin",         email: "it@capaciti.com",      password: "admin123", department: "IT",         role: "admin" },
  { id: "a2", name: "HR Admin",         email: "hr@capaciti.com",      password: "admin123", department: "HR",         role: "admin" },
  { id: "a3", name: "Finance Admin",    email: "finance@capaciti.com", password: "admin123", department: "Finance",    role: "admin" },
  { id: "a4", name: "Operations Admin", email: "ops@capaciti.com",     password: "admin123", department: "Operations", role: "admin" },
  { id: "a0", name: "Super Admin",      email: "super@capaciti.com",   password: "super123", department: "ALL",        role: "superadmin" },
];

const INITIAL_TICKETS = [
  { id: "TKT-001", userId: "u1", userName: "Thabo Nkosi",    department: "IT",         description: "My laptop screen flickering and won't connect to the office Wi-Fi network.", status: "Resolved", date: "2025-05-20", response: null, responseTone: null },
  { id: "TKT-002", userId: "u1", userName: "Thabo Nkosi",    department: "HR",         description: "I need to apply for annual leave for the last week of June.",                status: "Pending",  date: "2025-05-22", response: null, responseTone: null },
  { id: "TKT-003", userId: "u2", userName: "Amara Dlamini",  department: "Finance",    description: "My expense claim from April has not been reimbursed yet.",                   status: "Open",     date: "2025-05-24", response: null, responseTone: null },
  { id: "TKT-004", userId: "u2", userName: "Amara Dlamini",  department: "Operations", description: "The air conditioning in meeting room B3 is broken.",                        status: "Pending",  date: "2025-05-25", response: null, responseTone: null },
  { id: "TKT-005", userId: "u3", userName: "Sipho Mthembu",  department: "IT",         description: "Cannot access the shared drive. Getting a permissions error.",              status: "Open",     date: "2025-05-26", response: null, responseTone: null },
  { id: "TKT-006", userId: "u3", userName: "Sipho Mthembu",  department: "Finance",    description: "Need reimbursement for business travel to Cape Town last month.",           status: "Resolved", date: "2025-05-27", response: null, responseTone: null },
  { id: "TKT-007", userId: "u1", userName: "Thabo Nkosi",    department: "Operations", description: "Parking bay 14 is being used by an unauthorised vehicle daily.",            status: "Open",     date: "2025-05-28", response: null, responseTone: null },
  { id: "TKT-008", userId: "u2", userName: "Amara Dlamini",  department: "IT",         description: "Outlook keeps crashing every time I open a large attachment.",              status: "Pending",  date: "2025-05-29", response: null, responseTone: null },
  { id: "TKT-009", userId: "u3", userName: "Sipho Mthembu",  department: "HR",         description: "Need a letter confirming my employment for a bank loan application.",       status: "Resolved", date: "2025-05-30", response: null, responseTone: null },
  { id: "TKT-010", userId: "u1", userName: "Thabo Nkosi",    department: "Finance",    description: "My March salary was short by R800. Please investigate.",                   status: "Open",     date: "2025-05-31", response: null, responseTone: null },
];

const INITIAL_USERS = [
  { id: "u1", name: "Thabo Nkosi",   email: "thabo@capaciti.com", password: "user123", role: "user" },
  { id: "u2", name: "Amara Dlamini", email: "amara@capaciti.com", password: "user123", role: "user" },
  { id: "u3", name: "Sipho Mthembu", email: "sipho@capaciti.com", password: "user123", role: "user" },
];

const STATUS_COLORS = {
  Open:     { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", darkBg: "#451A03", darkText: "#FCD34D" },
  Pending:  { bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6", darkBg: "#1E3A5F", darkText: "#93C5FD" },
  Resolved: { bg: "#D1FAE5", text: "#065F46", dot: "#10B981", darkBg: "#022C22", darkText: "#6EE7B7" },
};

const DEPT_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#3B82F6"];

const TONE_CONFIG = {
  formal:   { label: "Formal",   emoji: "🎩", color: "#6366F1", desc: "Professional & official",      bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.35)" },
  friendly: { label: "Friendly", emoji: "😊", color: "#10B981", desc: "Warm & approachable",          bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.35)" },
  urgent:   { label: "Urgent",   emoji: "⚡", color: "#EF4444", desc: "Immediate action required",    bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.35)"  },
};

// ─── Response Templates ───────────────────────────────────────────────────────
const RESPONSE_TEMPLATES = {
  IT: {
    formal:   (name, desc) => `Dear ${name},\n\nThank you for contacting the IT Support Department. We acknowledge receipt of your support request regarding: "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"\n\nYour ticket has been logged and assigned a unique reference number. A qualified IT technician has been allocated to investigate and resolve this matter. You can expect a follow-up within 1–2 business hours.\n\nPlease refrain from attempting to resolve the issue independently, as this may complicate the diagnostic process. Should the situation become critical, do not hesitate to escalate via the IT hotline.\n\nKind regards,\nIT Support Department\nOpsBridge Platform`,
    friendly: (name, desc) => `Hi ${name}! 👋\n\nThanks for reaching out — we've got your ticket and we're already on it!\n\nOur IT team has picked up your request about "${desc.substring(0, 60)}${desc.length > 60 ? '...' : ''}" and we'll have someone looking into it shortly. Most issues like this are sorted within a couple of hours.\n\nIn the meantime, feel free to try a quick restart if you haven't already — sometimes that's all it takes! 🔄\n\nWe'll keep you posted. Chat soon!\nThe IT Team ⚙️`,
    urgent:   (name, desc) => `URGENT — ACTION REQUIRED\n\nDear ${name},\n\nWe have flagged your IT request as HIGH PRIORITY: "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"\n\n⚠️ A senior technician is being dispatched immediately. Please remain at your workstation or ensure your device is accessible.\n\nExpected response time: WITHIN 30 MINUTES.\n\nDo not shut down your device. Preserve all error messages and screenshots.\n\nIT Emergency Response Team\nOpsBridge Platform`,
  },
  HR: {
    formal:   (name, desc) => `Dear ${name},\n\nThank you for submitting your request to the Human Resources Department. We have received your query regarding: "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"\n\nYour request is currently under review by an HR Business Partner. We are committed to addressing all employee matters with the utmost discretion and professionalism. You will receive a formal response within 2–3 business days.\n\nPlease note that all HR communications are strictly confidential and handled in accordance with the organisation's privacy policy.\n\nYours sincerely,\nHuman Resources Department\nOpsBridge Platform`,
    friendly: (name, desc) => `Hi ${name}! 😊\n\nWe've received your HR request — thanks for reaching out! It's about "${desc.substring(0, 60)}${desc.length > 60 ? '...' : ''}" and we completely understand.\n\nOur HR team will review this and get back to you within 2–3 business days. We're here to make sure everything is sorted for you!\n\nDon't stress — we've got your back. 💙\n\nWarm regards,\nYour HR Team`,
    urgent:   (name, desc) => `PRIORITY HR NOTICE\n\nDear ${name},\n\nYour HR matter has been flagged as URGENT: "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"\n\n⚠️ An HR Business Partner will contact you within the hour. Please ensure you are available via phone or email.\n\nAll relevant documentation should be prepared and accessible. This matter will be treated as a Priority 1 case.\n\nHR Emergency Response\nOpsBridge Platform`,
  },
  Finance: {
    formal:   (name, desc) => `Dear ${name},\n\nThank you for contacting the Finance Department. We have received your financial query regarding: "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"\n\nThis matter has been assigned to a Finance Officer for review and processing. In line with our standard financial procedures, resolution is expected within 3–5 business days. You will be notified via this platform once the matter has been resolved.\n\nPlease retain all supporting documentation (invoices, receipts, bank statements) as these may be required during the review process.\n\nYours faithfully,\nFinance Department\nOpsBridge Platform`,
    friendly: (name, desc) => `Hi ${name}! 💰\n\nGot your finance request — thanks for flagging this! We're looking into "${desc.substring(0, 60)}${desc.length > 60 ? '...' : ''}" and we'll get it sorted.\n\nOur Finance team typically resolves these within 3–5 business days. If you have any receipts or supporting docs, it'd be great if you could have them handy!\n\nWe'll update you as soon as we have news. 🙌\n\nCheers,\nThe Finance Team`,
    urgent:   (name, desc) => `URGENT FINANCIAL ESCALATION\n\nDear ${name},\n\nYour financial matter requires IMMEDIATE ATTENTION: "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"\n\n⚠️ This has been escalated to a Senior Finance Manager. A resolution or formal response will be provided within 24 hours.\n\nPlease compile all relevant financial documentation immediately. Do not make any external financial commitments related to this matter pending our response.\n\nFinance Escalations Team\nOpsBridge Platform`,
  },
  Operations: {
    formal:   (name, desc) => `Dear ${name},\n\nThank you for submitting your facilities and operations request. We have logged the following issue: "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"\n\nThe Operations team has been notified and a facilities coordinator will assess and address this matter within 1–2 business days. We apologise for any inconvenience caused and assure you that this is being treated as a priority.\n\nPlease avoid attempting to rectify the issue personally, as this may pose safety risks.\n\nKind regards,\nOperations & Facilities Department\nOpsBridge Platform`,
    friendly: (name, desc) => `Hi ${name}! 🔧\n\nThanks for letting us know about "${desc.substring(0, 60)}${desc.length > 60 ? '...' : ''}" — we're on it!\n\nOur Operations team will have someone take a look within 1–2 business days. These things happen, and we appreciate you flagging it so we can fix it quickly.\n\nWe'll keep you in the loop! 👷‍♂️\n\nBest,\nOperations Team`,
    urgent:   (name, desc) => `URGENT OPERATIONS ALERT\n\nDear ${name},\n\nThe following operational issue has been flagged as CRITICAL: "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"\n\n⚠️ An emergency response team has been dispatched. Please vacate the affected area if there is any safety risk and alert building security immediately.\n\nDo not attempt to resolve this issue independently. Our team will be on-site within the hour.\n\nOperations Emergency Response\nOpsBridge Platform`,
  },
};

// ─── AI Classifier (keyword-based) ───────────────────────────────────────────
function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

async function classifyWithClaude(description) {
  await new Promise(res => setTimeout(res, 800));
  const text = description.toLowerCase();
  const keywords = {
    IT: ["laptop","computer","pc","screen","monitor","keyboard","mouse","printer","wifi","wi-fi","internet","network","vpn","email","outlook","teams","zoom","software","app","install","crash","error","password","login","access","permissions","drive","server","phone","hardware","windows","browser","system"],
    HR: ["leave","annual leave","sick leave","vacation","day off","contract","employment","letter","certificate","payroll","payslip","salary","bonus","deduction","onboarding","training","workshop","benefits","medical aid","pension","performance","review","promotion","disciplinary","policy","hr","human resources"],
    Finance: ["expense","reimbursement","reimburse","claim","invoice","receipt","payment","purchase","budget","financial","accounting","salary","short paid","underpaid","deposit","transfer","refund","travel allowance","vat"],
    Operations: ["air conditioning","aircon","ac","heating","temperature","parking","vehicle","cleaning","dirty","bathroom","toilet","furniture","chair","desk","broken","damaged","repair","building","office","room","meeting room","access card","security","facilities","maintenance","elevator","lift"],
  };
  const scores = {};
  for (const [dept, words] of Object.entries(keywords)) {
    scores[dept] = words.filter(w => text.includes(w)).length;
  }
  const topDept = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (topDept[1] === 0) {
    return { department: null, valid: false, reason: "Your request does not appear to be work-related. Please describe a specific workplace issue and try again." };
  }
  const reasons = {
    IT: "Routed to IT — relates to technology, systems, or software.",
    HR: "Routed to HR — relates to people, leave, or employment matters.",
    Finance: "Routed to Finance — relates to payments, expenses, or financial queries.",
    Operations: "Routed to Operations — relates to office facilities or building maintenance.",
  };
  return { department: topDept[0], valid: true, reason: reasons[topDept[0]] };
}

// ─── AI Response Generator ────────────────────────────────────────────────────
async function generateAIResponse(ticket, tone, adminName) {
  await new Promise(res => setTimeout(res, 1200));
  const templateFn = RESPONSE_TEMPLATES[ticket.department]?.[tone];
  if (!templateFn) return "Thank you for your request. Our team will be in touch shortly.";
  return templateFn(ticket.userName, ticket.description);
}

// ─── Theme ────────────────────────────────────────────────────────────────────
const LIGHT = { bg: "#F8FAFC", surface: "#FFFFFF", border: "#E2E8F0", text: "#111827", muted: "#64748B", subtle: "#F1F5F9", inputBg: "#F8FAFC", headerBg: "#FFFFFF" };
const DARK  = { bg: "#0F172A", surface: "#1E293B", border: "#334155", text: "#F1F5F9", muted: "#94A3B8", subtle: "#1E293B", inputBg: "#0F172A", headerBg: "#1E293B" };

// ─── Shared Components ────────────────────────────────────────────────────────
function StatusBadge({ status, dark }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Open;
  return (
    <span style={{ background: dark ? c.darkBg : c.bg, color: dark ? c.darkText : c.text, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />{status}
    </span>
  );
}

function Modal({ show, onClose, title, children, type = "info", btnLabel = "Got it", dark }) {
  if (!show) return null;
  const colors = { info: "#3B82F6", error: "#EF4444", success: "#10B981" };
  const icons  = { error: "⚠️", success: "✅", info: "ℹ️" };
  const t = dark ? DARK : LIGHT;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: t.surface, borderRadius: 20, padding: "2rem", maxWidth: 420, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.4)", border: `1px solid ${t.border}` }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: colors[type] + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", fontSize: 24 }}>{icons[type]}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 8, fontFamily: "'Syne',sans-serif" }}>{title}</div>
        <div style={{ fontSize: 14, color: t.muted, lineHeight: 1.7, marginBottom: "1.5rem" }}>{children}</div>
        <button onClick={onClose} style={{ background: colors[type], color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit" }}>{btnLabel}</button>
      </div>
    </div>
  );
}

function ThemeToggle({ dark, setDark }) {
  return (
    <button onClick={() => setDark(d => !d)} style={{ background: "none", border: `1px solid ${dark ? "#334155" : "#E2E8F0"}`, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", gap: 6, color: dark ? "#94A3B8" : "#64748B", fontFamily: "inherit" }}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

// ─── Week 2: Tone Selector Component ─────────────────────────────────────────
function ToneSelector({ selectedTone, onSelect, dark }) {
  const t = dark ? DARK : LIGHT;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Object.entries(TONE_CONFIG).map(([key, cfg]) => (
        <button key={key} onClick={() => onSelect(key)}
          style={{
            flex: 1, minWidth: 100,
            padding: "10px 14px",
            borderRadius: 12,
            border: `2px solid ${selectedTone === key ? cfg.color : (dark ? "#334155" : "#E2E8F0")}`,
            background: selectedTone === key ? cfg.bg : (dark ? "rgba(255,255,255,0.03)" : "#F8FAFC"),
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.18s ease",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
          <span style={{ fontSize: 20 }}>{cfg.emoji}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: selectedTone === key ? cfg.color : t.text }}>{cfg.label}</span>
          <span style={{ fontSize: 10, color: t.muted, textAlign: "center" }}>{cfg.desc}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Week 2: Response Preview Panel ──────────────────────────────────────────
function ResponsePanel({ ticket, dark, onSave }) {
  const [tone, setTone] = useState("formal");
  const [generatedResponse, setGeneratedResponse] = useState(ticket.response || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedResponse, setEditedResponse] = useState("");
  const [saved, setSaved] = useState(!!ticket.response);
  const t = dark ? DARK : LIGHT;
  const toneCfg = TONE_CONFIG[tone];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSaved(false);
    setEditMode(false);
    const resp = await generateAIResponse(ticket, tone, "Admin");
    setGeneratedResponse(resp);
    setEditedResponse(resp);
    setIsGenerating(false);
  };

  const handleSave = () => {
    const finalResp = editMode ? editedResponse : generatedResponse;
    onSave(ticket.id, finalResp, tone);
    setSaved(true);
    setEditMode(false);
  };

  const displayText = editMode ? editedResponse : (generatedResponse || ticket.response || "");

  return (
    <div style={{ border: `1.5px solid ${dark ? "#334155" : "#E2E8F0"}`, borderRadius: 16, overflow: "hidden", background: t.surface }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", background: dark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderBottom: `1px solid ${dark ? "#334155" : "#E2E8F0"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>💬</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>AI Response Generator</span>
          <span style={{ fontSize: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>WEEK 2</span>
        </div>
        {saved && (
          <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <span>✓</span> Response Sent
          </span>
        )}
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Tone selector */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: 0.5, marginBottom: 8 }}>SELECT TONE</div>
          <ToneSelector selectedTone={tone} onSelect={setTone} dark={dark} />
        </div>

        {/* Generate button */}
        <button onClick={handleGenerate} disabled={isGenerating}
          style={{
            padding: "11px 20px",
            background: isGenerating ? (dark ? "#334155" : "#E2E8F0") : `linear-gradient(135deg, ${toneCfg.color}, ${toneCfg.color}CC)`,
            border: "none", borderRadius: 11, color: isGenerating ? t.muted : "#fff",
            fontSize: 13, fontWeight: 700, cursor: isGenerating ? "not-allowed" : "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s ease",
          }}>
          {isGenerating ? (
            <>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: 14 }}>⏳</span>
              Generating response…
            </>
          ) : (
            <>{toneCfg.emoji} Generate {toneCfg.label} Response</>
          )}
        </button>

        {/* Generated response */}
        {displayText ? (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: 0.5, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>GENERATED RESPONSE</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setEditMode(!editMode); setEditedResponse(generatedResponse); }}
                  style={{ fontSize: 11, fontWeight: 600, color: "#6366F1", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                  {editMode ? "Cancel Edit" : "✏️ Edit"}
                </button>
                <button onClick={() => navigator.clipboard?.writeText(displayText)}
                  style={{ fontSize: 11, fontWeight: 600, color: t.muted, background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Tone badge */}
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: toneCfg.bg, color: toneCfg.color, border: `1px solid ${toneCfg.border}` }}>
                {toneCfg.emoji} {toneCfg.label.toUpperCase()} TONE
              </span>
            </div>

            {editMode ? (
              <textarea value={editedResponse} onChange={e => setEditedResponse(e.target.value)}
                style={{ width: "100%", minHeight: 180, padding: "12px", borderRadius: 10, border: `1.5px solid #6366F1`, fontSize: 12, fontFamily: "'DM Mono', monospace", lineHeight: 1.7, resize: "vertical", outline: "none", background: t.inputBg, color: t.text }} />
            ) : (
              <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: 10, padding: "12px 14px", fontSize: 12, fontFamily: "'DM Mono', monospace", lineHeight: 1.8, color: t.text, whiteSpace: "pre-wrap", border: `1px solid ${dark ? "#334155" : "#E8EDF2"}`, maxHeight: 200, overflowY: "auto" }}>
                {displayText}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={handleSave}
                style={{ flex: 1, padding: "10px", background: saved ? "#10B981" : "linear-gradient(135deg,#10B981,#059669)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {saved ? "✓ Response Saved" : "📤 Send Response"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0", color: t.muted, fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
            Select a tone and generate a response for this ticket
          </div>
        )}
      </div>
    </div>
  );
}

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
  * { box-sizing: border-box; }
  @keyframes popIn  { from { transform: scale(0.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  @keyframes fadeUp { from { transform: translateY(28px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes float  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
  @keyframes pulse  { 0%,100% { opacity: 0.35 } 50% { opacity: 0.9 } }
  @keyframes spin   { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
  .hoverlift:hover { transform: translateY(-3px) !important; }
  .hoverlift { transition: transform 0.2s ease !important; }
`;

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onNav }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#060C1A", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      <style>{GLOBAL_STYLES + `
        .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(99,102,241,0.45) !important; }
        .hero-cta { transition: all 0.2s ease; }
        .ghost:hover { background: rgba(255,255,255,0.1) !important; }
        .ghost { transition: all 0.2s ease; }
        .fcard:hover { transform: translateY(-5px); border-color: rgba(99,102,241,0.45) !important; box-shadow: 0 12px 40px rgba(99,102,241,0.12) !important; }
        .fcard { transition: all 0.25s ease; }
        .pill { animation: pulse 2.8s ease-in-out infinite; }
        .pill:nth-child(2){animation-delay:.7s}.pill:nth-child(3){animation-delay:1.4s}.pill:nth-child(4){animation-delay:2.1s}
      `}</style>

      <div style={{ position: "fixed", top: -200, left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <nav style={{ position: "sticky", top: 0, zIndex: 100, height: 64, padding: "0 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(6,12,26,0.92)" : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>🌉</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>OpsBridge</span>
          <span style={{ fontSize: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", padding: "2px 8px", borderRadius: 100, fontWeight: 700, marginLeft: 4 }}>v2.0</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="ghost" onClick={() => onNav("login")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, padding: "8px 22px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Sign In</button>
          <button className="hero-cta" onClick={() => onNav("register")} style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", color: "#fff", borderRadius: 10, padding: "8px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Get Started</button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "8rem 2rem 5rem", textAlign: "center", animation: "fadeUp 0.7s ease" }}>
        {/* Week 2 badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: "1.5rem", fontSize: 12, fontWeight: 700, color: "#6EE7B7" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
          WEEK 2 — AI RESPONSE GENERATOR ADDED
        </div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.8rem,7vw,5.2rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: -2.5, margin: "0 0 1.5rem", background: "linear-gradient(140deg,#fff 30%,#A5B4FC 75%,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          The Bridge Between<br />Your Team & Support
        </h1>
        <p style={{ fontSize: 18, color: "#94A3B8", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 3rem" }}>
          Describe your issue in plain English. OpsBridge classifies, routes, and now <strong style={{ color: "#A5B4FC" }}>automatically generates professional responses</strong> — instantly.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="hero-cta" onClick={() => onNav("register")} style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", color: "#fff", borderRadius: 14, padding: "15px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 24px rgba(99,102,241,0.35)" }}>Get Started →</button>
          <button className="ghost" onClick={() => onNav("login")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.13)", color: "#fff", borderRadius: 14, padding: "15px 36px", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Sign In</button>
        </div>
      </div>

      {/* Demo card showing response generator */}
      <div style={{ maxWidth: 680, margin: "0 auto 6rem", padding: "0 2rem", animation: "float 6s ease-in-out infinite" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 22, padding: "2rem", backdropFilter: "blur(10px)" }}>
          <div style={{ fontSize: 12, color: "#475569", fontWeight: 600, letterSpacing: 0.5, marginBottom: 10 }}>AI RESPONSE GENERATOR — WEEK 2</div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "1rem 1.25rem", fontSize: 14, color: "#CBD5E1", fontStyle: "italic", marginBottom: "1.25rem", borderLeft: "3px solid rgba(99,102,241,0.5)", lineHeight: 1.6 }}>
            "My laptop won't connect to the office Wi-Fi and I can't access my emails..."
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
            {Object.entries(TONE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="pill" style={{ padding: "5px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: key === "formal" ? cfg.bg : "rgba(255,255,255,0.04)", border: `1px solid ${key === "formal" ? cfg.border : "rgba(255,255,255,0.08)"}`, color: key === "formal" ? cfg.color : "#334155" }}>
                {cfg.emoji} {cfg.label}
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#6EE7B7", fontFamily: "monospace", lineHeight: 1.6 }}>
            "Dear Thabo, Thank you for contacting the IT Support Department. Your ticket has been logged and a qualified technician has been allocated..."
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 8rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, letterSpacing: -1.5, margin: "0 0 0.5rem" }}>Now with intelligent responses</h2>
          <p style={{ color: "#475569", fontSize: 16 }}>Sprint 2 adds AI-powered communication to every ticket</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {[
            { icon: "🤖", title: "AI Classification",    desc: "Free-text requests routed to the correct department automatically.",   week: 1 },
            { icon: "💬", title: "AI Response Generator", desc: "One-click professional responses generated for every ticket.",          week: 2, highlight: true },
            { icon: "🎨", title: "Tone Control",          desc: "Formal, friendly, or urgent — matched to the situation.",              week: 2, highlight: true },
            { icon: "✏️", title: "Edit & Customise",     desc: "Admins can refine AI responses before sending.",                        week: 2, highlight: true },
            { icon: "📊", title: "Admin Dashboard",       desc: "Per-department admins manage their queue with stats and filters.",       week: 1 },
            { icon: "👑", title: "Super Admin View",      desc: "Full visibility across all departments with live charts.",              week: 1 },
          ].map(f => (
            <div key={f.title} className="fcard" style={{ background: f.highlight ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.025)", border: `1px solid ${f.highlight ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: "1.75rem" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15 }}>{f.title}</div>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: f.week === 2 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)", color: f.week === 2 ? "#6EE7B7" : "#334155" }}>W{f.week}</span>
              </div>
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2rem", textAlign: "center", fontSize: 12, color: "#1E293B" }}>
        © 2025 OpsBridge · Capaciti Tech Career Accelerator · Sprint 2
      </div>
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({ mode, onNav, users, setUsers, admins, setAdmins, onRegistered, dark, setDark }) {
  const isLogin = mode === "login";
  const [tab, setTab] = useState("user");
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "IT", secret: "" });
  const [error, setError] = useState("");
  const t = dark ? DARK : LIGHT;
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    setError("");
    if (isLogin) {
      const match = [...users, ...admins].find(u => u.email === form.email && u.password === form.password);
      if (!match) return setError("Invalid email or password.");
      onRegistered({ type: "login", user: match });
    } else {
      if (!form.name || !form.email || !form.password) return setError("All fields are required.");
      if (tab === "superadmin") {
        if (form.secret !== SUPERADMIN_SECRET) return setError("Invalid super admin secret code.");
        if (admins.find(a => a.email === form.email)) return setError("Email already registered.");
        setAdmins(p => [...p, { id: generateId("SA"), name: form.name, email: form.email, password: form.password, department: "ALL", role: "superadmin" }]);
        onRegistered({ type: "registered" });
      } else if (tab === "admin") {
        if (form.secret !== ADMIN_SECRET) return setError("Invalid admin secret code.");
        if (admins.find(a => a.email === form.email)) return setError("Email already registered.");
        setAdmins(p => [...p, { id: generateId("A"), name: form.name, email: form.email, password: form.password, department: form.department, role: "admin" }]);
        onRegistered({ type: "registered" });
      } else {
        if (users.find(u => u.email === form.email)) return setError("Email already registered.");
        setUsers(p => [...p, { id: generateId("U"), name: form.name, email: form.email, password: form.password, role: "user" }]);
        onRegistered({ type: "registered" });
      }
    }
  };

  const tabs = isLogin ? [] : [
    { key: "user", label: "👤 Employee" },
    { key: "admin", label: "🔐 Dept Admin" },
    { key: "superadmin", label: "👑 Super Admin" },
  ];
  const inp = { width: "100%", padding: "12px 14px", borderRadius: 11, border: `1.5px solid ${t.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: t.inputBg, color: t.text };

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0F172A" : "linear-gradient(135deg,#060C1A 0%,#1E1B4B 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ background: t.surface, borderRadius: 22, padding: "2.5rem", width: "100%", maxWidth: 460, animation: "popIn 0.3s ease", boxShadow: "0 32px 90px rgba(0,0,0,0.45)", border: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌉</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: t.text }}>OpsBridge</span>
          </div>
          <ThemeToggle dark={dark} setDark={setDark} />
        </div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: t.text, margin: "0 0 0.25rem" }}>{isLogin ? "Welcome back" : "Create account"}</h2>
        <p style={{ fontSize: 14, color: t.muted, margin: "0 0 1.5rem" }}>{isLogin ? "Sign in to your workspace." : "Join the platform to get started."}</p>
        {!isLogin && (
          <div style={{ display: "flex", background: t.subtle, borderRadius: 11, padding: 4, marginBottom: "1.5rem", gap: 2 }}>
            {tabs.map(tb => (
              <button key={tb.key} onClick={() => setTab(tb.key)} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: tab === tb.key ? t.surface : "transparent", color: tab === tb.key ? "#6366F1" : t.muted, boxShadow: tab === tb.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s", fontFamily: "inherit" }}>{tb.label}</button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!isLogin && <input style={inp} placeholder="Full name" value={form.name} onChange={e => update("name", e.target.value)} />}
          <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={e => update("email", e.target.value)} />
          <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e => update("password", e.target.value)} />
          {!isLogin && tab === "admin" && (
            <>
              <select style={{ ...inp }} value={form.department} onChange={e => update("department", e.target.value)}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              <input style={{ ...inp, borderColor: "#6366F1" }} placeholder="Admin secret code" type="password" value={form.secret} onChange={e => update("secret", e.target.value)} />
            </>
          )}
          {!isLogin && tab === "superadmin" && (
            <input style={{ ...inp, borderColor: "#8B5CF6" }} placeholder="Super admin secret code" type="password" value={form.secret} onChange={e => update("secret", e.target.value)} />
          )}
        </div>
        {error && <div style={{ marginTop: 10, padding: "10px 14px", background: dark ? "#450A0A" : "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{error}</div>}
        <button onClick={handleSubmit} style={{ marginTop: 16, width: "100%", padding: "13px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {isLogin ? "Sign In →" : "Create Account →"}
        </button>
        <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: 14, color: t.muted }}>
          {isLogin ? "No account? " : "Already registered? "}
          <button onClick={() => onNav(isLogin ? "register" : "login")} style={{ background: "none", border: "none", color: "#6366F1", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>{isLogin ? "Sign up" : "Sign in"}</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <button onClick={() => onNav("landing")} style={{ background: "none", border: "none", color: t.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>← Back to home</button>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Portal ──────────────────────────────────────────────────────────
function EmployeePortal({ user, tickets, setTickets, onLogout, dark, setDark }) {
  const [activeTab, setActiveTab] = useState("submit");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const t = dark ? DARK : LIGHT;
  const myTickets = tickets.filter(tk => tk.userId === user.id);
  const filtered = filterStatus === "All" ? myTickets : myTickets.filter(tk => tk.status === filterStatus);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const result = await classifyWithClaude(description);
      if (!result.valid) {
        setModal({ type: "error", title: "Invalid: Resubmit Ticket", body: `${result.reason} Please describe a work-related issue clearly.` });
      } else {
        const ticket = { id: generateId("TKT"), userId: user.id, userName: user.name, department: result.department, description, status: "Open", date: new Date().toISOString().split("T")[0], response: null, responseTone: null };
        setTickets(p => [ticket, ...p]);
        setDescription("");
        setModal({ type: "success", title: "Ticket Submitted! ✓", body: `Routed to ${result.department}. Our team will respond shortly.`, action: () => setActiveTab("history") });
      }
    } catch { setModal({ type: "error", title: "Error", body: "Could not reach classifier. Please try again." }); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'DM Sans',sans-serif", color: t.text }}>
      <style>{GLOBAL_STYLES}</style>
      <header style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, padding: "0 2rem", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌉</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: t.text }}>OpsBridge</span>
          <span style={{ fontSize: 11, background: dark ? "#1E3A5F" : "#F1F5F9", color: dark ? "#93C5FD" : "#64748B", padding: "2px 9px", borderRadius: 100, fontWeight: 600, marginLeft: 4 }}>Employee</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThemeToggle dark={dark} setDark={setDark} />
          <div style={{ width: 33, height: 33, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 800 }}>{user.name[0]}</div>
          <span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{user.name}</span>
          <button onClick={onLogout} style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 13, color: t.muted, cursor: "pointer", fontFamily: "inherit" }}>Logout</button>
        </div>
      </header>

      <div style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, display: "flex", padding: "0 2rem" }}>
        {[{ key: "submit", label: "📝 Submit Ticket" }, { key: "history", label: `📋 My History (${myTickets.length})` }].map(tb => (
          <button key={tb.key} onClick={() => setActiveTab(tb.key)} style={{ padding: "14px 20px", border: "none", borderBottom: activeTab === tb.key ? "2px solid #6366F1" : "2px solid transparent", background: "none", fontSize: 14, fontWeight: activeTab === tb.key ? 700 : 500, color: activeTab === tb.key ? "#6366F1" : t.muted, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {tb.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 780, margin: "2.5rem auto", padding: "0 1.5rem" }}>
        {activeTab === "submit" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ background: t.surface, borderRadius: 18, border: `1px solid ${t.border}`, padding: "2.5rem", boxShadow: dark ? "0 2px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: t.text, margin: "0 0 0.35rem" }}>Submit a Support Ticket</h2>
              <p style={{ fontSize: 14, color: t.muted, margin: "0 0 2rem", lineHeight: 1.6 }}>Describe your issue in plain English. Our AI will classify, route, and generate a professional response automatically.</p>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. My laptop won't connect to the office Wi-Fi and I can't access my emails since this morning..."
                style={{ width: "100%", minHeight: 160, padding: "14px 16px", borderRadius: 13, border: `1.5px solid ${t.border}`, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.65, color: t.text, background: t.inputBg }}
                onFocus={e => e.target.style.borderColor = "#6366F1"}
                onBlur={e => e.target.style.borderColor = t.border} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <div style={{ fontSize: 12, color: t.muted }}>{description.length} characters</div>
                <button onClick={handleSubmit} disabled={loading || !description.trim()}
                  style={{ padding: "12px 32px", background: loading || !description.trim() ? "#C7D2FE" : "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading || !description.trim() ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  {loading ? "⏳ Classifying…" : "Submit Ticket →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: t.text, margin: "0 0 0.2rem" }}>My Ticket History</h2>
                <p style={{ fontSize: 14, color: t.muted, margin: 0 }}>{myTickets.length} ticket{myTickets.length !== 1 ? "s" : ""} submitted</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["All", "Open", "Pending", "Resolved"].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${filterStatus === s ? "#6366F1" : t.border}`, background: filterStatus === s ? (dark ? "rgba(99,102,241,0.2)" : "#EEF2FF") : t.surface, color: filterStatus === s ? "#6366F1" : t.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                ))}
              </div>
            </div>
            {filtered.length === 0 ? (
              <div style={{ background: t.surface, borderRadius: 18, border: `1px solid ${t.border}`, padding: "4rem 2rem", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 6 }}>No tickets found</div>
                <button onClick={() => setActiveTab("submit")} style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", borderRadius: 10, padding: "10px 24px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Submit your first ticket →</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filtered.map(tk => {
                  const di = DEPARTMENTS.indexOf(tk.department);
                  const dc = DEPT_COLORS[di] || "#6366F1";
                  return (
                    <div key={tk.id} className="hoverlift" style={{ background: t.surface, borderRadius: 14, border: `1px solid ${t.border}`, padding: "1.25rem 1.5rem", borderLeft: `4px solid ${dc}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 12, color: t.muted, fontWeight: 600, marginBottom: 3 }}>{tk.id} · {tk.date}</div>
                          <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: dc, background: dc + (dark ? "30" : "15"), padding: "2px 10px", borderRadius: 100 }}>{tk.department}</div>
                        </div>
                        <StatusBadge status={tk.status} dark={dark} />
                      </div>
                      <div style={{ fontSize: 14, color: t.text, lineHeight: 1.6, marginBottom: tk.response ? 10 : 0 }}>{tk.description}</div>

                      {/* Show admin response if available — Week 2 */}
                      {tk.response && (
                        <div style={{ marginTop: 10, padding: "10px 14px", background: dark ? "rgba(16,185,129,0.08)" : "#F0FDF4", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                            <span>💬</span> Admin Response
                            {tk.responseTone && <span style={{ background: TONE_CONFIG[tk.responseTone]?.bg, color: TONE_CONFIG[tk.responseTone]?.color, padding: "1px 8px", borderRadius: 100, fontSize: 10 }}>{TONE_CONFIG[tk.responseTone]?.emoji} {TONE_CONFIG[tk.responseTone]?.label}</span>}
                          </div>
                          <div style={{ fontSize: 12, color: t.text, lineHeight: 1.65, whiteSpace: "pre-wrap", maxHeight: 120, overflowY: "auto", fontFamily: "'DM Mono', monospace" }}>{tk.response.substring(0, 200)}{tk.response.length > 200 ? "…" : ""}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <Modal show={!!modal} onClose={() => { if (modal?.action) modal.action(); setModal(null); }} title={modal?.title} type={modal?.type} btnLabel={modal?.type === "success" ? "View History →" : "Got it"} dark={dark}>{modal?.body}</Modal>
    </div>
  );
}

// ─── Admin Portal (enhanced with response generator) ─────────────────────────
function AdminPortal({ user, tickets, setTickets, onLogout, dark, setDark }) {
  const [filter, setFilter] = useState("All");
  const [activeTicket, setActiveTicket] = useState(null);
  const [activeTab, setActiveTab] = useState("tickets"); // tickets | responses
  const t = dark ? DARK : LIGHT;
  const deptTickets = tickets.filter(tk => tk.department === user.department);
  const filtered = filter === "All" ? deptTickets : deptTickets.filter(tk => tk.status === filter);
  const stats = {
    total: deptTickets.length,
    open: deptTickets.filter(tk => tk.status === "Open").length,
    pending: deptTickets.filter(tk => tk.status === "Pending").length,
    resolved: deptTickets.filter(tk => tk.status === "Resolved").length,
    responded: deptTickets.filter(tk => tk.response).length,
  };
  const deptCounts = DEPARTMENTS.map((d, i) => ({ dept: d, count: tickets.filter(tk => tk.department === d).length, color: DEPT_COLORS[i] }));
  const maxCount = Math.max(...deptCounts.map(d => d.count), 1);

  const updateStatus = (id, status) => setTickets(p => p.map(tk => tk.id === id ? { ...tk, status } : tk));
  const saveResponse = (id, response, tone) => setTickets(p => p.map(tk => tk.id === id ? { ...tk, response, responseTone: tone, status: tk.status === "Open" ? "Pending" : tk.status } : tk));

  const statCards = [
    { label: "Total",     value: stats.total,     color: "#6366F1" },
    { label: "Open",      value: stats.open,       color: "#F59E0B" },
    { label: "Pending",   value: stats.pending,    color: "#3B82F6" },
    { label: "Resolved",  value: stats.resolved,   color: "#10B981" },
    { label: "Responded", value: stats.responded,  color: "#8B5CF6" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'DM Sans',sans-serif", color: t.text }}>
      <style>{GLOBAL_STYLES}</style>
      <header style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, padding: "0 2rem", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌉</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: t.text }}>OpsBridge</span>
          <span style={{ fontSize: 11, background: dark ? "rgba(99,102,241,0.2)" : "#EEF2FF", color: "#6366F1", padding: "2px 10px", borderRadius: 100, fontWeight: 700, marginLeft: 4 }}>{user.department} Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThemeToggle dark={dark} setDark={setDark} />
          <div style={{ width: 33, height: 33, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 800 }}>{user.name[0]}</div>
          <span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{user.name}</span>
          <button onClick={onLogout} style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 13, color: t.muted, cursor: "pointer", fontFamily: "inherit" }}>Logout</button>
        </div>
      </header>

      {/* Sub-navigation tabs */}
      <div style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, display: "flex", padding: "0 2rem" }}>
        {[
          { key: "tickets",   label: `🎫 Ticket Queue (${deptTickets.length})` },
          { key: "responses", label: `💬 Response Generator` },
        ].map(tb => (
          <button key={tb.key} onClick={() => setActiveTab(tb.key)} style={{ padding: "14px 20px", border: "none", borderBottom: activeTab === tb.key ? "2px solid #6366F1" : "2px solid transparent", background: "none", fontSize: 14, fontWeight: activeTab === tb.key ? 700 : 500, color: activeTab === tb.key ? "#6366F1" : t.muted, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {tb.label}
            {tb.key === "responses" && <span style={{ marginLeft: 6, fontSize: 9, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", padding: "2px 6px", borderRadius: 100, fontWeight: 700 }}>WEEK 2</span>}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: t.text, margin: "0 0 0.25rem" }}>{user.department} Department Dashboard</h1>
          <p style={{ fontSize: 14, color: t.muted, margin: 0 }}>Manage tickets and generate AI-powered responses for your department.</p>
        </div>

        {/* Stats - now includes Responded */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: t.surface, borderRadius: 14, border: `1px solid ${t.border}`, padding: "1rem 1.25rem" }}>
              <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: t.text, fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>{s.value}</div>
              <div style={{ height: 4, borderRadius: 100, background: t.subtle }}>
                <div style={{ height: "100%", borderRadius: 100, background: s.color, width: stats.total ? `${(s.value / stats.total) * 100}%` : "0%", transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* TICKETS TAB */}
        {activeTab === "tickets" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
            <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, color: t.text, margin: 0 }}>Tickets · {user.department}</h2>
                <div style={{ display: "flex", gap: 5 }}>
                  {["All", "Open", "Pending", "Resolved"].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${filter === s ? "#6366F1" : t.border}`, background: filter === s ? (dark ? "rgba(99,102,241,0.2)" : "#EEF2FF") : t.surface, color: filter === s ? "#6366F1" : t.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto" }}>
                {filtered.length === 0
                  ? <div style={{ textAlign: "center", padding: "3rem", color: t.muted, fontSize: 14 }}>No tickets in this category.</div>
                  : filtered.map(tk => (
                    <div key={tk.id} className="hoverlift" style={{ background: t.subtle, borderRadius: 12, padding: "1rem 1.25rem", border: `1px solid ${t.border}`, cursor: "pointer" }}
                      onClick={() => { setActiveTicket(tk.id === activeTicket ? null : tk.id); setActiveTab("responses"); }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{tk.userName}</div>
                          <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{tk.id} · {tk.date}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <select value={tk.status} onChange={e => { e.stopPropagation(); updateStatus(tk.id, e.target.value); }}
                            onClick={e => e.stopPropagation()}
                            style={{ padding: "5px 10px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 12, background: t.surface, color: t.text, fontFamily: "inherit", cursor: "pointer" }}>
                            <option>Open</option><option>Pending</option><option>Resolved</option>
                          </select>
                          {tk.response && <span style={{ fontSize: 10, color: "#10B981", fontWeight: 700 }}>💬 Responded</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6, marginBottom: 8 }}>{tk.description}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <StatusBadge status={tk.status} dark={dark} />
                        <span style={{ fontSize: 11, color: "#6366F1", fontWeight: 600 }}>Click to respond →</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Department overview */}
            <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: "1.5rem" }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: t.text, margin: "0 0 1.5rem" }}>All Departments</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {deptCounts.map(d => (
                  <div key={d.dept}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: d.dept === user.department ? d.color : t.text }}>{d.dept}{d.dept === user.department ? " ★" : ""}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: t.text }}>{d.count}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 100, background: t.subtle }}>
                      <div style={{ height: "100%", borderRadius: 100, background: d.color, width: `${Math.round((d.count / maxCount) * 100)}%`, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESPONSES TAB — Week 2 Feature */}
        {activeTab === "responses" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {/* Ticket selector */}
              <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: "1.5rem" }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, color: t.text, margin: "0 0 1rem" }}>Select a Ticket to Respond</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 560, overflowY: "auto" }}>
                  {deptTickets.map(tk => {
                    const isActive = activeTicket === tk.id;
                    return (
                      <div key={tk.id} onClick={() => setActiveTicket(isActive ? null : tk.id)}
                        style={{ padding: "12px 14px", borderRadius: 12, border: `2px solid ${isActive ? "#6366F1" : (dark ? "#334155" : "#E2E8F0")}`, background: isActive ? (dark ? "rgba(99,102,241,0.1)" : "#EEF2FF") : t.subtle, cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{tk.userName}</div>
                          <div style={{ display: "flex", gap: 4 }}>
                            {tk.response && <span style={{ fontSize: 10, color: "#10B981", fontWeight: 700 }}>✓</span>}
                            <StatusBadge status={tk.status} dark={dark} />
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: t.muted, marginBottom: 4 }}>{tk.id} · {tk.date}</div>
                        <div style={{ fontSize: 12, color: t.text, lineHeight: 1.5 }}>{tk.description.substring(0, 90)}{tk.description.length > 90 ? "…" : ""}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Response generator */}
              <div>
                {activeTicket ? (
                  <div style={{ animation: "slideIn 0.25s ease" }}>
                    {(() => {
                      const tk = tickets.find(t => t.id === activeTicket);
                      return tk ? (
                        <>
                          {/* Ticket summary */}
                          <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: "1.25rem", marginBottom: 14 }}>
                            <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, marginBottom: 6 }}>RESPONDING TO</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tk.userName} · {tk.id}</div>
                            <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6 }}>{tk.description}</div>
                          </div>
                          <ResponsePanel ticket={tk} dark={dark} onSave={saveResponse} />
                        </>
                      ) : null;
                    })()}
                  </div>
                ) : (
                  <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: "4rem 2rem", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 8 }}>AI Response Generator</div>
                    <div style={{ fontSize: 14, color: t.muted, lineHeight: 1.7, maxWidth: 280 }}>Select a ticket from the list to generate a professional AI-powered response with tone control.</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
                      {Object.entries(TONE_CONFIG).map(([key, cfg]) => (
                        <span key={key} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.emoji} {cfg.label}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function BarChart({ deptStats, dark }) {
  const t = dark ? DARK : LIGHT;
  const W = 420, H = 200, padL = 40, padB = 30, padT = 20, padR = 16;
  const chartW = W - padL - padR, chartH = H - padB - padT;
  const maxVal = Math.max(...deptStats.map(d => d.total), 1);
  const yTicks = [0, Math.ceil(maxVal / 4), Math.ceil(maxVal / 2), Math.ceil(3 * maxVal / 4), maxVal];
  const barW = (chartW / deptStats.length) * 0.55;
  const gap = chartW / deptStats.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {yTicks.map((val, i) => { const y = padT + chartH - (val / maxVal) * chartH; return (<g key={i}><line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke={dark ? "#334155" : "#E2E8F0"} strokeWidth="1" strokeDasharray="4,4" /><text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9" fill={t.muted}>{val}</text></g>); })}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke={dark ? "#475569" : "#CBD5E1"} strokeWidth="1.5" />
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke={dark ? "#475569" : "#CBD5E1"} strokeWidth="1.5" />
      {deptStats.map((d, i) => { const x = padL + i * gap + (gap - barW) / 2; const barH = Math.max((d.total / maxVal) * chartH, 2); const y = padT + chartH - barH; return (<g key={d.dept}><rect x={x} y={y} width={barW} height={barH} rx="4" fill={d.color} opacity="0.9" /><text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="10" fontWeight="700" fill={d.color}>{d.total}</text><text x={x + barW / 2} y={padT + chartH + 18} textAnchor="middle" fontSize="9" fontWeight="600" fill={t.muted}>{d.dept}</text></g>); })}
    </svg>
  );
}

function PieChart({ deptStats, dark }) {
  const t = dark ? DARK : LIGHT;
  const total = deptStats.reduce((s, d) => s + d.total, 0) || 1;
  const cx = 80, cy = 80, r = 65, ir = 36;
  let angle = -Math.PI / 2;
  const slices = deptStats.map(d => { const pct = d.total / total; const start = angle; angle += pct * 2 * Math.PI; return { ...d, pct, start, end: angle }; });
  const donut = (cx, cy, R, rr, s, e) => { const x1o=cx+R*Math.cos(s),y1o=cy+R*Math.sin(s),x2o=cx+R*Math.cos(e),y2o=cy+R*Math.sin(e),x1i=cx+rr*Math.cos(e),y1i=cy+rr*Math.sin(e),x2i=cx+rr*Math.cos(s),y2i=cy+rr*Math.sin(s),lg=e-s>Math.PI?1:0; return `M ${x1o} ${y1o} A ${R} ${R} 0 ${lg} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${rr} ${rr} 0 ${lg} 0 ${x2i} ${y2i} Z`; };
  return (
    <svg viewBox="0 0 260 180" style={{ width: "100%", height: "auto", display: "block" }}>
      {slices.map((s, i) => (<path key={i} d={s.pct > 0 ? donut(cx, cy, r, ir, s.start, s.end) : ""} fill={s.color} opacity="0.9" />))}
      <circle cx={cx} cy={cy} r={ir - 2} fill={dark ? "#1E293B" : "#fff"} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill={dark ? "#F1F5F9" : "#111"}>{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill={dark ? "#94A3B8" : "#64748B"}>Total</text>
      {slices.map((s, i) => (<g key={i} transform={`translate(170, ${20 + i * 36})`}><rect x="0" y="0" width="12" height="12" rx="3" fill={s.color} /><text x="17" y="10" fontSize="10" fontWeight="600" fill={dark ? "#CBD5E1" : "#374151"}>{s.dept}</text><text x="17" y="22" fontSize="9" fill={dark ? "#64748B" : "#94A3B8"}>{Math.round(s.pct * 100)}% · {s.total}</text></g>))}
    </svg>
  );
}

function LineChart({ tickets, dark }) {
  const t = dark ? DARK : LIGHT;
  const W = 420, H = 180, padL = 40, padB = 30, padT = 20, padR = 16;
  const chartW = W - padL - padR, chartH = H - padB - padT;
  const byDate = {};
  tickets.forEach(tk => { byDate[tk.date] = (byDate[tk.date] || 0) + 1; });
  const dates = Object.keys(byDate).sort().slice(-7);
  const values = dates.map(d => byDate[d]);
  const maxVal = Math.max(...values, 1);
  const points = dates.map((d, i) => ({ x: padL + (i / Math.max(dates.length - 1, 1)) * chartW, y: padT + chartH - (values[i] / maxVal) * chartH, val: values[i], date: d }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
  const areaPath = points.length > 0 ? `M ${points[0].x},${padT + chartH} ` + points.map(p => `L ${p.x},${p.y}`).join(" ") + ` L ${points[points.length - 1].x},${padT + chartH} Z` : "";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs><linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" /><stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" /></linearGradient></defs>
      {[0, Math.ceil(maxVal / 2), maxVal].map((val, i) => { const y = padT + chartH - (val / maxVal) * chartH; return (<g key={i}><line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke={dark ? "#334155" : "#E2E8F0"} strokeWidth="1" strokeDasharray="4,4" /><text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9" fill={t.muted}>{val}</text></g>); })}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke={dark ? "#475569" : "#CBD5E1"} strokeWidth="1.5" />
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke={dark ? "#475569" : "#CBD5E1"} strokeWidth="1.5" />
      {areaPath && <path d={areaPath} fill="url(#lineArea)" />}
      {points.length > 1 && <polyline points={polyline} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
      {points.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="4" fill="#6366F1" stroke={dark ? "#1E293B" : "#fff"} strokeWidth="2" /><text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="9" fontWeight="700" fill="#6366F1">{p.val}</text><text x={p.x} y={padT + chartH + 18} textAnchor="middle" fontSize="8" fill={t.muted}>{p.date.slice(5)}</text></g>))}
    </svg>
  );
}

// ─── Super Admin Portal ───────────────────────────────────────────────────────
function SuperAdminPortal({ user, tickets, setTickets, onLogout, dark, setDark }) {
  const [activeDept, setActiveDept] = useState("ALL");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const t = dark ? DARK : LIGHT;

  const displayTickets = tickets
    .filter(tk => activeDept === "ALL" || tk.department === activeDept)
    .filter(tk => filter === "All" || tk.status === filter)
    .filter(tk => !search || tk.description.toLowerCase().includes(search.toLowerCase()) || tk.userName.toLowerCase().includes(search.toLowerCase()) || tk.id.toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id, status) => setTickets(p => p.map(tk => tk.id === id ? { ...tk, status } : tk));
  const total = tickets.length, open = tickets.filter(tk => tk.status === "Open").length, pending = tickets.filter(tk => tk.status === "Pending").length, resolved = tickets.filter(tk => tk.status === "Resolved").length;
  const responded = tickets.filter(tk => tk.response).length;
  const deptStats = DEPARTMENTS.map((d, i) => ({ dept: d, color: DEPT_COLORS[i], total: tickets.filter(tk => tk.department === d).length, open: tickets.filter(tk => tk.department === d && tk.status === "Open").length, pending: tickets.filter(tk => tk.department === d && tk.status === "Pending").length, resolved: tickets.filter(tk => tk.department === d && tk.status === "Resolved").length }));
  const CARD = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)";
  const CARDBORDER = dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.12)";

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0A0F1E" : "#0F1F3D", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      <style>{GLOBAL_STYLES + `.sa-card:hover { border-color: rgba(99,102,241,0.4) !important; transform: translateY(-2px); } .sa-card { transition: all 0.2s ease; }`}</style>
      <header style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🌉</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>OpsBridge</span>
          <span style={{ fontSize: 11, background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.4)", color: "#A5B4FC", padding: "3px 12px", borderRadius: 100, fontWeight: 700 }}>👑 Super Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ThemeToggle dark={dark} setDark={setDark} />
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B,#EF4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{user.name[0]}</div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#CBD5E1" }}>{user.name}</span>
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#94A3B8", borderRadius: 8, padding: "6px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 0.35rem", background: "linear-gradient(135deg,#fff,#A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Command Centre</h1>
          <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>Full visibility across all departments, tickets, and AI responses.</p>
        </div>

        {/* Global stats — now 5 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: "1.5rem" }}>
          {[
            { label: "Total Tickets", value: total,     color: "#6366F1", icon: "🎫" },
            { label: "Open",          value: open,      color: "#F59E0B", icon: "🔓" },
            { label: "Pending",       value: pending,   color: "#3B82F6", icon: "⏳" },
            { label: "Resolved",      value: resolved,  color: "#10B981", icon: "✅" },
            { label: "Responded",     value: responded, color: "#8B5CF6", icon: "💬" },
          ].map(s => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${CARDBORDER}`, borderRadius: 16, padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: "#fff", marginBottom: 14 }}>{s.value}</div>
              <div style={{ height: 4, borderRadius: 100, background: "rgba(255,255,255,0.08)" }}>
                <div style={{ height: "100%", borderRadius: 100, background: s.color, width: total ? `${(s.value / total) * 100}%` : "0%", transition: "width 0.6s ease", boxShadow: `0 0 8px ${s.color}60` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Dept cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: "1.5rem" }}>
          {deptStats.map(d => (
            <div key={d.dept} className="sa-card" onClick={() => setActiveDept(activeDept === d.dept ? "ALL" : d.dept)} style={{ background: activeDept === d.dept ? `${d.color}22` : CARD, border: `1px solid ${activeDept === d.dept ? d.color + "60" : CARDBORDER}`, borderRadius: 16, padding: "1.25rem", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: d.color, fontFamily: "'Syne',sans-serif" }}>{d.dept}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif" }}>{d.total}</div>
              </div>
              <div style={{ height: 4, borderRadius: 100, background: "rgba(255,255,255,0.08)", marginBottom: 12 }}>
                <div style={{ height: "100%", borderRadius: 100, background: d.color, width: `${Math.round((d.total / Math.max(...deptStats.map(x => x.total), 1)) * 100)}%` }} />
              </div>
              <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
                <span style={{ color: "#F59E0B" }}>● {d.open} open</span>
                <span style={{ color: "#3B82F6" }}>● {d.pending} pend</span>
                <span style={{ color: "#10B981" }}>● {d.resolved} done</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
          <div style={{ background: CARD, border: `1px solid ${CARDBORDER}`, borderRadius: 16, padding: "1.25rem" }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 1rem", color: "#fff" }}>Volume by Department</h3>
            <BarChart deptStats={deptStats} dark={dark} />
          </div>
          <div style={{ background: CARD, border: `1px solid ${CARDBORDER}`, borderRadius: 16, padding: "1.25rem" }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 1rem", color: "#fff" }}>Distribution</h3>
            <PieChart deptStats={deptStats} dark={dark} />
          </div>
          <div style={{ background: CARD, border: `1px solid ${CARDBORDER}`, borderRadius: 16, padding: "1.25rem" }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 1rem", color: "#fff" }}>Ticket Trend</h3>
            <LineChart tickets={tickets} dark={dark} />
          </div>
        </div>

        {/* Tickets table */}
        <div style={{ background: CARD, border: `1px solid ${CARDBORDER}`, borderRadius: 16, padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, margin: "0 0 0.2rem" }}>{activeDept === "ALL" ? "All Tickets" : `${activeDept} Tickets`}</h2>
              <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>{displayTickets.length} result{displayTickets.length !== 1 ? "s" : ""}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…" style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", width: 200 }} />
              {["All", "Open", "Pending", "Resolved"].map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${filter === s ? "#6366F1" : "rgba(255,255,255,0.1)"}`, background: filter === s ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", color: filter === s ? "#A5B4FC" : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
              ))}
              <button onClick={() => { setActiveDept("ALL"); setFilter("All"); setSearch(""); }} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Reset</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto" }}>
            {displayTickets.length === 0
              ? <div style={{ textAlign: "center", padding: "3rem", color: "#334155", fontSize: 14 }}>No tickets match your filters.</div>
              : displayTickets.map(tk => {
                const di = DEPARTMENTS.indexOf(tk.department);
                const dc = DEPT_COLORS[di] || "#6366F1";
                return (
                  <div key={tk.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `4px solid ${dc}`, display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{tk.userName}</span>
                        <span style={{ fontSize: 11, color: "#475569" }}>{tk.id} · {tk.date}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: dc, background: dc + "20", padding: "1px 8px", borderRadius: 100 }}>{tk.department}</span>
                        {tk.response && <span style={{ fontSize: 10, fontWeight: 700, color: "#8B5CF6", background: "rgba(139,92,246,0.15)", padding: "1px 8px", borderRadius: 100 }}>💬 {tk.responseTone ? TONE_CONFIG[tk.responseTone]?.label : "Responded"}</span>}
                      </div>
                      <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.55 }}>{tk.description}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <StatusBadge status={tk.status} dark={true} />
                      <select value={tk.status} onChange={e => updateStatus(tk.id, e.target.value)} style={{ padding: "4px 8px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#CBD5E1", fontSize: 11, fontFamily: "inherit", cursor: "pointer" }}>
                        <option>Open</option><option>Pending</option><option>Resolved</option>
                      </select>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [currentUser, setCurrentUser] = useState(null);
  const [regModal, setRegModal] = useState(false);
  const [dark, setDark] = useState(false);
  const t = dark ? DARK : LIGHT;

  const handleAuthEvent = (event) => {
    if (event.type === "login") {
      setCurrentUser(event.user);
      if (event.user.role === "superadmin") setPage("superadmin");
      else if (event.user.role === "admin") setPage("admin");
      else setPage("employee");
    } else if (event.type === "registered") {
      setRegModal(true);
    }
  };

  const handleLogout = () => { setCurrentUser(null); setPage("login"); };

  return (
    <>
      {page === "landing"   && <LandingPage onNav={setPage} />}
      {(page === "login" || page === "register") && <AuthPage mode={page} onNav={setPage} users={users} setUsers={setUsers} admins={admins} setAdmins={setAdmins} onRegistered={handleAuthEvent} dark={dark} setDark={setDark} />}
      {page === "employee"  && currentUser && <EmployeePortal user={currentUser} tickets={tickets} setTickets={setTickets} onLogout={handleLogout} dark={dark} setDark={setDark} />}
      {page === "admin"     && currentUser && <AdminPortal    user={currentUser} tickets={tickets} setTickets={setTickets} onLogout={handleLogout} dark={dark} setDark={setDark} />}
      {page === "superadmin"&& currentUser && <SuperAdminPortal user={currentUser} tickets={tickets} setTickets={setTickets} onLogout={handleLogout} dark={dark} setDark={setDark} />}
      <Modal show={regModal} onClose={() => { setRegModal(false); setPage("login"); }} title="Registration Successful! 🎉" type="success" btnLabel="Go to Sign In →" dark={dark}>
        Your account has been created. Please sign in to access your dashboard.
      </Modal>
    </>
  );
}