import { useState } from "react";

const W = 600, H = 600, CX = 300, CY = 300, R = 178, CR = 52;

const SEGS = [
  { name: "Sleep",              short: "Sleep",           start: 22.5, dur: 5,   color: "#7B2FBE" },
  { name: "Quiet Time",         short: "Quiet\nTime",     start: 3.5,  dur: 2,   color: "#E8453C" },
  { name: "Exercise & Runs",    short: "Exercise",        start: 5.5,  dur: 0.5, color: "#F97316" },
  { name: "Prep for Class",     short: "Prep",            start: 6,    dur: 1,   color: "#22C55E" },
  { name: "School (Morning)",   short: "School\nAM",      start: 7,    dur: 7.5, color: "#1E3A8A" },
  { name: "School (Afternoon)", short: "School PM",       start: 14.5, dur: 1.5, color: "#60A5FA" },
  { name: "Church & Midweek",   short: "Church &\nMidweek", start: 16, dur: 4,   color: "#EAB308" },
  { name: "Study",              short: "Study",           start: 20,   dur: 2.5, color: "#9CA3AF" },
];

// REVERSED: noon at top, midnight at bottom
// h=12 → -90° (top), h=0/24 → 90° (bottom), h=6 → 180° (left), h=18 → 0° (right)
const d2r = d => d * Math.PI / 180;
const toDeg = h => (h / 24) * 360 + 90;
const polar = (deg, r) => [CX + r * Math.cos(d2r(deg)), CY + r * Math.sin(d2r(deg))];

const slicePath = (start, dur) => {
  const sa = toDeg(start), ea = toDeg(start + dur);
  const [sx, sy] = polar(sa, R), [ex, ey] = polar(ea, R);
  return `M${CX},${CY}L${sx.toFixed(2)},${sy.toFixed(2)}A${R},${R},0,${dur > 12 ? 1 : 0},1,${ex.toFixed(2)},${ey.toFixed(2)}Z`;
};

const fmt = h => {
  const rh = ((h % 24) + 24) % 24;
  const hr = Math.floor(rh) % 12 || 12;
  const mn = Math.round((rh % 1) * 60).toString().padStart(2, "0");
  return `${hr}:${mn} ${Math.floor(rh) < 12 ? "AM" : "PM"}`;
};

const hm = h => {
  const hrs = Math.floor(h), mn = Math.round((h - hrs) * 60);
  return hrs === 0 ? `${mn}m` : mn === 0 ? `${hrs}h` : `${hrs}h ${mn}m`;
};

// Sun rays (8 spokes)
const SUN_R = 11, RAY_IN = 15, RAY_OUT = 21;
const SUN_Y = CY - CR * 0.42;
const MOON_Y = CY + CR * 0.42;

const SunIcon = () => (
  <g>
    {[...Array(8)].map((_, k) => {
      const a = d2r(k * 45);
      return (
        <line key={k}
          x1={(CX + RAY_IN * Math.cos(a)).toFixed(2)}
          y1={(SUN_Y + RAY_IN * Math.sin(a)).toFixed(2)}
          x2={(CX + RAY_OUT * Math.cos(a)).toFixed(2)}
          y2={(SUN_Y + RAY_OUT * Math.sin(a)).toFixed(2)}
          stroke="#F59E0B" strokeWidth={2.2} strokeLinecap="round" />
      );
    })}
    <circle cx={CX} cy={SUN_Y} r={SUN_R} fill="#FCD34D" stroke="#F59E0B" strokeWidth={1.5} />
  </g>
);

// Crescent moon: white circle with dark cutout offset
const MoonIcon = () => (
  <g>
    <circle cx={CX - 1} cy={MOON_Y} r={13} fill="white" />
    <circle cx={CX + 6} cy={MOON_Y - 2} r={10} fill="#0a1628" />
  </g>
);

