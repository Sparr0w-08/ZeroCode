import React, { useState } from 'react';
import { RecipeData, ScaledIngredient } from '../types';
import { roundToTwo } from '../utils/math';
import { Printer, X, ChefHat, CheckSquare, Palette, Leaf, Download } from 'lucide-react';

interface PrintSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeData | null;
  scaledIngredients: ScaledIngredient[];
  chefInsight?: string;
  isDarkMode: boolean;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({
  isOpen,
  onClose,
  recipe,
  scaledIngredients,
  chefInsight,
  isDarkMode,
}) => {
  // Theme mode: 'theme' (follows dark/light) or 'eco' (plain monochrome)
  const [pdfThemeMode, setPdfThemeMode] = useState<'theme' | 'eco'>('theme');

  if (!isOpen || !recipe) return null;

  const multiplier = roundToTwo(recipe.targetServings / recipe.originalServings);
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isDarkPrint = pdfThemeMode === 'theme' ? isDarkMode : false;
  const printThemeClass =
    pdfThemeMode === 'eco'
      ? 'print-theme-eco'
      : isDarkMode
      ? 'print-theme-dark'
      : 'print-theme-light';

  // Direct Browser Print
  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Direct print failed, generating fallback printable file...', e);
      handleDownloadPrintableHtml();
    }
  };

  // Fallback / Direct Standalone Printable HTML file for seamless PDF printing outside iframes
  const handleDownloadPrintableHtml = () => {
    const safeTitle = (recipe.dishName || 'recipe').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const bgCol = isDarkPrint ? '#120E0B' : pdfThemeMode === 'eco' ? '#ffffff' : '#F5EBE1';
    const cardBg = isDarkPrint ? '#1A130D' : pdfThemeMode === 'eco' ? '#ffffff' : '#FAF4EB';
    const textCol = isDarkPrint ? '#FEF3C7' : pdfThemeMode === 'eco' ? '#111827' : '#261D17';
    const accentCol = isDarkPrint ? '#F59E0B' : pdfThemeMode === 'eco' ? '#111827' : '#D97706';
    const borderCol = isDarkPrint ? 'rgba(245, 158, 11, 0.4)' : pdfThemeMode === 'eco' ? '#d1d5db' : 'rgba(180, 83, 9, 0.3)';
    const boxBg = isDarkPrint ? '#241A12' : pdfThemeMode === 'eco' ? '#f9fafb' : '#ECE1D2';

    const ingredientRows = scaledIngredients
      .map(
        (ing, idx) => `
        <tr style="border-bottom: 1px solid ${borderCol}; background-color: ${idx % 2 === 1 ? (isDarkPrint ? '#1E150F' : pdfThemeMode === 'eco' ? '#f9fafb' : '#F5EBE1') : 'transparent'};">
          <td style="padding: 10px 8px; width: 32px; text-align: center; color: #888;">[ ]</td>
          <td style="padding: 10px 8px; font-weight: 600;">${ing.name} ${ing.isSpice ? '<span style="font-size: 10px; color: ' + accentCol + ';">[Spice/Salt]</span>' : ''}</td>
          <td style="padding: 10px 8px; text-align: right; font-family: monospace; color: #888;">${roundToTwo(ing.originalAmount)} ${ing.unit}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 800; font-family: monospace; font-size: 15px; color: ${accentCol};">${roundToTwo(ing.scaledAmount)} ${ing.unit}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${recipe.dishName} — RasoiScale Recipe Card</title>
  <style>
    @page { margin: 1cm; size: auto; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: ${bgCol}; color: ${textCol}; margin: 0; padding: 24px; line-height: 1.5; }
    .sheet { max-width: 760px; margin: 0 auto; background: ${cardBg}; border: 1px solid ${borderCol}; border-radius: 16px; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${borderCol}; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { font-size: 24px; font-weight: 900; color: ${accentCol}; }
    .tagline { font-size: 12px; color: #888; }
    .title { font-size: 26px; font-weight: 900; margin: 8px 0; }
    .summary-box { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: ${boxBg}; padding: 14px; border-radius: 10px; border: 1px solid ${borderCol}; margin: 16px 0; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0; }
    th { text-align: left; padding: 8px; border-bottom: 2px solid ${borderCol}; font-size: 12px; text-transform: uppercase; }
    .insight { background: ${boxBg}; border: 1px solid ${borderCol}; border-radius: 10px; padding: 16px; font-size: 13px; margin: 20px 0; }
    .notes { border-top: 1px dashed ${borderCol}; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #888; }
    .notes-box { height: 60px; border: 1px solid ${borderCol}; border-radius: 6px; margin-top: 6px; }
    .footer { display: flex; justify-content: space-between; font-size: 11px; color: #888; margin-top: 24px; border-top: 1px solid ${borderCol}; padding-top: 12px; }
    .print-bar { text-align: center; margin-bottom: 20px; }
    .btn-print { background: ${accentCol}; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; }
    @media print { .print-bar { display: none; } body { padding: 0; background: transparent; } }
  </style>
</head>
<body>
  <div class="print-bar">
    <button class="btn-print" onclick="window.print()">Print or Save as PDF (Cmd/Ctrl + P)</button>
  </div>
  <div class="sheet">
    <div class="header">
      <div>
        <div class="brand">RasoiScale · சமையல் அளவு</div>
        <div class="tagline">Precision Recipe Rescaling · Authentic Kitchen Measurements</div>
      </div>
      <div style="text-align: right; font-size: 12px; color: #888; font-family: monospace;">
        <div>Date: ${dateStr}</div>
        <div style="font-weight: bold; color: ${accentCol};">Scale: ${multiplier}× Factor</div>
      </div>
    </div>
    <div style="font-size: 12px; text-transform: uppercase; font-weight: 800; color: ${accentCol};">${recipe.cuisine}</div>
    <div class="title">${recipe.dishName}</div>
    <div class="summary-box">
      <div><strong>Original Yield:</strong> ${recipe.originalServings} Servings</div>
      <div><strong style="color: ${accentCol};">Target Yield:</strong> ${recipe.targetServings} Servings (${multiplier}× multiplier)</div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 32px;">Prep</th>
          <th>Ingredient</th>
          <th style="text-align: right;">Original</th>
          <th style="text-align: right; color: ${accentCol};">Rescaled Amount</th>
        </tr>
      </thead>
      <tbody>
        ${ingredientRows}
      </tbody>
    </table>
    ${chefInsight ? `<div class="insight"><strong style="color: ${accentCol}; display: block; margin-bottom: 4px;">Chef Scaling Wisdom:</strong>${chefInsight}</div>` : ''}
    <div class="notes">
      <strong>Kitchen Prep & Cooking Notes:</strong>
      <div class="notes-box"></div>
    </div>
    <div class="footer">
      <span>RasoiScale Kitchen Precision Sheet</span>
      <span>Formula: (Original × Target) ÷ Base Yield</span>
    </div>
  </div>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      // Auto-trigger print dialog
      setTimeout(() => window.print(), 350);
    });
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rasoiscale-${safeTitle}-printable.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="print-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6">
      <div className="print-modal-dialog relative flex max-h-[94vh] w-full max-w-3xl flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden">
        {/* Modal Action Bar (Hidden in physical print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-[var(--accent)]" />
            <div>
              <span className="text-sm font-extrabold text-[var(--text)] sm:text-base">
                Kitchen Recipe Sheet (Print / Save as PDF)
              </span>
              <p className="text-[11px] text-[var(--muted)]">
                Formatted for A4/Letter pages
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Theme Style Selector */}
            <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 text-xs">
              <button
                type="button"
                onClick={() => setPdfThemeMode('theme')}
                className={`glow-pill flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  pdfThemeMode === 'theme'
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
                title="Print PDF with active app theme styling"
              >
                <Palette className="h-3 w-3" />
                <span>Match App Theme ({isDarkMode ? 'Dark' : 'Light'})</span>
              </button>
              <button
                type="button"
                onClick={() => setPdfThemeMode('eco')}
                className={`glow-pill flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  pdfThemeMode === 'eco'
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
                title="Monochrome print to save ink"
              >
                <Leaf className="h-3 w-3" />
                <span>Eco Monochrome</span>
              </button>
            </div>

            {/* Direct Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="glow-btn flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:from-amber-500 hover:to-amber-600 active:scale-95"
              title="Trigger browser print to save as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Standalone File Fallback Button */}
            <button
              type="button"
              onClick={handleDownloadPrintableHtml}
              className="glow-btn hidden sm:flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:text-[var(--accent)]"
              title="Download standalone printable recipe file"
            >
              <Download className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Download Sheet</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="glow-btn flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] active:scale-95"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas Container */}
        <div
          className={`overflow-y-auto p-4 sm:p-8 print-container ${printThemeClass} ${
            isDarkPrint
              ? 'bg-[#120E0B] text-[#FEF3C7]'
              : pdfThemeMode === 'eco'
              ? 'bg-white text-stone-900'
              : 'bg-[#F5EBE1] text-[#261D17]'
          }`}
        >
          <div
            className={`print-paper-sheet mx-auto max-w-2xl rounded-2xl p-6 sm:p-8 border shadow-sm transition-colors ${
              isDarkPrint
                ? 'bg-[#1A130D] border-amber-500/40 text-[#FEF3C7]'
                : pdfThemeMode === 'eco'
                ? 'bg-white border-stone-300 text-stone-900'
                : 'bg-[#FAF4EB] border-amber-700/25 text-[#261D17]'
            }`}
          >
            {/* Top Brand Header */}
            <div
              className={`print-divider flex items-center justify-between border-b pb-4 ${
                isDarkPrint
                  ? 'border-amber-500/25'
                  : pdfThemeMode === 'eco'
                  ? 'border-stone-200'
                  : 'border-amber-700/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                    isDarkPrint
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  <ChefHat className="h-5 w-5" />
                </div>
                <div>
                  <h1
                    className={`print-text-accent text-xl font-black tracking-tight sm:text-2xl ${
                      isDarkPrint
                        ? 'text-amber-400'
                        : pdfThemeMode === 'eco'
                        ? 'text-stone-900'
                        : 'text-amber-700'
                    }`}
                  >
                    RasoiScale
                  </h1>
                  <p
                    className={`print-text-muted text-xs font-semibold ${
                      isDarkPrint ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    சமையல் அளவு · Precision Recipe Measurement
                  </p>
                </div>
              </div>
              <div
                className={`print-text-muted text-right text-xs font-mono ${
                  isDarkPrint ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                <div>Date: {dateStr}</div>
                <div className="font-bold">Ratio: {multiplier}×</div>
              </div>
            </div>

            {/* Recipe Details Title */}
            <div className="my-5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-bold ${
                    isDarkPrint
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : pdfThemeMode === 'eco'
                      ? 'bg-stone-100 text-stone-800 border border-stone-200'
                      : 'bg-amber-500/15 text-amber-800 border border-amber-600/20'
                  }`}
                >
                  {recipe.cuisine}
                </span>
                <span
                  className={`print-text-muted text-xs font-medium ${
                    isDarkPrint ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  {recipe.ingredients.length} items
                </span>
              </div>
              <h2
                className={`mt-2 text-2xl font-black tracking-tight sm:text-3xl ${
                  isDarkPrint ? 'text-[#FEF3C7]' : 'text-stone-900'
                }`}
              >
                {recipe.dishName}
              </h2>

              <div
                className={`print-box mt-4 grid grid-cols-2 gap-3 rounded-xl p-3.5 text-xs border ${
                  isDarkPrint
                    ? 'bg-[#241A12] border-amber-500/20'
                    : pdfThemeMode === 'eco'
                    ? 'bg-stone-50 border-stone-200'
                    : 'bg-[#ECE1D2] border-amber-700/15'
                }`}
              >
                <div>
                  <span
                    className={`print-text-muted block font-medium ${
                      isDarkPrint ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    Original Yield:
                  </span>
                  <strong className="text-sm font-bold sm:text-base">
                    {recipe.originalServings} Servings
                  </strong>
                </div>
                <div>
                  <span
                    className={`print-text-accent block font-bold ${
                      isDarkPrint ? 'text-amber-400' : 'text-amber-700'
                    }`}
                  >
                    Rescaled Target:
                  </span>
                  <strong
                    className={`print-text-accent text-sm font-black sm:text-base ${
                      isDarkPrint ? 'text-amber-400' : 'text-amber-700'
                    }`}
                  >
                    {recipe.targetServings} Servings ({multiplier}× scale)
                  </strong>
                </div>
              </div>
            </div>

            {/* Ingredients Table with Checklist Box for prep */}
            <div className="my-6">
              <h3
                className={`print-text-muted mb-2 text-xs font-bold uppercase tracking-wider ${
                  isDarkPrint ? 'text-stone-400' : 'text-stone-600'
                }`}
              >
                Rescaled Ingredients &amp; Prep Checklist
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b-2 ${
                      isDarkPrint
                        ? 'border-amber-500/30 text-stone-300'
                        : pdfThemeMode === 'eco'
                        ? 'border-stone-300 text-stone-600'
                        : 'border-amber-700/25 text-stone-700'
                    }`}
                  >
                    <th className="py-2.5 pr-2 font-bold w-9">Prep</th>
                    <th className="py-2.5 pr-2 font-bold">Ingredient</th>
                    <th className="py-2.5 px-2 text-right font-bold">Original</th>
                    <th
                      className={`print-text-accent py-2.5 pl-2 text-right font-black ${
                        isDarkPrint ? 'text-amber-400' : 'text-amber-700'
                      }`}
                    >
                      Rescaled Amount
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkPrint
                      ? 'divide-amber-500/15'
                      : pdfThemeMode === 'eco'
                      ? 'divide-stone-200'
                      : 'divide-amber-700/15'
                  }`}
                >
                  {scaledIngredients.map((ing, idx) => (
                    <tr
                      key={ing.id || idx}
                      className={
                        idx % 2 === 1
                          ? isDarkPrint
                            ? 'print-row-odd bg-[#201610]'
                            : pdfThemeMode === 'eco'
                            ? 'bg-stone-50'
                            : 'print-row-odd bg-[#F5EBE1]'
                          : ''
                      }
                    >
                      <td className="py-2.5 pr-2 align-middle opacity-60">
                        <CheckSquare className="h-4 w-4" />
                      </td>
                      <td className="py-2.5 pr-2 font-semibold">
                        <span>{ing.name}</span>
                        {ing.isSpice && (
                          <span
                            className={`ml-1 text-[10px] font-bold ${
                              isDarkPrint ? 'text-amber-400' : 'text-amber-600'
                            }`}
                          >
                            [Spice/Salt]
                          </span>
                        )}
                      </td>
                      <td
                        className={`print-text-muted py-2.5 px-2 text-right font-mono ${
                          isDarkPrint ? 'text-stone-400' : 'text-stone-500'
                        }`}
                      >
                        {roundToTwo(ing.originalAmount)} {ing.unit}
                      </td>
                      <td
                        className={`print-text-accent py-2.5 pl-2 text-right font-black font-mono text-sm sm:text-base ${
                          isDarkPrint ? 'text-amber-400' : 'text-amber-700'
                        }`}
                      >
                        {roundToTwo(ing.scaledAmount)} {ing.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chef Scaling Secret */}
            {chefInsight && (
              <div
                className={`print-box my-5 rounded-xl border p-4 text-xs ${
                  isDarkPrint
                    ? 'bg-[#241A12] border-amber-500/30 text-stone-200'
                    : pdfThemeMode === 'eco'
                    ? 'bg-stone-50 border-stone-200 text-stone-800'
                    : 'bg-[#ECE1D2] border-amber-700/20 text-[#261D17]'
                }`}
              >
                <strong
                  className={`print-text-accent block font-bold mb-1 ${
                    isDarkPrint ? 'text-amber-400' : 'text-amber-800'
                  }`}
                >
                  Chef Scaling Wisdom:
                </strong>
                <p className="leading-relaxed opacity-90">{chefInsight}</p>
              </div>
            )}

            {/* Kitchen Notes Section */}
            <div
              className={`print-divider mt-6 border-t border-dashed pt-4 ${
                isDarkPrint
                  ? 'border-amber-500/25'
                  : pdfThemeMode === 'eco'
                  ? 'border-stone-300'
                  : 'border-amber-700/25'
              }`}
            >
              <h4
                className={`print-text-muted text-[11px] font-bold uppercase tracking-wider ${
                  isDarkPrint ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                Kitchen Prep &amp; Cook Notes:
              </h4>
              <div
                className={`mt-2 h-16 rounded-lg border p-2 text-xs italic ${
                  isDarkPrint
                    ? 'border-amber-500/20 bg-[#201610] text-stone-400'
                    : pdfThemeMode === 'eco'
                    ? 'border-stone-200 bg-stone-50 text-stone-400'
                    : 'border-amber-700/15 bg-[#F5EBE1] text-stone-500'
                }`}
              >
                Write cooking observations, timing adjustments, or tasting notes here...
              </div>
            </div>

            {/* Footer watermark */}
            <div
              className={`print-divider print-text-muted mt-6 flex justify-between border-t pt-3 text-[10px] ${
                isDarkPrint
                  ? 'border-amber-500/20 text-stone-400'
                  : pdfThemeMode === 'eco'
                  ? 'border-stone-200 text-stone-500'
                  : 'border-amber-700/20 text-stone-500'
              }`}
            >
              <span>RasoiScale Kitchen Sheet</span>
              <span>Formula: (Orig × Target) ÷ Makes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
