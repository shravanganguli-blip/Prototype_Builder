import Link from "next/link";
import { BANKS } from "@/lib/banks";
import { USE_CASES } from "@/lib/journeys";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creditas Journey Builder — Sales Demo Prototype Tool",
  description:
    "Build and share interactive bank customer journey prototypes in minutes.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-sm">
            CJ
          </div>
          <span className="font-bold text-lg tracking-tight">
            Creditas Journey Builder
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/library"
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            Library
          </Link>
          <Link
            href="/builder"
            className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-colors"
          >
            + New Prototype
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-4 py-2 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Built for Creditas Sales & Pre-Sales Teams
        </div>
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
          Build Bank Demo Prototypes
          <br />
          <span className="text-indigo-400">in Minutes, Not Days</span>
        </h1>
        <p className="text-white/60 text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
          Select a bank, configure the customer journey, add behavioural nudges,
          and generate a shareable interactive prototype — no designer or
          developer needed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/builder"
            className="px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-base transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            Build a Prototype →
          </Link>
          <Link
            href="/library"
            className="px-8 py-4 rounded-2xl border border-white/20 text-white/80 hover:text-white font-semibold text-base transition-colors"
          >
            Browse Library
          </Link>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
          {[
            { icon: "🏦", step: "1", label: "Pick a Bank", arrow: false },
            { icon: "→", step: "", label: "", arrow: true },
            { icon: "📋", step: "2", label: "Select Use Case", arrow: false },
            { icon: "→", step: "", label: "", arrow: true },
            { icon: "⚡", step: "3", label: "Configure & Generate", arrow: false },
          ].map((item, i) =>
            item.arrow ? (
              <div key={i} className="text-white/20 text-2xl text-center hidden sm:block">
                →
              </div>
            ) : (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
              >
                <span className="text-3xl">{item.icon}</span>
                <p className="text-white/40 text-xs mt-2">Step {item.step}</p>
                <p className="text-white font-semibold text-sm mt-0.5">
                  {item.label}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
          Supported Journey Types
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {USE_CASES.map((uc) => (
            <div
              key={uc.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
            >
              <span className="text-3xl">{uc.icon}</span>
              <p className="font-semibold text-white text-sm mt-3 leading-snug">
                {uc.name}
              </p>
              <p className="text-white/40 text-xs mt-1.5">{uc.screens.length} screens</p>
            </div>
          ))}
        </div>
      </div>

      {/* Banks */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
          {BANKS.length} Banks Pre-loaded
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {BANKS.map((bank) => (
            <div
              key={bank.id}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2"
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: bank.primaryColor }}
              >
                {bank.logoInitials.slice(0, 1)}
              </div>
              <span className="text-white/70 text-sm">{bank.shortName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
          Key Features
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "🎨",
              title: "Bank-branded Theming",
              desc: "Automatic brand colours and identity for all 12 major Indian banks",
            },
            {
              icon: "🧠",
              title: "AI-suggested Offers",
              desc: "Smart defaults for credit limits, rates, and EMIs based on bank tier",
            },
            {
              icon: "⚡",
              title: "Behavioural Nudges",
              desc: "Pre-approved badges, scarcity timers, social proof, savings meters",
            },
            {
              icon: "📱",
              title: "Realistic Phone UI",
              desc: "Mobile-first prototype that looks and feels like a real banking app",
            },
            {
              icon: "🔗",
              title: "Shareable Links",
              desc: "One URL to share with prospects. No login required to view.",
            },
            {
              icon: "📚",
              title: "Searchable Library",
              desc: "All past prototypes saved and searchable by bank, use case, or name",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <span className="text-2xl">{feature.icon}</span>
              <p className="font-semibold text-white text-sm mt-3">
                {feature.title}
              </p>
              <p className="text-white/40 text-xs mt-1.5 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold">Ready to build your first demo?</h2>
        <p className="text-white/50 mt-3 text-base">
          Pick a bank and a use case — your prototype will be ready in under 5 minutes.
        </p>
        <Link
          href="/builder"
          className="inline-block mt-8 px-10 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
        >
          Build Now →
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-8 py-6 text-center text-white/30 text-xs">
        Creditas Journey Builder · Internal Sales Tool · Not for external distribution
      </div>
    </div>
  );
}
