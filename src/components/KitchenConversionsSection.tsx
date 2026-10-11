import React, { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, Droplets, Wheat, Flame, Sparkles } from 'lucide-react';

export const KitchenConversionsSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const categories = [
    {
      title: 'Spoons, Cups & Liquids',
      tamilSubtitle: 'கரண்டி & திரவ அளவுகள்',
      icon: Droplets,
      items: [
        { name: '1 Teaspoon (tsp)', value: '5 ml' },
        { name: '1 Tablespoon (tbsp)', value: '15 ml (3 tsp)' },
        { name: '1 Standard Cup', value: '240 ml (16 tbsp)' },
        { name: '1 South Indian Dabarah Tumbler', value: '~150 – 180 ml' },
        { name: '1 Traditional Padi (படி)', value: '~1.5 Litres' },
        { name: '1 Traditional Aazhakku (ஆழாக்கு)', value: '~168 ml' },
      ],
    },
    {
      title: '1 Cup Staples to Grams',
      tamilSubtitle: 'தானியங்கள் & மாவுகளின் எடை',
      icon: Wheat,
      items: [
        { name: '1 Cup Raw Ponni / Basmati Rice', value: '~200 g' },
        { name: '1 Cup Toor Dal / Moong Dal', value: '~210 g' },
        { name: '1 Cup Wheat Atta / Maida', value: '~125 g' },
        { name: '1 Cup Grated Jaggery (Vellam)', value: '~180 g' },
        { name: '1 Cup Fresh Grated Coconut', value: '~80 g' },
        { name: '1 Cup Crystal Himalayan Salt', value: '~220 g' },
      ],
    },
    {
      title: 'Ghee, Oils & Pinches',
      tamilSubtitle: 'நெய், எண்ணெய் & சிட்டிகை',
      icon: Flame,
      items: [
        { name: '1 tbsp Desi Cow Ghee (Ney)', value: '~14 g (15 ml)' },
        { name: '1 Cup Molten Ghee / Butter', value: '~220 g' },
        { name: '1 Pinch (Chitikai / சிட்டிகை)', value: '~0.3 g (⅛ tsp)' },
        { name: 'Lemon-sized Tamarind (Puli)', value: '~25 – 30 g' },
        { name: 'Tamarind Extract (Thick)', value: '~60 ml (4 tbsp)' },
        { name: '1 tbsp Cold-Pressed Gingelly Oil', value: '~14 g' },
      ],
    },
    {
      title: 'Whole Spices & Herbs',
      tamilSubtitle: 'தாளிப்பு மசாலா அளவுகள்',
      icon: Sparkles,
      items: [
        { name: '1 tsp Mustard / Cumin / Jeera', value: '~3 g' },
        { name: '1 tsp Whole Black Peppercorns', value: '~3.5 g' },
        { name: '1 Sprig Curry Leaves (கருவேப்பிலை)', value: '~8 – 10 leaves (~1 g)' },
        { name: '1 Whole Green Cardamom (Elaichi)', value: '~0.2 g (seeds ~0.1 g)' },
        { name: '1 Star Anise (Natchathira Sombu)', value: '~1.5 g' },
        { name: 'Small Piece Kalpasi (Stone Flower)', value: '~0.5 g' },
      ],
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
          <div className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-[var(--card-bg)] text-[var(--accent)] shadow-xs group-hover:scale-105 transition-transform">
            <Scale className="h-4 w-4 lg:h-5 lg:w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[var(--text)] sm:text-base lg:text-lg group-hover:text-[var(--accent)] transition-colors">
                Kitchen Measurement Conversions &amp; Standards
              </h2>
              <span className="hidden rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] lg:text-xs font-bold text-[var(--accent)] sm:inline-block">
                ml, tbsp &amp; Indian Measures
              </span>
            </div>
            <p className="text-xs lg:text-sm text-[var(--muted)]">
              Quick conversion rules for tablespoons, milliliters, cups and traditional Tamil measures
            </p>
          </div>
        </div>

        <div className="glow-btn flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs lg:text-sm font-bold text-[var(--text)]">
          <span>{isExpanded ? 'Hide Conversions' : 'View Conversions'}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-200">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="glow-card rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3.5 lg:p-4 transition-all"
              >
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
                  <h3 className="text-sm lg:text-base font-bold text-[var(--text)]">
                    {cat.title}
                  </h3>
                </div>
                <p className="mt-0.5 font-serif text-[11px] lg:text-xs text-[var(--muted)] opacity-85">
                  {cat.tamilSubtitle}
                </p>

                <div className="mt-3 divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
                  {cat.items.map((it, iIdx) => (
                    <div
                      key={iIdx}
                      className="flex items-baseline justify-between py-1.5 text-xs lg:text-sm"
                    >
                      <span className="text-[var(--text-secondary)] font-medium pr-2">
                        {it.name}
                      </span>
                      <span className="font-mono font-bold text-[var(--accent)] shrink-0">
                        {it.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
