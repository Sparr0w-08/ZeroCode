import React, { useState } from 'react';
import { Sparkles, Flame, Droplets, Clock, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

export const ChefTipsSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const tips = [
    {
      icon: Droplets,
      title: 'Seeraga Samba Rice Water Physics',
      tamilSubtitle: 'சீரக சம்பா அரிசி நீர் விகிதம்',
      description:
        'When cooking Thalappakatti biryani for 8+ guests, decrease water ratio from 1:2 to 1:1.75. The denser trapped steam in large vessels cooks delicate grains without breaking or getting mushy.',
    },
    {
      icon: Flame,
      title: 'Tamarind (Puli) Boiling Dynamics',
      tamilSubtitle: 'புளி கரைசல் கொதிக்கும் அளவு',
      description:
        'Tamarind tartness concentrates faster when boiled in large volumes. Scale tamarind extract to 80% initially in Sambar or Vatha Kuzhambu, then simmer and adjust before the final tadka.',
    },
    {
      icon: Sparkles,
      title: 'Fresh Taalippu (Tempering) Finish',
      tamilSubtitle: 'இறுதி நெய் தாளிப்பு ரகசியம்',
      description:
        'For large family gatherings, split the ghee tempering: use half during the initial base sauté, and finish with a fresh 1-minute mustard, curry leaves, and asafoetida (perungayam) pop right before serving.',
    },
    {
      icon: ShieldAlert,
      title: 'Non-Linear Salt & Chili Curve',
      tamilSubtitle: 'உப்பு காரம் அளவிடுதல்',
      description:
        'Never scale salt and red chili powder 1:1 when scaling beyond 3x. Human taste perception of saltiness increases non-linearly in deep pots. Apply the 75% dampening rule, then taste test.',
    },
    {
      icon: Clock,
      title: 'Jaggery Syrup Clarification',
      tamilSubtitle: 'பாகு வெல்லம் கரைத்தல்',
      description:
        'In Madurai Sakkarai Pongal or Payasam, melt jaggery with 3 tbsp water into a molten syrup first and strain through a fine mesh. This removes impurities and ensures homogeneous sweetness without curdling.',
    },
  ];

  return (
    <section className="glow-section no-print rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-sm transition-all sm:p-5">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left focus:outline-none group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--card-bg)] text-[var(--accent)] shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[var(--text)] sm:text-base group-hover:text-[var(--accent)] transition-colors">
                Tamil Nadu &amp; Indian Culinary Scaling Secrets
              </h2>
              <span className="hidden rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-[var(--accent)] sm:inline-block">
                5 Pro Secrets
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Catering rules for rice ratios, tamarind concentration &amp; tadka finishing
            </p>
          </div>
        </div>

        <div className="glow-btn flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1 text-xs font-bold text-[var(--text)]">
          <span>{isExpanded ? 'Hide Secrets' : 'View Secrets'}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-200">
          {tips.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="glow-card rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3.5 transition-all"
              >
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[var(--text)]">
                    {t.title}
                  </h3>
                </div>
                <p className="mt-0.5 font-serif text-xs lg:text-sm text-[var(--muted)] opacity-85">
                  {t.tamilSubtitle}
                </p>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  {t.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
