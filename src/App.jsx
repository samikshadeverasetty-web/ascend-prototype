import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home, BookOpen, Brain, ListChecks, Bot, Calendar, Trophy, BarChart2,
  Flame, Star, Target, ChevronRight, ArrowRight, Play, Check, X,
  Sparkles, Zap, TrendingUp, Clock, Menu, Send, Award, Gift,
  ShieldCheck, AlertTriangle, ChevronLeft, CheckCircle2, Circle,
  Plus, Lock, RotateCcw
} from "lucide-react";

/* ---------------------------------------------------------------
   DESIGN TOKENS
   bg        #0A0E14  near-black slate
   surface   #121722  card base
   surface-2 #1A2129  elevated card
   border    #242C38
   text      #EAEEF3
   text-dim  #8D97A6
   teal      #2FD9B9  growth / mastery
   amber     #F2A63A  points / rewards
   coral     #EF6461  weak / risk
   violet    #7C83FD  ai / tutor accent
------------------------------------------------------------------*/
const T = {
  bg: "#0A0E14",
  surface: "#121722",
  surface2: "#1A2129",
  surface3: "#212a35",
  border: "#242C38",
  borderLight: "#2E3746",
  text: "#EAEEF3",
  dim: "#8D97A6",
  faint: "#5C6675",
  teal: "#2FD9B9",
  tealDim: "#173B34",
  amber: "#F2A63A",
  amberDim: "#3D2E14",
  coral: "#EF6461",
  coralDim: "#3A1F1E",
  violet: "#7C83FD",
  violetDim: "#211F3D",
};

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Sora', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${T.borderLight}; border-radius: 8px; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px);} to {opacity:1; transform: translateY(0);} }
    @keyframes popIn { from { opacity: 0; transform: scale(0.9);} to {opacity:1; transform: scale(1);} }
    @keyframes pulseGlow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
    @keyframes slideInRight { from { opacity:0; transform: translateX(24px);} to { opacity:1; transform: translateX(0);} }
    @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
    .fade-up { animation: fadeUp .45s ease both; }
    .pop-in { animation: popIn .3s cubic-bezier(.2,.9,.3,1.2) both; }
    .slide-in { animation: slideInRight .35s ease both; }
    .hover-lift { transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; }
    .hover-lift:hover { transform: translateY(-3px); }
    input[type=range] { -webkit-appearance: none; height: 4px; background: ${T.border}; border-radius: 4px; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${T.teal}; cursor: pointer; }
  `}</style>
);

/* ---------------------------------------------------------------
   MOCK DATA
------------------------------------------------------------------*/
const STUDENT = { name: "Sam" };

const INITIAL_SUBJECTS = [
  { id: "java", name: "Java", mastery: 82, color: T.teal },
  { id: "dsa", name: "DSA", mastery: 61, color: T.amber },
  { id: "sql", name: "SQL", mastery: 91, color: T.teal },
  { id: "problem-solving", name: "Problem Solving", mastery: 74, color: T.violet },
];

const DSA_TOPICS = [
  { id: "arrays", name: "Arrays", mastery: 86 },
  { id: "searching", name: "Searching", mastery: 72 },
  { id: "sorting", name: "Sorting", mastery: 48 },
  { id: "recursion", name: "Recursion", mastery: 31 },
];

const RECOMMENDATIONS = [
  {
    id: "r1", tag: "Strengthen this", tagColor: T.coral,
    title: "Trigonometry Identities",
    reason: "Your last 3 attempts show difficulty with this concept.",
    icon: AlertTriangle,
  },
  {
    id: "r2", tag: "Level up", tagColor: T.teal,
    title: "Binary Search",
    reason: "You're ready for the next difficulty level.",
    icon: TrendingUp,
  },
  {
    id: "r3", tag: "Quick win", tagColor: T.amber,
    title: "Arrays Revision",
    reason: "5 minutes to strengthen a weak area.",
    icon: Zap,
  },
];

const QUIZ_BANK = {
  easy: [
    { q: "What is the time complexity of accessing an array element by index?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correct: 0, explain: "Arrays support direct indexing, so lookup is constant time." },
    { q: "Binary search requires the input array to be:", options: ["Sorted", "Reversed", "Unique length", "Circular"], correct: 0, explain: "Binary search only works correctly on a sorted sequence." },
  ],
  medium: [
    { q: "What is the time complexity of binary search on a sorted array of size n?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correct: 1, explain: "Binary search halves the search space each step, giving O(log n)." },
    { q: "In binary search, if target < mid value, you should:", options: ["Search the right half", "Search the left half", "Stop searching", "Restart from index 0"], correct: 1, explain: "Since the array is sorted, a smaller target must lie in the left half." },
    { q: "What happens if binary search is run on an unsorted array?", options: ["It still works correctly", "It may give incorrect results", "It becomes O(1)", "It throws an error always"], correct: 1, explain: "Binary search relies on order to eliminate halves; unsorted data breaks that assumption." },
  ],
  hard: [
    { q: "What is the worst-case number of comparisons for binary search on n=1024 elements?", options: ["10", "512", "1024", "100"], correct: 0, explain: "log2(1024) = 10, so at most 10 comparisons are needed." },
    { q: "Which variant finds the first occurrence of a duplicate value in binary search?", options: ["Standard binary search", "Lower-bound binary search", "Linear scan only", "Depth-first search"], correct: 1, explain: "A lower-bound variant keeps narrowing toward the leftmost matching index." },
  ],
};

const TUTOR_PROMPTS = ["Explain this simply", "Give me an example", "Quiz me", "Why is my answer wrong?", "Give me a real-world example"];
const TUTOR_RESPONSES = {
  "Explain this simply": "Binary search works by repeatedly cutting the sorted list in half. Check the middle item — if it's too big, drop the right half; if it's too small, drop the left half. Repeat until you find the value or run out of items.",
  "Give me an example": "Say you're searching for 23 in [4, 9, 15, 23, 42, 58]. Middle is 15 — too small, so look right in [23, 42, 58]. New middle is 42 — too big, so look left, leaving just [23]. Found it in 2 steps instead of checking all 6.",
  "Quiz me": "Sure — here's one: You're searching a sorted array of 16 items. What's the maximum number of comparisons binary search needs? Think in powers of 2, then head to Practice to lock in the answer.",
  "Why is my answer wrong?": "On your last attempt you searched the right half when the target was smaller than the middle value. Remember: smaller target → go left, larger target → go right. Try flipping that check.",
  "Give me a real-world example": "It's how you'd find a name in a printed phone book — you don't start at page 1. You open to the middle, see which half the name falls in, and keep halving until you land on the page.",
};

const REWARDS = [
  { id: "food", name: "Food Delivery Voucher", cost: 500, icon: Gift, blurb: "₹100 off your next order." },
  { id: "essentials", name: "Study Essentials", cost: 800, icon: BookOpen, blurb: "Stationery pack credit." },
  { id: "delivery", name: "Delivery Discount", cost: 1000, icon: Gift, blurb: "₹100 delivery-app discount." },
  { id: "premium", name: "Premium Learning Benefit", cost: 2000, icon: Award, blurb: "1 month of premium content." },
];

const BADGES = [
  { id: "streak7", label: "7 Day Streak", icon: Flame, earned: true },
  { id: "concept", label: "Concept Master", icon: Brain, earned: true },
  { id: "goal", label: "Goal Crusher", icon: Target, earned: true },
  { id: "consistent", label: "Consistent Learner", icon: Award, earned: false },
];

const WEEKLY_TIME = [40, 55, 30, 65, 50, 20, 45];
const ACCURACY_TREND = [58, 62, 60, 68, 71, 74, 78];
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const NAV_ITEMS = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "skills", label: "My Skills", icon: Brain },
  { id: "practice", label: "Practice", icon: ListChecks },
  { id: "tutor", label: "Smart Tutor", icon: Bot },
  { id: "planner", label: "Planner", icon: Calendar },
  { id: "rewards", label: "Rewards", icon: Trophy },
  { id: "progress", label: "Progress", icon: BarChart2 },
];

/* ---------------------------------------------------------------
   SMALL UI PRIMITIVES
------------------------------------------------------------------*/
function ProgressRing({ value, size = 96, stroke = 9, color = T.teal, label, sub }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={T.border} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.9,.3,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span className="font-display" style={{ fontSize: size * 0.24, fontWeight: 700, color: T.text }}>{value}%</span>
        {sub && <span className="font-body" style={{ fontSize: 10, color: T.dim }}>{sub}</span>}
      </div>
    </div>
  );
}

function MasteryBar({ label, value, showLevel = false }) {
  const level = value >= 75 ? { text: "Strong", color: T.teal } : value >= 45 ? { text: "Needs practice", color: T.amber } : { text: "Weak", color: T.coral };
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span className="font-body" style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {showLevel && <span style={{ fontSize: 11, color: level.color, fontWeight: 600 }}>{level.text}</span>}
          <span className="font-body" style={{ fontSize: 13, color: T.dim }}>{value}%</span>
        </div>
      </div>
      <div style={{ height: 8, background: T.border, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: level.color, borderRadius: 6, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function Card({ children, style, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`hover-lift ${className}`}
      style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
        padding: 20, cursor: onClick ? "pointer" : "default", ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color = T.teal, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 600, color, background: bg || `${color}22`,
    }}>{children}</span>
  );
}

function PrimaryButton({ children, onClick, icon: Icon, style, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-body"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: disabled ? T.surface3 : `linear-gradient(135deg, ${T.teal}, #1fb89e)`,
        color: disabled ? T.faint : "#052420", border: "none", borderRadius: 12,
        padding: "12px 22px", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer",
        transition: "transform .15s ease, box-shadow .15s ease",
        boxShadow: disabled ? "none" : `0 6px 20px -6px ${T.teal}88`,
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon, style }) {
  return (
    <button
      onClick={onClick}
      className="font-body"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: "transparent", color: T.text, border: `1px solid ${T.borderLight}`, borderRadius: 12,
        padding: "12px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer",
        transition: "border-color .15s ease, background .15s ease", ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = T.surface2; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="pop-in font-body" style={{
      position: "fixed", top: 20, right: 20, zIndex: 200, background: T.surface2, border: `1px solid ${toast.color || T.teal}`,
      borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 12px 30px -8px rgba(0,0,0,.5)", minWidth: 220,
    }}>
      {toast.icon && <toast.icon size={18} color={toast.color || T.teal} />}
      <span style={{ color: T.text, fontSize: 14, fontWeight: 500 }}>{toast.text}</span>
    </div>
  );
}

