import Link from "next/link";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";

interface PolicyParagraph {
  type: "text" | "list" | "highlight";
  content: string[];
}

interface PolicySection {
  id: string;
  title: string;
  paragraphs: PolicyParagraph[];
}

const policySections: PolicySection[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      {
        type: "text",
        content: [
          "We collect only the information required to run the partner program, process referrals, and keep you informed.",
          "By using the platform you agree to the practices outlined below."
        ],
      },
    ],
  },
  {
    id: "information",
    title: "Information We Collect",
    paragraphs: [
      {
        type: "list",
        content: [
          "Contact details, company information, and professional history",
          "Usage metrics such as referral volume, payouts, and device/browser metadata",
          "Compliance documents and payment preferences when required to release earnings"
        ],
      },
    ],
  },
  {
    id: "usage",
    title: "How We Use Information",
    paragraphs: [
      {
        type: "list",
        content: [
          "Operate the partner dashboard and surface program insights",
          "Send operational messages (payout alerts, compliance nudges, support responses)",
          "Improve the product via aggregated analytics",
          "Satisfy legal, accounting, and anti-fraud obligations"
        ],
      },
    ],
  },
  {
    id: "sharing",
    title: "Information Sharing",
    paragraphs: [
      {
        type: "text",
        content: [
          "We do not sell or rent your personal information. Limited sharing occurs only when it is required to operate the program or comply with law."
        ],
      },
      {
        type: "list",
        content: [
          "Service providers who help run payouts, analytics, or support",
          "Other partners when collaboration is necessary and you opt in",
          "Regulators or authorities when mandated"
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    paragraphs: [
      {
        type: "text",
        content: [
          "Cookies keep you signed in, remember preferences, and power analytics. Essential cookies cannot be disabled; analytics and preference cookies are optional and can be turned off in Settings → Privacy."
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      {
        type: "list",
        content: [
          "TLS encryption protects data in transit",
          "Encrypted storage and role-based access limit who can view payout information",
          "Regular vulnerability assessments and incident response drills"
        ],
      },
      {
        type: "text",
        content: [
          "No system is 100% immune to risk, but we continuously monitor the perimeter and notify you of any material incident."
        ],
      },
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    paragraphs: [
      {
        type: "text",
        content: [
          "Partners may request access, correction, export, or deletion of personal data. Use the controls in Settings → Privacy or reach our privacy team at privacy@siso.so."
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      {
        type: "text",
        content: [
          "Email privacy@siso.so, call +1 (415) 555‑0199, or mail data requests to SISO Partnerships, 560 Market St, San Francisco, CA."
        ],
      },
    ],
  },
];

export function PrivacyPolicyContent() {
  return (
    <main className="relative min-h-screen bg-siso-bg-primary px-4 pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-8 text-siso-text-primary">
      <TierProgressBackdrop />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 lg:flex-row lg:px-2">
        <nav className="lg:w-64">
          <h1 className="text-sm font-semibold uppercase tracking-[0.35em] text-siso-text-muted">Privacy Policy</h1>
          <p className="mt-2 text-xs text-siso-text-muted">Version 2.1 • Updated Nov 1, 2024</p>
          <ul className="mt-6 space-y-2 text-sm">
            {policySections.map((section) => (
              <li key={section.id}>
                <Link href={`#${section.id}`} className="text-siso-text-muted transition hover:text-white">
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="flex-1 space-y-8 rounded-3xl border border-siso-border bg-siso-bg-secondary/60 p-6 text-sm leading-relaxed text-siso-text-muted">
          {policySections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4">
              <h2 className="text-base font-semibold text-white">{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => {
                if (paragraph.type === "list") {
                  return (
                    <ul key={index} className="space-y-1 pl-5 text-siso-text-muted list-disc">
                      {paragraph.content.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-siso-text-muted">
                    {paragraph.content.join(" ")}
                  </p>
                );
              })}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

export default PrivacyPolicyContent;
