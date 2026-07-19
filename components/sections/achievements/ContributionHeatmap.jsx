"use client";

import { useMemo, useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

function isoOf(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Build a GitHub-style week grid for a given year.
 * Returns weeks[] where each week is 7 cells (Sun→Sat).
 * Cells outside the target year have count === null (rendered as invisible spacers).
 */
function buildYearWeeks(calendar, year) {
  const start = new Date(Date.UTC(year, 0, 1));
  start.setUTCDate(start.getUTCDate() - start.getUTCDay()); // back to Sunday

  const end = new Date(Date.UTC(year, 11, 31));
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay())); // forward to Saturday

  const weeks = [];
  const cur = new Date(start);
  while (cur <= end) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const inYear = cur.getUTCFullYear() === year;
      const iso = isoOf(cur);
      week.push({ date: iso, count: inYear ? calendar[iso] || 0 : null });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/** Determine which column each month label should sit above. */
function monthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstInYear = week.find((c) => c.count !== null);
    if (!firstInYear) return;
    const month = new Date(firstInYear.date).getUTCMonth();
    if (month !== lastMonth) {
      labels.push({ col: i, label: MONTHS[month] });
      lastMonth = month;
    }
  });
  return labels;
}

function levelFor(count, thresholds) {
  if (count <= 0) return 0;
  if (count <= thresholds[0]) return 1;
  if (count <= thresholds[1]) return 2;
  if (count <= thresholds[2]) return 3;
  return 4;
}

/**
 * ContributionHeatmap — reusable GitHub-style calendar heatmap with a year
 * selector, month labels, weekday labels, and a legend.
 *
 * @param {{
 *   calendar: Record<string, number>,   // { "YYYY-MM-DD": count } (non-zero days)
 *   colors: string[],                    // 5 tailwind bg classes, index 0 = empty
 *   unit?: string,                       // e.g. "submissions" | "contributions"
 * }} props
 */
export default function ContributionHeatmap({ calendar, colors, unit = "contributions" }) {
  const { years, defaultYear } = useMemo(() => {
    const dataYears = new Set();
    for (const d of Object.keys(calendar || {})) {
      const y = Number(d.slice(0, 4));
      if (Number.isFinite(y)) dataYears.add(y);
    }
    const current = new Date().getUTCFullYear();
    // Selector always includes the current year so it's navigable, even if empty.
    const all = new Set([...dataYears, current]);
    const sorted = Array.from(all).sort((a, b) => b - a);
    // Default to the most recent year that actually has data (fall back to current).
    const withData = Array.from(dataYears).sort((a, b) => b - a);
    return { years: sorted, defaultYear: withData[0] ?? current };
  }, [calendar]);

  const [year, setYear] = useState(null);
  const activeYear = year != null && years.includes(year) ? year : defaultYear;

  const weeks = useMemo(() => buildYearWeeks(calendar || {}, activeYear), [calendar, activeYear]);
  const labels = useMemo(() => monthLabels(weeks), [weeks]);

  const { yearTotal, thresholds } = useMemo(() => {
    const counts = [];
    let total = 0;
    for (const w of weeks) {
      for (const c of w) {
        if (c.count && c.count > 0) {
          counts.push(c.count);
          total += c.count;
        }
      }
    }
    counts.sort((a, b) => a - b);
    // quartile-based thresholds so color scale adapts to the year's intensity
    const q = (p) => counts.length ? counts[Math.min(counts.length - 1, Math.floor(p * counts.length))] : 0;
    return { yearTotal: total, thresholds: [q(0.25) || 1, q(0.5) || 2, q(0.75) || 4] };
  }, [weeks]);

  return (
    <div className="w-full">
      {/* Year selector */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <span className="text-xs text-text-dim">
          <span className="text-text-primary font-medium">{yearTotal}</span> {unit} in {activeYear}
        </span>
        <div className="flex gap-1 flex-wrap">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={
                "px-2 py-0.5 rounded-md text-xs font-mono transition-colors " +
                (y === activeYear
                  ? "bg-white/15 text-text-primary"
                  : "text-text-dim hover:text-text-muted hover:bg-white/5")
              }
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-1 min-w-max">
          {/* Month labels */}
          <div className="flex gap-[3px] pl-7 h-3 relative">
            {weeks.map((_, i) => {
              const lbl = labels.find((l) => l.col === i);
              return (
                <div key={i} className="w-[11px] relative">
                  {lbl && (
                    <span className="absolute -top-0.5 left-0 text-[9px] text-text-dim whitespace-nowrap">
                      {lbl.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Weekday labels + cells */}
          <div className="flex gap-[3px]">
            {/* weekday column */}
            <div className="flex flex-col gap-[3px] pr-1 w-6">
              {WEEKDAYS.map((d, i) => (
                <div key={i} className="h-[11px] text-[9px] text-text-dim leading-[11px]">
                  {d}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell, di) => {
                  if (cell.count === null) {
                    return <div key={di} className="w-[11px] h-[11px]" />;
                  }
                  const lvl = levelFor(cell.count, thresholds);
                  return (
                    <div
                      key={di}
                      aria-label={`${cell.count} ${unit} on ${cell.date}`}
                      title={`${cell.count} ${unit} on ${cell.date}`}
                      className={`w-[11px] h-[11px] rounded-sm ${colors[lvl]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-text-dim">
        <span>Less</span>
        {colors.map((c, i) => (
          <div key={i} className={`w-[11px] h-[11px] rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
