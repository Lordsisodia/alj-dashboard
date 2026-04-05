"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Star, MessageSquareHeart } from "lucide-react";
import { FeedbackSchema, type FeedbackPayload } from "../../domain/feedback.schema";

export function ProvideFeedbackView() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: FeedbackPayload = { email, topic, message };
    const result = FeedbackSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitted");
    setTimeout(() => setStatus("idle"), 3000);
    setEmail("");
    setTopic("");
    setMessage("");
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 rounded-[32px] border border-white/10 bg-black/70 px-6 py-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Feedback</p>
        <h1 className="text-3xl font-semibold">Tell us what makes the partner app faster</h1>
        <p className="text-sm text-white/70">Drop bugs, wishlist items, or wins. Product and performance engineering read every submission.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <SettingsGroupCallout
          icon={<Star className="h-4 w-4" />}
          title="Shoutouts"
          subtitle="Highlight a flow or teammate that unlocked speed."
          showChevron={false}
        >
          <p className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
            \"Academy streaming cut our load time to 1.1s.\" — Harper
          </p>
        </SettingsGroupCallout>
        <SettingsGroupCallout
          icon={<MessageSquareHeart className="h-4 w-4" />}
          title="Requests"
          subtitle="Need a new widget, faster route, or better metrics?"
          showChevron={false}
        >
          <p className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
            Tip: Add screenshots/GIFs so we can reproduce issues instantly.
          </p>
        </SettingsGroupCallout>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4" data-testid="feedback-form">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm text-white/70">
            <span className="block text-xs uppercase tracking-[0.35em] text-white/50">Email</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@siso.run"
              required
              className="bg-white/5 text-white placeholder:text-white/30"
            />
            {errors.email && <span className="text-xs text-amber-300">{errors.email}</span>}
          </label>
          <label className="space-y-1 text-sm text-white/70">
            <span className="block text-xs uppercase tracking-[0.35em] text-white/50">Topic</span>
            <Input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Wallet latency, Academy UX…"
              required
              className="bg-white/5 text-white placeholder:text-white/30"
            />
            {errors.topic && <span className="text-xs text-amber-300">{errors.topic}</span>}
          </label>
        </div>
        <label className="space-y-1 text-sm text-white/70">
          <span className="block text-xs uppercase tracking-[0.35em] text-white/50">Notes</span>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            placeholder="What should we improve or double-down on?"
            required
            className="bg-white/5 text-white placeholder:text-white/30"
          />
          {errors.message && <span className="text-xs text-amber-300">{errors.message}</span>}
        </label>
        <Button
          type="submit"
          disabled={status === "submitted"}
          className="w-full rounded-full border border-siso-orange/50 bg-siso-orange/20 text-[11px] font-semibold uppercase tracking-[0.4em] text-white hover:bg-siso-orange/30"
        >
          {status === "submitted" ? "Sent" : "Send feedback"}
        </Button>
      </form>
    </div>
  );
}
