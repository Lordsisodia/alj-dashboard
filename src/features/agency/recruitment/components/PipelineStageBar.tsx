"use client";

import { motion } from "framer-motion";
import { ALL_APPLICANTS, PIPELINE_STAGES } from "../constants";
import type { Applicant } from "../types";

interface PipelineStageBarProps {
  filter?: Applicant["status"] | "All";
}

export function PipelineStageBar({ filter = "All" }: PipelineStageBarProps) {
  const stages: Record<string, number> = {
    Applied: 0,
    Screen: 0,
    Interview: 0,
    Trial: 0,
    Hired: 0,
  };

  ALL_APPLICANTS.forEach((a) => {
    if (a.status === "New") stages.Applied++;
    else if (a.status === "Screening") stages.Screen++;
    else if (a.status === "Interview") stages.Interview++;
    else if (a.status === "Trial") stages.Trial++;
    else if (a.status === "Hired") stages.Hired++;
  });

  const total = ALL_APPLICANTS.length;
  const segments = PIPELINE_STAGES.map((s) => ({
    ...s,
    count: stages[s.id === "Screen" ? "Screen" : s.id] ?? 0,
    pct: total > 0 ? ((stages[s.id === "Screen" ? "Screen" : s.id] ?? 0) / total) * 100 : 0,
  }));

  return (
    <div className="flex items-center gap-3">
      {segments.map((seg, i) => (
        <div key={seg.id} className="flex-1 flex flex-col items-center gap-1.5">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-full h-2 overflow-hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: seg.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(seg.pct, seg.count > 0 ? 20 : 0)}%` }}
              transition={{ delay: i * 0.06 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
          <div className="text-2xl font-black" style={{ color: seg.color }}>
            {seg.count}
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">{seg.label}</span>
        </div>
      ))}
    </div>
  );
}
