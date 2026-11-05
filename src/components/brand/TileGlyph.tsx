/**
 * A 3×3 icon drawn from the logo grid. `ink` tiles are solid, the rest are outlined, `accent` is signal blue and
 * `slot` stays open. Inside a `.group`, hovering slides the `mover` tile into the open slot, the brand's one move.
 * Tiles pop in with a stagger when their [data-reveal] parent comes into view (see .glyph in globals.css).
 */
type TileGlyphProps = {
  ink?: number[];
  accent?: number;
  slot?: number;
  mover?: number;
  className?: string;
  tone?: "light" | "dark";
};

const CELL = 18;
const GAP = 5;
const pos = (i: number) => ({ x: (i % 3) * (CELL + GAP), y: Math.floor(i / 3) * (CELL + GAP) });

export default function TileGlyph({ ink = [0, 2, 4, 6], accent = 4, slot = 8, mover, className = "size-10", tone = "light" }: TileGlyphProps) {
  // Default mover: the tile left of the slot, or above it.
  const m = mover ?? (slot % 3 > 0 ? slot - 1 : slot - 3);
  const to = pos(slot);
  const from = pos(m);
  const outline = tone === "light" ? "var(--color-line)" : "var(--color-edge)";
  const solid = tone === "light" ? "var(--color-ink)" : "var(--color-paper)";

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`glyph shrink-0 overflow-visible ${className}`}>
      {Array.from({ length: 9 }, (_, i) => {
        const { x, y } = pos(i);
        if (i === slot) {
          return <rect key={i} x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx="4" fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="3 3" className="glyph-slot" />;
        }
        const fill = i === accent ? "var(--color-signal)" : ink.includes(i) ? solid : "none";
        return (
          <rect
            key={i}
            x={x + (fill === "none" ? 0.75 : 0)}
            y={y + (fill === "none" ? 0.75 : 0)}
            width={fill === "none" ? CELL - 1.5 : CELL}
            height={fill === "none" ? CELL - 1.5 : CELL}
            rx="4.5"
            fill={fill}
            stroke={fill === "none" ? outline : "none"}
            strokeWidth="1.5"
            className={i === m ? "glyph-mover" : undefined}
            style={{ "--i": i, "--dx": `${to.x - from.x}px`, "--dy": `${to.y - from.y}px` } as React.CSSProperties}
          />
        );
      })}
    </svg>
  );
}

/** A stable, varied set of glyphs for lists, so neighbouring cards never share an icon. */
export const glyphs: TileGlyphProps[] = [
  { ink: [0, 1, 3], accent: 4, slot: 8 },
  { ink: [1, 3, 5, 7], accent: 0, slot: 8 },
  { ink: [0, 2, 6], accent: 4, slot: 5 },
  { ink: [3, 4, 5], accent: 1, slot: 8 },
  { ink: [0, 4], accent: 2, slot: 6 },
  { ink: [2, 5, 6, 7], accent: 4, slot: 0 },
  { ink: [1, 4, 7], accent: 3, slot: 8 },
  { ink: [0, 3, 6, 7], accent: 5, slot: 2 },
];
