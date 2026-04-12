"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users, UserPlus, CalendarCheck, TrendingUp,
  ChevronRight, MessageSquare, Video, Star,
  ArrowRight, X, CheckCircle2, XCircle,
} from "lucide-react";
import { StatTile } from "./StatTile";
import { PipelineStageBar } from "./PipelineStageBar";
import {
  ALL_APPLICANTS,
  STATUS_CONFIG,
  DEPT_FILTERS,
} from "../constants";
import type { Applicant, DeptFilter } from "../types";
import { ContentPageShell } from "@/shared/layout/ContentPageShell";
import { cn } from "@/lib/utils";

// ─── Candidate Detail Popup ────────────────────────────────────────────────────

function CandidatePopup({
  applicant,
  onClose,
  onAdvance,
  onReject,
}: {
  applicant: Applicant;
  onClose: () => void;
  onAdvance: (id: string, status: Applicant["status"]) => void;
  onReject: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[applicant.status] || STATUS_CONFIG.New;
  const isRejected = applicant.status === "Rejected";
  const d = applicant.details;

  const nextStatus: Record<string, Applicant["status"]> = {
    New: "Screening",
    Screening: "Interview",
    Interview: "Trial",
    Trial: "Hired",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-[600px] max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start gap-4 p-6"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #ff0069, #833ab4)" }}
          >
            {applicant.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-base font-bold text-neutral-900">{applicant.name}</h2>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                style={{
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                }}
              >
                {applicant.status}
              </span>
            </div>
            <p className="text-sm text-neutral-400">
              {applicant.role} · {applicant.dept}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-neutral-300">
              <span>{applicant.country}</span>
              <span>·</span>
              <span>{applicant.email}</span>
              <span>·</span>
              <span>{applicant.telegram}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.04] transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Standout */}
          <div>
            <p
              className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-3 flex items-center gap-2"
              style={{ color: "#ff0069" }}
            >
              <Star size={11} style={{ color: "#ff0069" }} /> Key Standout
            </p>
            <div
              className="px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,0,105,0.05)",
                border: "1px solid rgba(255,0,105,0.15)",
              }}
            >
              <p className="text-sm text-neutral-700 leading-snug">{applicant.standout}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {d.qualityRating && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Quality", val: d.qualityRating },
                  { label: "Speed", val: d.speedRating ?? "—" },
                  { label: "Creative", val: d.creativityRating ?? "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl p-3 text-center"
                    style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
                  >
                    <div className="text-lg font-black text-neutral-900">{item.val}/5</div>
                    <div className="text-[10px] text-neutral-400">{item.label}</div>
                  </div>
                ))}
              </div>
            )}
            {d.typingSpeed && (
              <div className="grid grid-cols-2 gap-2">
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
                >
                  <div className="text-sm font-bold text-neutral-900">{d.typingSpeed}</div>
                  <div className="text-[10px] text-neutral-400">Typing</div>
                </div>
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
                >
                  <div className="text-sm font-bold text-neutral-900">{d.englishLevel}/10</div>
                  <div className="text-[10px] text-neutral-400">English</div>
                </div>
              </div>
            )}
            {(d.platforms || d.software) && (
              <div className="space-y-2">
                {d.platforms && (
                  <div>
                    <p className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Platforms
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {d.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{
                            background: "rgba(131,58,180,0.08)",
                            border: "1px solid rgba(131,58,180,0.2)",
                            color: "#7c3aed",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {d.software && (
                  <div>
                    <p className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Software
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {d.software.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{
                            background: "rgba(0,0,0,0.04)",
                            border: "1px solid rgba(0,0,0,0.07)",
                            color: "#374151",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {d.contentTypes && (
                  <div>
                    <p className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Content Types
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {d.contentTypes.map((c) => (
                        <span
                          key={c}
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{
                            background: "rgba(0,0,0,0.04)",
                            border: "1px solid rgba(0,0,0,0.07)",
                            color: "#374151",
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interview date */}
          {applicant.interviewDate && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
            >
              <CalendarCheck size={14} className="text-neutral-400" />
              <span className="text-sm text-neutral-700">
                Interview scheduled:{" "}
                <span className="font-semibold">{applicant.interviewDate}</span>
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isRejected && (
          <div
            className="flex items-center justify-end gap-3 px-6 py-4"
            style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          >
            <button
              onClick={() => onReject(applicant.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
                background: "rgba(239,68,68,0.04)",
              }}
            >
              <XCircle size={13} /> Reject
            </button>
            <button
              onClick={() => {
                const next = nextStatus[applicant.status];
                if (next) onAdvance(applicant.id, next);
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:brightness-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #ff0069, #833ab4)" }}
            >
              <CheckCircle2 size={13} />{" "}
              {applicant.status === "New"
                ? "Move to Screening"
                : applicant.status === "Hired"
                ? "Hired"
                : "Advance Stage"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Recent Applicant Row ────────────────────────────────────────────────────────

function ApplicantRow({
  applicant,
  onClick,
  index,
}: {
  applicant: Applicant;
  onClick: () => void;
  index: number;
}) {
  const cfg = STATUS_CONFIG[applicant.status] || STATUS_CONFIG.New;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-4 px-5 py-4 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors cursor-pointer group"
      whileHover={{ x: 3, transition: { duration: 0.15 } }}
      onClick={onClick}
      style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #ff0069, #833ab4)" }}
      >
        {applicant.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-neutral-900 truncate">{applicant.name}</span>
          <div
            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
            style={{
              background:
                applicant.dept === "Sales"
                  ? "rgba(131,58,180,0.1)"
                  : "rgba(255,0,105,0.1)",
            }}
          >
            {applicant.dept === "Sales" ? (
              <MessageSquare size={10} style={{ color: "#833ab4" }} />
            ) : (
              <Video size={10} style={{ color: "#ff0069" }} />
            )}
          </div>
        </div>
        <div className="text-xs text-neutral-400">
          {applicant.role} · {applicant.dept}
        </div>
      </div>

      {/* Standout preview */}
      <div className="hidden xl:flex items-center gap-1.5 max-w-[200px]">
        <Star size={10} style={{ color: "#ff0069", opacity: 0.5 }} className="flex-shrink-0" />
        <p className="text-[11px] text-neutral-300 truncate">{applicant.standout}</p>
      </div>

      <div className="text-right hidden sm:block flex-shrink-0">
        <div className="text-xs text-neutral-300">{applicant.appliedDays}</div>
      </div>
      <span
        className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
        style={{
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
        }}
      >
        {applicant.status}
      </span>
      <ChevronRight
        size={14}
        className="text-neutral-200 group-hover:text-neutral-500 transition-colors flex-shrink-0"
      />
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function RecruitmentHub() {
  const [deptTab, setDeptTab] = useState<DeptFilter>("All");
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>(ALL_APPLICANTS);

  const filtered = applicants.filter((a) => {
    if (deptTab === "All") return true;
    if (deptTab === "Chatters") return a.role === "Chatter";
    if (deptTab === "Social VAs") return a.role === "Social VA";
    if (deptTab === "Managers") return a.role === "Manager";
    return true;
  });

  const totalCount = applicants.length;
  const pendingCount = applicants.filter(
    (a) => a.status === "New" || a.status === "Screening"
  ).length;
  const interviewCount = applicants.filter((a) => a.status === "Interview").length;
  const hiredCount = applicants.filter((a) => a.status === "Hired").length;

  const statColor = "#ff0069";

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 pb-0">
        <StatTile
          label="Open Positions"
          value={3}
          sub="Chatter / Social VA / Manager"
          icon={<Users size={16} />}
          color={statColor}
          delay={0}
        />
        <StatTile
          label="Total Applicants"
          value={totalCount}
          sub={`${pendingCount} pending review`}
          icon={<TrendingUp size={16} />}
          color="#8b5cf6"
          delay={0.06}
        />
        <StatTile
          label="Interviews Scheduled"
          value={interviewCount}
          sub="2 this week"
          icon={<CalendarCheck size={16} />}
          color="#f59e0b"
          delay={0.12}
        />
        <StatTile
          label="Hired This Month"
          value={hiredCount}
          sub="2 chatters, 0 social VAs"
          icon={<CheckCircle2 size={16} />}
          color="#22c55e"
          delay={0.18}
        />
      </div>

      {/* Dept filter pills */}
      <div className="px-6 pt-5 pb-3">
        <div
          className="inline-flex items-center gap-1 p-1 rounded-xl w-fit"
          style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)" }}
        >
          {DEPT_FILTERS.map((tab) => (
            <button
              key={tab}
              onClick={() => setDeptTab(tab)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                background:
                  deptTab === tab ? "linear-gradient(135deg, #ff0069, #833ab4)" : "transparent",
                color: deptTab === tab ? "white" : "#6b7280",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline bar */}
      <div className="px-6 pb-5">
        <div
          className="rounded-2xl p-5"
          style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#ffffff" }}
        >
          <h2 className="text-sm font-bold text-neutral-900 mb-4">Application Pipeline</h2>
          <PipelineStageBar />
        </div>
      </div>

      {/* Recent applicants list */}
      <div
        className="flex-1 mx-6 mb-6 rounded-2xl overflow-hidden min-h-0"
        style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#ffffff" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
        >
          <h2 className="text-sm font-bold text-neutral-900">Recent Applicants</h2>
          <Link
            href="/agency/recruitment/applicants"
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: "#ff0069" }}
          >
            View all <ArrowRight size={10} />
          </Link>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 560px)", minHeight: "200px" }}
        >
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(255,0,105,0.08)" }}
              >
                <UserPlus size={20} style={{ color: "#ff0069" }} />
              </div>
              <p className="text-sm text-neutral-400">No applicants in this department</p>
            </div>
          )}
          {filtered.map((applicant, i) => (
            <ApplicantRow
              key={applicant.id}
              applicant={applicant}
              index={i}
              onClick={() => setSelected(applicant)}
            />
          ))}
        </div>
      </div>

      {/* Candidate popup */}
      <AnimatePresence>
        {selected && (
          <CandidatePopup
            applicant={selected}
            onClose={() => setSelected(null)}
            onAdvance={(id, status) => {
              setApplicants((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status } : a))
              );
              setSelected(null);
            }}
            onReject={(id) => {
              setApplicants((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status: "Rejected" as const } : a))
              );
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