export default function App() {
  const [hov, setHov] = useState(null);
  const SMALL = 1.8;

  return (
    <div style={{
      minHeight: "100vh", background: "#070710",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: "20px 12px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <p style={{ color: "#444", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 4px" }}>
        24-Hour Daily Schedule
      </p>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", color: "#fff", fontSize: 26, margin: "0 0 12px", fontWeight: 400 }}>
        Life Clock
      </h1>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ maxWidth: "min(100%, 88vw)", maxHeight: "min(600px, 88vw)" }}>
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#141428" />
            <stop offset="100%" stopColor="#070710" />
          </radialGradient>
          {/* Clip: top half of center circle (day) */}
          <clipPath id="dayClip">
            <rect x={CX - CR - 2} y={CY - CR - 2} width={(CR + 2) * 2} height={CR + 2} />
          </clipPath>
          {/* Clip: bottom half of center circle (night) */}
          <clipPath id="nightClip">
            <rect x={CX - CR - 2} y={CY} width={(CR + 2) * 2} height={CR + 2} />
          </clipPath>
          {/* Clip sun icon to top half */}
          <clipPath id="sunClip">
            <rect x={CX - CR} y={CY - CR} width={CR * 2} height={CR} />
          </clipPath>
        </defs>

        {/* Background disc */}
        <circle cx={CX} cy={CY} r={R + 52} fill="url(#bgGrad)" />
        <circle cx={CX} cy={CY} r={R + 52} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />

        {/* Pie slices */}
        {SEGS.map((s, i) => (
          <path key={i} d={slicePath(s.start, s.dur)}
            fill={s.color} stroke="#070710" strokeWidth={2.5}
            opacity={hov === null || hov === i ? 1 : 0.28}
            style={{
              transition: "opacity 0.2s, filter 0.2s", cursor: "pointer",
              filter: hov === i ? `drop-shadow(0 0 12px ${s.color}bb)` : "",
            }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)} />
        ))}

        {/* Clock ring */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2} />

        {/* 24 hour tick marks */}
        {[...Array(24)].map((_, h) => {
          const a = toDeg(h);
          const major = h % 6 === 0, half = h % 3 === 0 && !major;
          const [x1, y1] = polar(a, R + 2);
          const [x2, y2] = polar(a, R + (major ? 17 : half ? 11 : 6));
          return (
            <line key={h} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={major ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.3)"}
              strokeWidth={major ? 2.5 : 1} />
          );
        })}

        {/* Outer tick ring */}
        <circle cx={CX} cy={CY} r={R + 20} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />

        {/* Cardinal labels — now noon at top, midnight at bottom */}
        {[
          { h: 12, l: "12 PM" },  // top
          { h: 18, l: "6 PM" },   // right
          { h: 0,  l: "12 AM" },  // bottom
          { h: 6,  l: "6 AM" },   // left
        ].map(({ h, l }) => {
          const [x, y] = polar(toDeg(h), R + 33);
          return (
            <text key={h} x={x} y={y} fill="rgba(255,255,255,0.65)"
              textAnchor="middle" dominantBaseline="middle"
              fontSize={10} fontWeight={700} fontFamily="'DM Sans',sans-serif">{l}</text>
          );
        })}

        {/* Segment labels */}
        {SEGS.map((s, i) => {
          const midA = toDeg(s.start + s.dur / 2);
          const cosM = Math.cos(d2r(midA)), sinM = Math.sin(d2r(midA));
          const small = s.dur < SMALL;

          if (!small) {
            const [lx, ly] = polar(midA, R * 0.57);
            const lines = s.short.split("\n");
            const lineH = 15;
            const topOff = -((lines.length - 1) / 2) * lineH;
            return (
              <g key={i} style={{ pointerEvents: "none" }}>
                {lines.map((ln, li) => (
                  <text key={li} x={lx} y={ly + topOff + li * lineH}
                    fill="rgba(255,255,255,0.93)" textAnchor="middle" dominantBaseline="middle"
                    fontSize={12} fontWeight={700} fontFamily="'DM Sans',sans-serif">{ln}</text>
                ))}
                <text x={lx} y={ly + topOff + lines.length * lineH}
                  fill="rgba(255,255,255,0.52)" textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fontFamily="'DM Sans',sans-serif">{hm(s.dur)}</text>
              </g>
            );
          } else {
            const p1 = [CX + (R - 6) * cosM, CY + (R - 6) * sinM];
            const p2 = [CX + (R + 22) * cosM, CY + (R + 22) * sinM];
            const horiz = cosM >= 0 ? 30 : -30;
            const p3 = [p2[0] + horiz, p2[1]];
            const anc = cosM >= 0 ? "start" : "end";
            const tx = p3[0] + (cosM >= 0 ? 3 : -3);
            return (
              <g key={i} style={{ pointerEvents: "none" }}>
                <polyline
                  points={`${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} ${p3[0].toFixed(1)},${p3[1].toFixed(1)}`}
                  fill="none" stroke={s.color} strokeWidth={1.5} />
                <text x={tx} y={p3[1] - 7} fill={s.color}
                  textAnchor={anc} dominantBaseline="middle"
                  fontSize={10} fontWeight={700} fontFamily="'DM Sans',sans-serif">{s.short}</text>
                <text x={tx} y={p3[1] + 7} fill="rgba(255,255,255,0.42)"
                  textAnchor={anc} dominantBaseline="middle"
                  fontSize={9} fontFamily="'DM Sans',sans-serif">{hm(s.dur)}</text>
              </g>
            );
          }
        })}

        {/* ── CENTER DAY / NIGHT ICON ── */}
        {/* Day half: white bg */}
        <circle cx={CX} cy={CY} r={CR} fill="white" clipPath="url(#dayClip)" />
        {/* Night half: dark navy bg */}
        <circle cx={CX} cy={CY} r={CR} fill="#0a1628" clipPath="url(#nightClip)" />

        {/* Sun (clipped to day half) */}
        <g clipPath="url(#sunClip)">
          <SunIcon />
        </g>

        {/* Moon (in night half) */}
        <MoonIcon />

        {/* Dividing line across center */}
        <line
          x1={CX - CR} y1={CY} x2={CX + CR} y2={CY}
          stroke="rgba(120,120,160,0.5)" strokeWidth={1.5} />

        {/* Center circle border */}
        <circle cx={CX} cy={CY} r={CR} fill="none"
          stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      </svg>

      {/* Hover info bar */}
      <div style={{ height: 54, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4, width: "100%", maxWidth: 520 }}>
        {hov !== null ? (() => {
          const s = SEGS[hov];
          return (
            <div style={{
              display: "flex", gap: 16, alignItems: "center",
              padding: "10px 24px", borderRadius: 12,
              background: `${s.color}18`, border: `1px solid ${s.color}55`,
            }}>
              <div style={{ width: 13, height: 13, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#777" }}>{fmt(s.start)} – {fmt(s.start + s.dur)}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginLeft: 8 }}>{hm(s.dur)}</div>
            </div>
          );
        })() : (
          <p style={{ color: "#333", fontSize: 11, margin: 0 }}>Hover a segment to see details</p>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 12px", marginTop: 8, maxWidth: 520, width: "100%" }}>
        {SEGS.map((s, i) => (
          <div key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 8px", borderRadius: 8, cursor: "pointer",
              background: hov === i ? `${s.color}1e` : "rgba(255,255,255,0.025)",
              border: `1px solid ${hov === i ? s.color + "55" : "rgba(255,255,255,0.06)"}`,
              transition: "all 0.2s",
            }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#ccc", lineHeight: 1.2 }}>{s.name}</div>
              <div style={{ fontSize: 9, color: "#555" }}>{hm(s.dur)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