/* ---------------------------------------------------------------
   NAVIGATION
------------------------------------------------------------------*/
function Sidebar({ page, setPage }) {
  return (
    <div className="font-body" style={{
      width: 232, flexShrink: 0, background: T.surface, borderRight: `1px solid ${T.border}`,
      padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 0, height: "100vh",
    }}>
      <div className="font-display" style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px", marginBottom: 28 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${T.teal}, ${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={17} color="#08110F" />
        </div>
        <span style={{ fontSize: 19, fontWeight: 700, color: T.text }}>Ascend</span>
      </div>
      {NAV_ITEMS.map((item) => {
        const active = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10,
              background: active ? T.surface3 : "transparent", border: "none", cursor: "pointer",
              color: active ? T.teal : T.dim, fontSize: 14, fontWeight: 600, textAlign: "left", transition: "all .15s ease",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.surface2; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <item.icon size={18} /> {item.label}
          </button>
        );
      })}
      <div style={{ marginTop: "auto", padding: 12, borderRadius: 12, background: T.surface2, border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.violetDim, display: "flex", alignItems: "center", justifyContent: "center", color: T.violet, fontWeight: 700, fontSize: 13 }}>
            {STUDENT.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{STUDENT.name}</div>
            <div style={{ fontSize: 11, color: T.dim }}>Learner</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ page, setPage }) {
  const items = NAV_ITEMS.slice(0, 5);
  return (
    <div className="font-body" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, background: T.surface, borderTop: `1px solid ${T.border}`,
      display: "flex", justifyContent: "space-around", padding: "8px 4px", zIndex: 100,
    }}>
      {items.map((item) => {
        const active = page === item.id;
        return (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: active ? T.teal : T.faint, fontSize: 10, padding: "4px 8px", cursor: "pointer",
          }}>
            <item.icon size={19} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------
   LANDING PAGE
------------------------------------------------------------------*/
function Landing({ onStart, onExplore }) {
  return (
    <div className="font-body" style={{ minHeight: "100vh", background: `radial-gradient(1100px 500px at 15% -10%, ${T.tealDim}, transparent), radial-gradient(900px 500px at 100% 0%, ${T.violetDim}, transparent), ${T.bg}`, color: T.text, padding: "28px 24px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1080, margin: "0 auto 70px" }}>
        <div className="font-display" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${T.teal}, ${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={17} color="#08110F" />
          </div>
          <span style={{ fontSize: 19, fontWeight: 700 }}>Ascend</span>
        </div>
        <PrimaryButton onClick={onStart}>Start Learning</PrimaryButton>
      </div>

      <div className="fade-up" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <Pill color={T.violet}><Sparkles size={12} /> Built for the way you actually learn</Pill>
        <h1 className="font-display" style={{ fontSize: 52, lineHeight: 1.08, fontWeight: 800, margin: "22px 0 18px" }}>
          Learn smarter. Stay consistent. Get rewarded.
        </h1>
        <p style={{ fontSize: 17, color: T.dim, maxWidth: 560, margin: "0 auto 34px", lineHeight: 1.6 }}>
          A personalized learning platform that adapts to you, tracks your growth, and rewards your consistency.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <PrimaryButton onClick={onStart} icon={ArrowRight} style={{ padding: "14px 28px", fontSize: 15 }}>Start Learning</PrimaryButton>
          <GhostButton onClick={onExplore} icon={Play} style={{ padding: "14px 28px", fontSize: 15 }}>Explore how it works</GhostButton>
        </div>
      </div>

      <div id="how-it-works" className="fade-up" style={{ maxWidth: 1080, margin: "80px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
        {[
          { icon: Target, title: "Finds your gaps", desc: "Continuously assesses what you know and pinpoints exactly where to focus next.", color: T.teal },
          { icon: Bot, title: "Personal AI tutor", desc: "A Smart Tutor that knows your current topic and explains it your way.", color: T.violet },
          { icon: TrendingUp, title: "Adapts as you grow", desc: "Practice difficulty shifts in real time based on how you're actually doing.", color: T.amber },
          { icon: Trophy, title: "Rewards consistency", desc: "Earn points for real progress and redeem them for things you'll actually use.", color: T.coral },
        ].map((f, i) => (
          <Card key={i} style={{ background: T.surface }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <f.icon size={20} color={f.color} />
            </div>
            <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.55 }}>{f.desc}</div>
          </Card>
        ))}
      </div>

      <div className="fade-up" style={{ maxWidth: 1080, margin: "70px auto 0" }}>
        <Card style={{ background: `linear-gradient(135deg, ${T.surface}, ${T.surface2})`, padding: 32 }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Assess → Personalize → Practice → Improve → Reward</div>
              <div style={{ color: T.dim, fontSize: 14 }}>The loop that keeps students coming back — not another pile of PDFs.</div>
            </div>
            <PrimaryButton onClick={onStart} icon={ArrowRight}>Try the dashboard</PrimaryButton>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   DASHBOARD
------------------------------------------------------------------*/
function Dashboard({ state, setPage, startQuizFor }) {
  const { points, streak, mastery, goalsDone, goalsTotal } = state;
  return (
    <div className="fade-up" style={{ padding: 28, maxWidth: 1100 }}>
      <div style={{ marginBottom: 26 }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Good morning, {STUDENT.name} 👋</h1>
        <p style={{ color: T.dim, margin: "6px 0 0", fontSize: 14.5 }}>Ready to continue your journey?</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 22 }}>
        <StatChip icon={Flame} color={T.coral} label={`${streak} day streak`} />
        <StatChip icon={Star} color={T.amber} label={`${points.toLocaleString()} points`} />
        <StatChip icon={Brain} color={T.teal} label={`${mastery}% overall mastery`} />
        <StatChip icon={Target} color={T.violet} label={`${goalsDone}/${goalsTotal} today's goals`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18, marginBottom: 22 }}>
        <Card style={{ background: `linear-gradient(135deg, ${T.surface}, ${T.surface2})` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2 }}>CONTINUE LEARNING · DATA STRUCTURES</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.faint, fontSize: 13, marginBottom: 14 }}>
                <span>Arrays</span><ChevronRight size={14} /><span>Searching</span><ChevronRight size={14} /><span style={{ color: T.text, fontWeight: 600 }}>Sorting</span><ChevronRight size={14} /><span>Recursion</span>
              </div>
              <Pill color={T.teal}><Zap size={12} /> Next up</Pill>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 700, margin: "10px 0 8px" }}>Binary Search</div>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13, color: T.dim, marginBottom: 20 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} /> 20 min</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><BarChart2 size={14} /> Medium</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Brain size={14} /> 54% mastery</span>
              </div>
              <PrimaryButton icon={ArrowRight} onClick={() => startQuizFor("Binary Search")}>Continue</PrimaryButton>
            </div>
          </div>
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <ProgressRing value={mastery} sub="mastery" color={T.teal} size={110} />
          <div style={{ fontSize: 13, color: T.dim, textAlign: "center" }}>Overall mastery across all subjects</div>
        </Card>
      </div>

      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Picked for you</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 8 }}>
        {RECOMMENDATIONS.map((r) => (
          <Card key={r.id} onClick={() => startQuizFor(r.title)}>
            <Pill color={r.tagColor}><r.icon size={12} /> {r.tag}</Pill>
            <div className="font-display" style={{ fontSize: 16, fontWeight: 700, margin: "12px 0 6px" }}>{r.title}</div>
            <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.5 }}>{r.reason}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "13px 16px" }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={17} color={color} />
      </div>
      <span className="font-body" style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{label}</span>
    </div>
  );
}

