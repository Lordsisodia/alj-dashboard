"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRight,
  Video,
  UserPlus,
  CalendarCheck,
  ExternalLink,
} from "lucide-react";
import { ALL_APPLICANTS, STATUS_CONFIG, STATUS_FILTERS } from "../constants";
import type { Applicant } from "../types";
import { ContentPageShell } from "@/shared/layout/ContentPageShell";
import { cn } from "@/lib/utils";

// ─── Status Badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Applicant["status"] }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.New;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {status}
    </span>
  );
}

// ─── Expanded Row ───────────────────────────────────────────────────────────────

function ExpandedRow({
  applicant,
  onAdvance,
  onReject,
}: {
  applicant: Applicant;
  onAdvance: (id: string, status: Applicant["status"]) => void;
  onReject: (id: string) => void;
}) {
  const d = applicant.details;
  const nextStatus: Partial<Record<Applicant["status"], Applicant["status"]>> = {
    New: "Screening",
    Screening: "Interview",
    Interview: "Trial",
    Trial: "Hired",
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      <div
        className="px-8 py-5"
        style={{ background: "rgba(0,0,0,0.02)", borderTop: "1px solid rgba(0,0,0,0.05)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: contact + details */}
          <div className="flex flex-col gap-4">
            <div>
              <div
                className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-2"
              >
                Contact
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm text-neutral-600">
                  <span className="text-neutral-400">Email:</span> {applicant.email}
                </div>
                <div className="text-sm text-neutral-600">
                  <span className="text-neutral-400">Telegram:</span> {applicant.telegram}
                </div>
                <div className="text-sm text-neutral-600">
                  <span className="text-neutral-400">Country:</span> {applicant.country}
                </div>
              </div>
            </div>

            {d.portfolio && (
              <div>
                <div
                  className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-1"
                >
                  Portfolio
                </div>
                <a
                  href={d.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-1 hover:underline"
                  style={{ color: "#ff0069" }}
                >
                  {d.portfolio} <ExternalLink size={11} />
                </a>
              </div>
            )}

            {d.software && (
              <div>
                <div
                  className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-2"
                >
                  Software
                </div>
                <div className="flex flex-wrap gap-1.5">
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
                <div
                  className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-2"
                >
                  Content Types
                </div>
                <div className="flex flex-wrap gap-1.5">
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

            {d.platforms && (
              <div>
                <div
                  className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-2"
                >
                  Platforms
                </div>
                <div className="flex flex-wrap gap-1.5">
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
          </div>

          {/* Right: skills + availability + actions */}
          <div className="flex flex-col gap-4">
            {d.qualityRating && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Quality", val: d.qualityRating },
                  { label: "Speed", val: d.speedRating ?? "—" },
                  { label: "Creativity", val: d.creativityRating ?? "—" },
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
              <div className="flex gap-4">
                <div
                  className="rounded-xl p-3 flex-1 text-center"
                  style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
                >
                  <div className="text-sm font-bold text-neutral-900">{d.typingSpeed}</div>
                  <div className="text-[10px] text-neutral-400">Typing Speed</div>
                </div>
                <div
                  className="rounded-xl p-3 flex-1 text-center"
                  style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
                >
                  <div className="text-sm font-bold text-neutral-900">{d.englishLevel}/10</div>
                  <div className="text-[10px] text-neutral-400">English</div>
                </div>
              </div>
            )}

            {(d.hoursPerDay || d.hoursPerWeek) && (
              <div
                className="rounded-xl p-3"
                style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
              >
                <div className="text-[10px] text-neutral-400 mb-1">Availability</div>
                <div className="text-sm font-semibold text-neutral-900">
                  {d.hoursPerDay ?? d.hoursPerWeek} {d.shiftPref ? `/ ${d.shiftPref}` : "hrs/week"}
                </div>
              </div>
            )}

            {applicant.interviewDate && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
              >
                <CalendarCheck size={14} className="text-neutral-400" />
                <span className="text-sm text-neutral-700">
                  Interview: <span className="font-semibold">{applicant.interviewDate}</span>
                </span>
              </div>
            )}

            {/* Actions */}
            <div
              className="flex flex-wrap gap-2 pt-2"
              style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
            >
              {applicant.status === "New" || applicant.status === "Screening" ? (
                <>
                  <button
                    onClick={() => onAdvance(applicant.id, "Screening")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#22c55e",
                      background: "rgba(34,197,94,0.04)",
                    }}
                  >
                    <ArrowRight size={11} /> Move to Screening
                  </button>
                  <button
                    onClick={() => onReject(applicant.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#ef4444",
                      background: "rgba(239,68,68,0.04)",
                    }}
                  >
                    <XCircle size={11} /> Reject
                  </button>
                </>
              ) : applicant.status === "Interview" ? (
                <button
                  onClick={() => onAdvance(applicant.id, "Trial")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "#22c55e",
                    background: "rgba(34,197,94,0.04)",
                  }}
                >
                  <ArrowRight size={11} /> Move to Trial
                </button>
              ) : applicant.status === "Trial" ? (
                <button
                  onClick={() => onAdvance(applicant.id, "Hired")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                >
                  <CheckCircle2 size={11} /> Mark as Hired
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function ApplicantsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>(ALL_APPLICANTS);

  const filtered = applicants.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: Applicant["status"]) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const statuses = STATUS_FILTERS as unknown as string[];

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0 px-6 pb-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)" }}
          >
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                style={{
                  background:
                    statusFilter === s
                      ? s === "All"
                        ? "linear-gradient(135deg, #ff0069, #833ab4)"
                        : STATUS_CONFIG[s as Applicant["status"]]?.bg || "transparent"
                      : "transparent",
                  color: statusFilter === s ? "white" : "#6b7280",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="flex-1 rounded-2xl overflow-hidden min-h-0"
        style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#ffffff" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3"
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          {["", "Applicant", "Department", "Applied", "Status", ""].map((h) => (
            <div
              key={h}
              className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(255,0,105,0.08)" }}
              >
                <UserPlus size={20} style={{ color: "#ff0069" }} />
              </div>
              <p className="text-sm text-neutral-400 font-medium">No applicants found</p>
              <p className="text-xs text-neutral-300 mt-1">Try adjusting your filters</p>
            </div>
          )}
          {filtered.map((applicant) => {
            const isExpanded = expanded === applicant.id;
            return (
              <div key={applicant.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                {/* Row */}
                <div
                  className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-black/[0.02] transition-colors cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : applicant.id)}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #ff0069, #833ab4)",
                      color: "white",
                    }}
                  >
                    {applicant.avatar}
                  </div>

                  {/* Name + role */}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-neutral-900 truncate">
                      {applicant.name}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">{applicant.role}</div>
                  </div>

                  {/* Dept */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center"
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
                    <span className="text-xs text-neutral-500">{applicant.dept}</span>
                  </div>

                  {/* Applied */}
                  <div className="text-xs text-neutral-300">{applicant.appliedDays}</div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <StatusBadge status={applicant.status} />
                    {isExpanded ? (
                      <ChevronUp size={14} className="text-neutral-300" />
                    ) : (
                      <ChevronDown size={14} className="text-neutral-300" />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <ExpandedRow
                      applicant={applicant}
                      onAdvance={(id, status) => {
                        updateStatus(id, status);
                        setExpanded(null);
                      }}
                      onReject={(id) => {
                        updateStatus(id, "Rejected");
                        setExpanded(null);
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
