import { ScaledIngredient } from '../types';
import { roundToTwo } from './math';

export type PngThemeOption = 'theme' | 'dark' | 'light' | 'eco';

interface PngRenderParams {
  dishName: string;
  region: string;
  originalServings: number;
  targetServings: number;
  ingredients: ScaledIngredient[];
  chefInsight?: string;
  themeMode: 'dark' | 'light' | 'eco';
}

export function renderRecipeToCanvas({
  dishName,
  region,
  originalServings,
  targetServings,
  ingredients,
  chefInsight,
  themeMode,
}: PngRenderParams): HTMLCanvasElement | null {
  const scaleRatio = 2; // High-DPI 2x for sharp retina rendering
  const width = 840;

  // Dynamic height calculation
  const headerHeight = 170;
  const ingredientItemHeight = 76;
  const ingredientsTotalHeight = ingredients.length * ingredientItemHeight + 40;
  const insightHeight = chefInsight ? 110 : 0;
  const footerHeight = 60;
  const totalHeight = headerHeight + ingredientsTotalHeight + insightHeight + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width * scaleRatio;
  canvas.height = totalHeight * scaleRatio;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scaleRatio, scaleRatio);

  // Theme definition
  let colors: {
    bg: string;
    surface: string;
    cardBg: string;
    border: string;
    borderCard: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentGlow: string;
    badgeBg: string;
    badgeText: string;
    formulaBg: string;
    watermark: string;
  };

  if (themeMode === 'dark') {
    colors = {
      bg: '#140E0B',
      surface: '#1E1510',
      cardBg: '#281D15',
      border: 'rgba(245, 158, 11, 0.4)',
      borderCard: 'rgba(245, 158, 11, 0.22)',
      textPrimary: '#FEF3C7',
      textSecondary: '#E7E5E4',
      textMuted: '#A8A29E',
      accent: '#F59E0B',
      accentGlow: 'rgba(245, 158, 11, 0.18)',
      badgeBg: '#382212',
      badgeText: '#FDE68A',
      formulaBg: '#1A120D',
      watermark: '#78716C',
    };
  } else if (themeMode === 'eco') {
    colors = {
      bg: '#FFFFFF',
      surface: '#FFFFFF',
      cardBg: '#F9FAFB',
      border: '#D1D5DB',
      borderCard: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#374151',
      textMuted: '#6B7280',
      accent: '#1F2937',
      accentGlow: 'rgba(0, 0, 0, 0.05)',
      badgeBg: '#F3F4F6',
      badgeText: '#111827',
      formulaBg: '#F3F4F6',
      watermark: '#9CA3AF',
    };
  } else {
    // Light (Sandalwood / Cardamom Cream)
    colors = {
      bg: '#F5EBE1',
      surface: '#ECE1D2',
      cardBg: '#FAF4EB',
      border: 'rgba(180, 83, 9, 0.35)',
      borderCard: 'rgba(180, 83, 9, 0.18)',
      textPrimary: '#261D17',
      textSecondary: '#57463A',
      textMuted: '#7E6C5F',
      accent: '#D97706',
      accentGlow: 'rgba(217, 119, 6, 0.12)',
      badgeBg: '#FDEECC',
      badgeText: '#78350F',
      formulaBg: '#E8D9C5',
      watermark: '#7E6C5F',
    };
  }

  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, totalHeight);

  // Outer framing card
  const pad = 24;
  const cardW = width - pad * 2;
  const cardH = totalHeight - pad * 2;

  ctx.fillStyle = colors.surface;
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1.5;
  roundRect(ctx, pad, pad, cardW, cardH, 16);
  ctx.fill();
  ctx.stroke();

  // Top Accent bar
  ctx.fillStyle = colors.accent;
  roundRect(ctx, pad, pad, cardW, 6, [16, 16, 0, 0]);
  ctx.fill();

  // Header branding
  ctx.fillStyle = colors.accent;
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('RasoiScale · சமையல் அளவு', pad + 24, pad + 38);

  ctx.fillStyle = colors.textMuted;
  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Precision Indian Recipe Rescaler', pad + 24, pad + 56);

  // Date on right
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  ctx.fillStyle = colors.textMuted;
  ctx.font = '500 12px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, width - pad - 24, pad + 40);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = colors.borderCard;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad + 24, pad + 70);
  ctx.lineTo(width - pad - 24, pad + 70);
  ctx.stroke();

  // Recipe Title
  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(dishName || 'Custom Recipe', pad + 24, pad + 104);

  // Subtitle / Regional Tag & Multiplier
  const multiplier = roundToTwo(targetServings / originalServings);
  ctx.fillStyle = colors.badgeBg;
  roundRect(ctx, pad + 24, pad + 116, 110, 24, 6);
  ctx.fill();

  ctx.fillStyle = colors.badgeText;
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(region || 'Authentic Indian', pad + 32, pad + 132);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(
    `Yield: ${originalServings} servings  ➔  Target: ${targetServings} servings (${multiplier}× multiplier)`,
    pad + 146,
    pad + 133
  );

  // Ingredients Header
  let currentY = pad + 165;
  ctx.fillStyle = colors.textMuted;
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('INGREDIENTS & WORKED FORMULAS', pad + 24, currentY);

  currentY += 15;

  // Render Ingredients
  ingredients.forEach((ing, idx) => {
    const itemH = 64;
    const itemY = currentY + idx * 72;

    ctx.fillStyle = colors.cardBg;
    ctx.strokeStyle = colors.borderCard;
    roundRect(ctx, pad + 24, itemY, cardW - 48, itemH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colors.textPrimary;
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${idx + 1}.  ${ing.name}`, pad + 40, itemY + 28);

    ctx.fillStyle = colors.accent;
    ctx.font = 'bold 17px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${roundToTwo(ing.scaledAmount)} ${ing.unit}`, width - pad - 40, itemY + 28);
    ctx.textAlign = 'left';

    ctx.fillStyle = colors.formulaBg;
    roundRect(ctx, pad + 40, itemY + 36, cardW - 80, 20, 5);
    ctx.fill();

    ctx.fillStyle = colors.textMuted;
    ctx.font = '500 11px monospace';
    const formulaText = `Formula: (${roundToTwo(ing.originalAmount)} × ${roundToTwo(targetServings)}) ÷ ${roundToTwo(originalServings)} = ${roundToTwo(ing.scaledAmount)} ${ing.unit}`;
    ctx.fillText(formulaText, pad + 48, itemY + 50);
  });

  currentY += ingredients.length * 72 + 10;

  // Chef Insight box if available
  if (chefInsight) {
    ctx.fillStyle = colors.cardBg;
    ctx.strokeStyle = colors.border;
    roundRect(ctx, pad + 24, currentY, cardW - 48, 76, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colors.accent;
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('CHEF SCALING SECRET:', pad + 40, currentY + 24);

    ctx.fillStyle = colors.textSecondary;
    ctx.font = '400 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    wrapText(ctx, chefInsight, pad + 40, currentY + 44, cardW - 80, 18);

    currentY += 90;
  }

  // Footer branding
  ctx.fillStyle = colors.watermark;
  ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Generated via RasoiScale · Kitchen Precision Calculator', pad + 24, totalHeight - pad - 16);

  return canvas;
}

export async function exportRecipeToPng({
  dishName,
  region,
  originalServings,
  targetServings,
  ingredients,
  chefInsight,
  themeMode,
}: PngRenderParams): Promise<void> {
  const canvas = renderRecipeToCanvas({
    dishName,
    region,
    originalServings,
    targetServings,
    ingredients,
    chefInsight,
    themeMode,
  });

  if (!canvas) return;

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png')
  );
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (dishName || 'recipe').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const mult = roundToTwo(targetServings / originalServings);
  a.download = `rasoiscale-${safeName}-${mult}x-${themeMode}.png`;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | number[]
) {
  let tl = 0,
    tr = 0,
    br = 0,
    bl = 0;
  if (typeof r === 'number') {
    tl = tr = br = bl = r;
  } else if (Array.isArray(r)) {
    tl = r[0] || 0;
    tr = r[1] || 0;
    br = r[2] || 0;
    bl = r[3] || 0;
  }

  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
      lineCount++;
      if (lineCount >= 2) {
        line = line + '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