/* ---------------------------------------------------------------
   MY SKILLS
------------------------------------------------------------------*/
function MySkills({ subjects, startQuizFor }) {
  const [openSubject, setOpenSubject] = useState(null);
  return (
    <div className="fade-up" style={{ padding: 28, maxWidth: 900 }}>
      <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>My Skills</h1>
      <p style={{ color: T.dim, fontSize: 14, marginBottom: 22 }}>See exactly where you stand, subject by subject.</p>

      <div style={{ display: "grid", gap: 14 }}>
        {subjects.map((s) => (
          <Card key={s.id} onClick={() => setOpenSubject(openSubject === s.id ? null : s.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</span>
              <ChevronRight size={18} style={{ transform: openSubject === s.id ? "rotate(90deg)" : "none", transition: "transform .2s ease", color: T.dim }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <MasteryBar label="" value={s.mastery} />
            </div>
            {openSubject === s.id && s.id === "dsa" && (
              <div className="fade-up" style={{ marginTop: 6, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                {DSA_TOPICS.map((t) => <MasteryBar key={t.id} label={t.name} value={t.mastery} showLevel />)}
                <div style={{ background: T.coralDim, border: `1px solid ${T.coral}44`, borderRadius: 10, padding: 12, fontSize: 13, color: "#f3b7b5", margin: "8px 0 14px" }}>
                  Your biggest opportunity for improvement is <strong style={{ color: T.coral }}>Recursion</strong>.
                </div>
                <PrimaryButton icon={Target} onClick={() => startQuizFor("Recursion")}>Start targeted practice</PrimaryButton>
              </div>
            )}
            {openSubject === s.id && s.id !== "dsa" && (
              <div className="fade-up" style={{ marginTop: 6, paddingTop: 16, borderTop: `1px solid ${T.border}`, fontSize: 13, color: T.dim }}>
                Topic-level breakdown coming as you complete more {s.name} practice.
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ADAPTIVE QUIZ
------------------------------------------------------------------*/
function flattenBank() {
  return QUIZ_BANK;
}

function Quiz({ topic, onFinish, onExit }) {
  const bank = flattenBank();
  const [difficulty, setDifficulty] = useState("medium");
  const [qIndex, setQIndex] = useState(0);
  const [used, setUsed] = useState({ easy: [], medium: [], hard: [] });
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [done, setDone] = useState(false);
  const TOTAL = 5;

  function pickQuestion(diff) {
    const pool = bank[diff].filter((_, i) => !used[diff].includes(i));
    const list = pool.length ? pool : bank[diff];
    const idx = bank[diff].indexOf(list[0]);
    return { question: list[0], idx: idx === -1 ? 0 : idx };
  }

  const [current, setCurrent] = useState(() => pickQuestion("medium"));

  function nextDifficulty(hist) {
    const recent = hist.slice(-3);
    if (!recent.length) return "medium";
    const acc = recent.filter(Boolean).length / recent.length;
    if (acc >= 0.8) return "hard";
    if (acc >= 0.6) return "medium";
    return "easy";
  }

  function submit() {
    if (selected === null) return;
    const isCorrect = selected === current.question.correct;
    setAnswered(true);
    if (isCorrect) setCorrectCount((c) => c + 1);
    const newHist = [...history, isCorrect];
    setHistory(newHist);
    setUsed((u) => ({ ...u, [difficulty]: [...u[difficulty], current.idx] }));
  }

  function goNext() {
    if (qIndex + 1 >= TOTAL) {
      setDone(true);
      return;
    }
    const nd = nextDifficulty(history);
    setDifficulty(nd);
    setCurrent(pickQuestion(nd));
    setQIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  }

  if (done) {
    const accuracy = Math.round((correctCount / TOTAL) * 100);
    const points = correctCount * 20;
    const masteryChange = Math.max(2, Math.round(accuracy / 10));
    return (
      <div className="pop-in" style={{ padding: 28, maxWidth: 560, margin: "0 auto" }}>
        <Card style={{ textAlign: "center", padding: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>🎉</div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Quiz complete</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
            <MiniStat label="Score" value={`${correctCount}/${TOTAL}`} />
            <MiniStat label="Accuracy" value={`${accuracy}%`} />
            <MiniStat label="Mastery change" value={`+${masteryChange}%`} color={T.teal} />
            <MiniStat label="Points earned" value={`+${points}`} color={T.amber} />
          </div>
          <PrimaryButton icon={ArrowRight} onClick={() => onFinish({ points, masteryChange, topic })}>Continue learning</PrimaryButton>
        </Card>
      </div>
    );
  }

  const q = current.question;
  return (
    <div className="fade-up" style={{ padding: 28, maxWidth: 620, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", color: T.dim, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
          <ChevronLeft size={16} /> Exit
        </button>
        <Pill color={difficulty === "hard" ? T.coral : difficulty === "easy" ? T.teal : T.amber}>{difficulty}</Pill>
      </div>
      <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", fontSize: 12.5, color: T.dim }}>
        <span>Question {qIndex + 1} of {TOTAL}</span>
        <span>{topic}</span>
      </div>
      <div style={{ height: 6, background: T.border, borderRadius: 6, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((qIndex) / TOTAL) * 100}%`, background: T.teal, transition: "width .4s ease" }} />
      </div>

      <Card>
        <div className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, lineHeight: 1.4 }}>{q.q}</div>
        <div style={{ display: "grid", gap: 10 }}>
          {q.options.map((opt, i) => {
            let bg = T.surface2, border = T.border, color = T.text;
            if (answered) {
              if (i === q.correct) { bg = T.tealDim; border = T.teal; color = "#c7f7ec"; }
              else if (i === selected) { bg = T.coralDim; border = T.coral; color = "#f6c6c4"; }
            } else if (selected === i) {
              border = T.teal;
            }
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => setSelected(i)}
                style={{
                  textAlign: "left", padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${border}`,
                  background: bg, color, fontSize: 14.5, cursor: answered ? "default" : "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all .15s ease",
                }}
              >
                {opt}
                {answered && i === q.correct && <Check size={16} color={T.teal} />}
                {answered && i === selected && i !== q.correct && <X size={16} color={T.coral} />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="fade-up" style={{ marginTop: 18 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 8,
              color: selected === q.correct ? T.teal : T.coral, fontSize: 14.5,
            }}>
              {selected === q.correct ? <><Check size={16} /> Correct! +20 XP</> : <><X size={16} /> Not quite</>}
            </div>
            <div style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.55, marginBottom: 18 }}>{q.explain}</div>
            <PrimaryButton icon={ArrowRight} onClick={goNext}>{qIndex + 1 >= TOTAL ? "See results" : "Next question"}</PrimaryButton>
          </div>
        )}
        {!answered && (
          <div style={{ marginTop: 20 }}>
            <PrimaryButton disabled={selected === null} onClick={submit}>Submit answer</PrimaryButton>
          </div>
        )}
      </Card>
    </div>
  );
}

function MiniStat({ label, value, color = T.text }) {
  return (
    <div style={{ background: T.surface2, borderRadius: 12, padding: "14px 10px" }}>
      <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11.5, color: T.dim, marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ---------------------------------------------------------------
   VERIFIED LEARNING (Learning Integrity)
------------------------------------------------------------------*/
function VerifiedLearning({ onClose }) {
  const [answer, setAnswer] = useState("");
  const [stage, setStage] = useState("write"); // write -> analyzing -> result -> followup -> verified
  const [score, setScore] = useState(null);

  function analyze() {
    if (!answer.trim()) return;
    setStage("analyzing");
    setTimeout(() => {
      const risky = answer.trim().length < 25;
      setScore(risky ? 58 : 92);
      setStage(risky ? "followup" : "result");
    }, 900);
  }

  return (
    <div className="pop-in" style={{ position: "fixed", inset: 0, background: "rgba(6,9,14,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 28, maxWidth: 460, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <ShieldCheck size={20} color={T.teal} />
          <span className="font-display" style={{ fontSize: 17, fontWeight: 700 }}>Verified Learning</span>
        </div>

        {stage === "write" && (
          <>
            <p style={{ fontSize: 13.5, color: T.dim, marginBottom: 12 }}>Explain binary search in your own words.</p>
            <textarea
              value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4}
              placeholder="Type your explanation..."
              style={{ width: "100%", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, padding: 12, fontSize: 14, resize: "vertical", fontFamily: "inherit" }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <PrimaryButton onClick={analyze}>Submit answer</PrimaryButton>
              <GhostButton onClick={onClose}>Cancel</GhostButton>
            </div>
          </>
        )}

        {stage === "analyzing" && (
          <div style={{ padding: "30px 0", textAlign: "center", color: T.dim, fontSize: 14 }}>Checking originality and understanding…</div>
        )}

        {(stage === "result" || stage === "verified") && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <ProgressRing value={score} color={T.teal} size={100} sub="integrity" />
            </div>
            {[["Resource similarity", "Low"], ["Answer originality", "High"], ["Understanding check", "Passed"], ["Performance consistency", "Consistent"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ color: T.dim }}>{k}</span><span style={{ color: T.teal, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <p style={{ fontSize: 12, color: T.faint, margin: "12px 0 18px" }}>This score estimates learning integrity — it can't perfectly detect AI-generated text.</p>
            <PrimaryButton onClick={onClose}>Done</PrimaryButton>
          </div>
        )}

        {stage === "followup" && (
          <div className="fade-up">
            <div style={{ background: T.amberDim, border: `1px solid ${T.amber}55`, borderRadius: 10, padding: 12, fontSize: 13, color: "#fbdca0", marginBottom: 14 }}>
              We need to verify your understanding. Explain the concept in your own words, in a bit more detail.
            </div>
            <textarea rows={3} placeholder="Add a bit more detail..." style={{ width: "100%", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, padding: 12, fontSize: 14, fontFamily: "inherit" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <PrimaryButton onClick={() => { setScore(88); setStage("verified"); }}>Resubmit</PrimaryButton>
              <GhostButton onClick={onClose}>Cancel</GhostButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SMART TUTOR
------------------------------------------------------------------*/
function SmartTutor({ topic }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: `Hi! I'm your Smart Tutor. I can see you're working on ${topic}. Ask me anything, or tap a suggestion below.` },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send(text) {
    const t = text || input;
    if (!t.trim()) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      const reply = TUTOR_RESPONSES[t] || "Good question — here's the short version: focus on eliminating half the possibilities each step. Want me to walk through an example?";
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    }, 500);
  }

  return (
    <div className="fade-up" style={{ padding: 28, maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.violetDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bot size={19} color={T.violet} />
        </div>
        <div>
          <div className="font-display" style={{ fontSize: 17, fontWeight: 700 }}>Smart Tutor</div>
          <div style={{ fontSize: 12, color: T.dim }}>Currently learning: {topic}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 2px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} className="slide-in" style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%",
            background: m.role === "user" ? T.teal : T.surface2, color: m.role === "user" ? "#052420" : T.text,
            padding: "11px 15px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            fontSize: 14, lineHeight: 1.5, border: m.role === "bot" ? `1px solid ${T.border}` : "none",
          }}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {TUTOR_PROMPTS.map((p) => (
          <button key={p} onClick={() => send(p)} style={{
            background: T.surface2, border: `1px solid ${T.border}`, color: T.dim, borderRadius: 999,
            padding: "7px 13px", fontSize: 12.5, cursor: "pointer",
          }}>{p}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Smart Tutor anything..."
          style={{ flex: 1, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", color: T.text, fontSize: 14, fontFamily: "inherit" }}
        />
        <button onClick={() => send()} style={{ background: T.teal, border: "none", borderRadius: 12, width: 46, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Send size={17} color="#052420" />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PLANNER
------------------------------------------------------------------*/
function Planner({ onCompleteTask }) {
  const [created, setCreated] = useState(false);
  const [form, setForm] = useState({ goal: "GATE Preparation", date: "", hours: "2", subjects: "OS, DSA, Aptitude" });
  const [tasks, setTasks] = useState([
    { id: 1, text: "OS — Process Management", time: "30 min", done: false },
    { id: 2, text: "DSA — Binary Search", time: "25 min", done: false },
    { id: 3, text: "Aptitude — Probability", time: "20 min", done: false },
  ]);

  function toggle(id) {
    setTasks((ts) => ts.map((t) => {
      if (t.id === id && !t.done) { onCompleteTask(); return { ...t, done: true }; }
      return t;
    }));
  }

  if (!created) {
    return (
      <div className="fade-up" style={{ padding: 28, maxWidth: 520 }}>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Smart Study Planner</h1>
        <p style={{ color: T.dim, fontSize: 14, marginBottom: 22 }}>Tell us your goal — we'll build the plan.</p>
        <Card>
          <Field label="Goal">
            <input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Exam / target date">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Available study time per day (hours)">
            <input type="number" min="1" max="10" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Subjects">
            <input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} style={inputStyle} />
          </Field>
          <PrimaryButton icon={Sparkles} onClick={() => setCreated(true)}>Generate my plan</PrimaryButton>
        </Card>
      </div>
    );
  }

  const doneCount = tasks.filter((t) => t.done).length;
  return (
    <div className="fade-up" style={{ padding: 28, maxWidth: 560 }}>
      <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{form.goal} — 30 Days</h1>
      <p style={{ color: T.dim, fontSize: 13.5, marginBottom: 20 }}>Today's plan · {doneCount}/{tasks.length} complete</p>
      <div style={{ display: "grid", gap: 12 }}>
        {tasks.map((t) => (
          <Card key={t.id} onClick={() => toggle(t.id)} style={{ opacity: t.done ? 0.6 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {t.done ? <CheckCircle2 size={22} color={T.teal} /> : <Circle size={22} color={T.faint} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</div>
                <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>{t.time}</div>
              </div>
              {!t.done && <span style={{ fontSize: 12, color: T.teal, fontWeight: 600 }}>Mark complete</span>}
            </div>
          </Card>
        ))}
      </div>
      {doneCount === tasks.length && (
        <div className="pop-in" style={{ marginTop: 18, background: T.tealDim, border: `1px solid ${T.teal}55`, borderRadius: 12, padding: 14, fontSize: 13.5, color: "#c7f7ec" }}>
          All done for today — your streak is safe and points are updated. 🔥
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, color: T.dim, marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = {
  width: "100%", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10,
  padding: "11px 14px", color: T.text, fontSize: 14, fontFamily: "inherit",
};

/* ---------------------------------------------------------------
   REWARDS
------------------------------------------------------------------*/
function Rewards({ points, onRedeem }) {
  const [modal, setModal] = useState(null);

  function handleRedeem(reward) {
    if (points < reward.cost) return;
    onRedeem(reward.cost);
    setModal(reward);
  }

  return (
    <div className="fade-up" style={{ padding: 28, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Rewards</h1>
          <p style={{ color: T.dim, fontSize: 14 }}>Real benefits for real progress.</p>
        </div>
        <Card style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <Star size={18} color={T.amber} />
          <span className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>{points.toLocaleString()}</span>
          <span style={{ fontSize: 12.5, color: T.dim }}>points</span>
        </Card>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T.dim, marginBottom: 8 }}>Badges</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {BADGES.map((b) => (
            <div key={b.id} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 999,
              background: b.earned ? T.amberDim : T.surface2, border: `1px solid ${b.earned ? T.amber + "55" : T.border}`,
              color: b.earned ? "#fbdca0" : T.faint, fontSize: 12.5, fontWeight: 600,
            }}>
              <b.icon size={14} /> {b.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
        {REWARDS.map((r) => {
          const affordable = points >= r.cost;
          return (
            <Card key={r.id}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: T.amberDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <r.icon size={20} color={T.amber} />
              </div>
              <div className="font-display" style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 4 }}>{r.name}</div>
              <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 14 }}>{r.blurb}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: T.amber, fontWeight: 700 }}>{r.cost.toLocaleString()} pts</span>
                <PrimaryButton disabled={!affordable} onClick={() => handleRedeem(r)} style={{ padding: "8px 16px", fontSize: 13 }}>Redeem</PrimaryButton>
              </div>
            </Card>
          );
        })}
      </div>

      {modal && (
        <div className="pop-in" style={{ position: "fixed", inset: 0, background: "rgba(6,9,14,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 32, maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
            <div className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Reward redeemed</div>
            <div style={{ fontSize: 14, color: T.text, marginBottom: 4 }}>{modal.name}</div>
            <div style={{ fontSize: 13, color: T.coral, marginBottom: 4 }}>-{modal.cost.toLocaleString()} points</div>
            <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 20 }}>Remaining: {(points).toLocaleString()} points</div>
            <PrimaryButton onClick={() => setModal(null)}>Nice</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   PROGRESS ANALYTICS
------------------------------------------------------------------*/
function ProgressPage({ subjects }) {
  const maxTime = Math.max(...WEEKLY_TIME);
  return (
    <div className="fade-up" style={{ padding: 28, maxWidth: 900 }}>
      <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Progress</h1>
      <p style={{ color: T.dim, fontSize: 14, marginBottom: 20 }}>You improved 18% this month 🚀</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        <Card>
          <div className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Weekly learning time (min)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {WEEKLY_TIME.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", height: `${(v / maxTime) * 92}px`, background: `linear-gradient(180deg, ${T.teal}, ${T.tealDim})`, borderRadius: 6 }} />
                <span style={{ fontSize: 10.5, color: T.faint }}>{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Accuracy trend</div>
          <svg viewBox="0 0 280 120" width="100%" height="120">
            <polyline
              fill="none" stroke={T.amber} strokeWidth="2.5"
              points={ACCURACY_TREND.map((v, i) => `${(i / (ACCURACY_TREND.length - 1)) * 270 + 5},${115 - (v / 100) * 100}`).join(" ")}
            />
            {ACCURACY_TREND.map((v, i) => (
              <circle key={i} cx={(i / (ACCURACY_TREND.length - 1)) * 270 + 5} cy={115 - (v / 100) * 100} r="3.5" fill={T.amber} />
            ))}
          </svg>
        </Card>
      </div>

      <Card style={{ marginBottom: 18 }}>
        <div className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Topic mastery</div>
        {subjects.map((s) => <MasteryBar key={s.id} label={s.name} value={s.mastery} showLevel />)}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 10, fontWeight: 600 }}>STRONG</div>
          {["SQL", "Arrays"].map((x) => <div key={x} style={{ fontSize: 13.5, padding: "6px 0", color: T.teal }}>● {x}</div>)}
        </Card>
        <Card>
          <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 10, fontWeight: 600 }}>WEAK</div>
          {["Recursion", "Trigonometry"].map((x) => <div key={x} style={{ fontSize: 13.5, padding: "6px 0", color: T.coral }}>● {x}</div>)}
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   LEARN (path overview) - lightweight page
------------------------------------------------------------------*/
function Learn({ startQuizFor }) {
  const path = [
    { name: "Arrays", status: "done" }, { name: "Searching", status: "done" },
    { name: "Sorting", status: "current" }, { name: "Recursion", status: "locked" },
  ];
  return (
    <div className="fade-up" style={{ padding: 28, maxWidth: 640 }}>
      <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Learn</h1>
      <p style={{ color: T.dim, fontSize: 14, marginBottom: 22 }}>Data Structures learning path</p>
      <div style={{ display: "grid", gap: 12 }}>
        {path.map((p, i) => (
          <Card key={p.name} onClick={p.status !== "locked" ? () => startQuizFor(p.name) : undefined} style={{ opacity: p.status === "locked" ? 0.55 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: p.status === "done" ? T.tealDim : p.status === "current" ? T.amberDim : T.surface2,
                color: p.status === "done" ? T.teal : p.status === "current" ? T.amber : T.faint,
              }}>
                {p.status === "done" ? <Check size={17} /> : p.status === "locked" ? <Lock size={15} /> : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: T.dim }}>{p.status === "done" ? "Completed" : p.status === "current" ? "In progress" : "Locked"}</div>
              </div>
              {p.status !== "locked" && <ChevronRight size={18} color={T.dim} />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ROOT APP
------------------------------------------------------------------*/
export default function App() {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [points, setPoints] = useState(1240);
  const [streak, setStreak] = useState(12);
  const [goalsDone, setGoalsDone] = useState(3);
  const goalsTotal = 5;
  const [mastery, setMastery] = useState(68);
  const [quizTopic, setQuizTopic] = useState(null);
  const [showVerified, setShowVerified] = useState(false);
  const [toast, setToast] = useState(null);
  const landingRef = useRef(null);

  function fireToast(text, icon, color) {
    setToast({ text, icon, color });
    setTimeout(() => setToast(null), 2600);
  }

  function startQuizFor(topic) {
    setQuizTopic(topic);
    setPage("practice");
  }

  function handleQuizFinish({ points: earned, masteryChange }) {
    setPoints((p) => p + earned);
    setMastery((m) => Math.min(100, m + Math.round(masteryChange / 3)));
    setSubjects((subs) => subs.map((s) => s.id === "dsa" ? { ...s, mastery: Math.min(100, s.mastery + masteryChange) } : s));
    fireToast(`+${earned} points earned`, Star, T.amber);
    setQuizTopic(null);
    setPage("dashboard");
    setTimeout(() => setShowVerified(true), 700);
  }

  function handleCompleteTask() {
    setPoints((p) => p + 10);
    setGoalsDone((g) => Math.min(goalsTotal, g + 1));
    fireToast("Goal complete — +10 points", CheckCircle2, T.teal);
  }

  function handleRedeem(cost) {
    setPoints((p) => p - cost);
    fireToast("Reward redeemed", Gift, T.amber);
  }

  function extendStreak() {
    setStreak((s) => s + 1);
    fireToast("Streak extended! 🔥", Flame, T.coral);
  }

  if (!started) {
    return (
      <>
        <FontImport />
        <Landing
          onStart={() => setStarted(true)}
          onExplore={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
        />
      </>
    );
  }

  const state = { points, streak, mastery, goalsDone, goalsTotal };

  return (
    <div className="font-body" style={{ display: "flex", background: T.bg, color: T.text, minHeight: "100vh" }}>
      <FontImport />
      <div className="hide-mobile" style={{ display: window.innerWidth < 860 ? "none" : "block" }}>
        <Sidebar page={page} setPage={setPage} />
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingBottom: 70 }}>
        {page === "dashboard" && <Dashboard state={state} setPage={setPage} startQuizFor={startQuizFor} />}
        {page === "learn" && <Learn startQuizFor={startQuizFor} />}
        {page === "skills" && <MySkills subjects={subjects} startQuizFor={startQuizFor} />}
        {page === "practice" && (
          <Quiz
            topic={quizTopic || "Binary Search"}
            onFinish={handleQuizFinish}
            onExit={() => { setQuizTopic(null); setPage("dashboard"); }}
          />
        )}
        {page === "tutor" && <SmartTutor topic={quizTopic || "Binary Search"} />}
        {page === "planner" && <Planner onCompleteTask={handleCompleteTask} />}
        {page === "rewards" && <Rewards points={points} onRedeem={handleRedeem} />}
        {page === "progress" && <ProgressPage subjects={subjects} />}
      </div>

      <div style={{ display: window.innerWidth < 860 ? "block" : "none" }}>
        <BottomNav page={page} setPage={setPage} />
      </div>

      <Toast toast={toast} />
      {showVerified && <VerifiedLearning onClose={() => { setShowVerified(false); extendStreak(); }} />}
    </div>
  );
}
